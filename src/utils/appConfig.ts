import { InternalError } from "./httpErrors.js";

export class AppConfig {
  public static getPort() {
    const port = process.env.PORT;

    if (!port) {
      throw new InternalError("Unrecognized port");
    }

    return port;
  }
}
