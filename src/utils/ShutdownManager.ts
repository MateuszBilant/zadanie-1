import type { PrismaClient } from "@prisma/client/extension";
import type { Express } from "express";
import { Server } from "http";

/**
 * Manages application shutdown process for Express applications
 */
export class ShutdownManager {
  private static isShuttingDown = false;
  private static shutdownTasks: Array<() => Promise<void>> = [];
  private static httpServer: Server | null = null;
  private static expressApp: Express | null = null;
  private static connectionTimeout = 10000; // 10 seconds timeout for connections
  private static prisma: PrismaClient | null = null;

  /**
   * Initializes shutdown manager and registers signal handlers
   * @param app Express application
   * @param options Optional configuration options
   */
  public static init(
    app: Express,
    options: {
      connectionTimeout?: number;
      prisma?: PrismaClient;
    } = {},
  ): void {
    this.expressApp = app;

    // Store Prisma client if provided
    if (options.prisma) {
      this.prisma = options.prisma;
    }

    // Set connection timeout if provided
    if (options.connectionTimeout) {
      this.connectionTimeout = options.connectionTimeout;
    }

    // Add task to disconnect Prisma
    if (this.prisma) {
      this.addTask(async () => {
        console.info("Disconnecting from database...");
        await this.prisma!.$disconnect();
        console.info("Database connection closed");
      });
    }

    // Register handlers for system signals
    process.on("SIGTERM", () => this.gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => this.gracefulShutdown("SIGINT"));

    // Handle nodemon restarts
    process.on("SIGUSR2", () => this.gracefulShutdown("SIGUSR2"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error({ err: error }, "Uncaught exception");
      this.gracefulShutdown("uncaughtException");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason) => {
      console.error({ err: reason }, "Unhandled promise rejection");
      this.gracefulShutdown("unhandledRejection");
    });

    console.info("Shutdown manager initialized");
  }

  /**
   * Zarejestruj serwer HTTP po jego utworzeniu przez Express
   * @param server Instancja serwera HTTP utworzona przez app.listen()
   */
  public static registerHttpServer(server: Server): void {
    this.httpServer = server;
    console.info("HTTP server registered with ShutdownManager");
  }

  /**
   * Sets the Prisma client
   * @param prisma PrismaClient instance
   */
  public static setPrisma(prisma: PrismaClient): void {
    this.prisma = prisma;

    // Add task to disconnect Prisma if not already added
    const hasPrismaTask = this.shutdownTasks.some((task) =>
      task.toString().includes("$disconnect"),
    );

    if (!hasPrismaTask) {
      this.addTask(async () => {
        console.info("Disconnecting from database...");
        await this.prisma!.$disconnect();
        console.info("Database connection closed");
      });
    }
  }

  /**
   * Adds a task to be executed during shutdown
   * @param task Function to execute during shutdown
   */
  public static addTask(task: () => Promise<void>): void {
    this.shutdownTasks.push(task);
  }

  /**
   * Performs graceful shutdown of the application
   * @param signal Signal that triggered the shutdown
   */
  private static async gracefulShutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      console.info("Shutdown already in progress, ignoring signal");
      return;
    }

    this.isShuttingDown = true;
    console.info(`Starting application shutdown (signal: ${signal})...`);

    // Set a timeout to force exit if shutdown takes too long
    const forceExitTimeout = setTimeout(() => {
      console.error("Shutdown timeout exceeded - forcing exit");
      process.exit(1);
    }, 60000); // 60 seconds total shutdown timeout

    try {
      // Stop accepting new connections
      if (this.httpServer) {
        console.info("Stopping HTTP server...");
        await this.closeServer();
        console.info("HTTP server has been stopped");
      } else {
        console.warn("No HTTP server to stop - app.listen() must be captured");
      }

      // Execute all registered shutdown tasks
      console.info(`Executing ${this.shutdownTasks.length} shutdown tasks...`);
      for (const task of this.shutdownTasks) {
        try {
          await task();
        } catch (taskError) {
          console.error({ err: taskError }, "Error executing shutdown task");
          // Continue with other tasks despite errors
        }
      }

      // Clear force exit timeout as we've completed gracefully
      clearTimeout(forceExitTimeout);
      console.info("Application has been shut down properly");

      // Small delay to ensure logs are flushed
      setTimeout(() => {
        process.exit(0);
      }, 500); // Increased for better chance of log flushing
    } catch (error) {
      console.error({ err: error }, "Error during application shutdown");
      clearTimeout(forceExitTimeout);
      process.exit(1);
    }
  }

  /**
   * Closes the Express HTTP server gracefully
   * @returns Promise that resolves when server is closed
   */
  private static closeServer(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.httpServer) {
        resolve();
        return;
      }

      try {
        // Check if server is already closing or closed
        if (!this.httpServer.listening) {
          console.info("Server is already closed");
          resolve();
          return;
        }

        // Correctly close the HTTP server
        this.httpServer.close((err) => {
          if (err) {
            console.error({ err }, "Error closing HTTP server");
            // Still resolve, as we want to proceed with other shutdown tasks
          }
          resolve();
        });

        // Set a timeout for existing connections
        setTimeout(() => {
          console.warn(
            `Connection timeout (${this.connectionTimeout}ms) exceeded, forcing server close`,
          );
          resolve();
        }, this.connectionTimeout);
      } catch (error) {
        console.error({ err: error }, "Exception while closing server");
        resolve(); // Still resolve to continue shutdown
      }
    });
  }

  /**
   * Manually triggers shutdown process (useful for testing)
   * @param reason Reason for shutdown
   */
  public static triggerShutdown(reason: string): void {
    this.gracefulShutdown(reason);
  }
}
