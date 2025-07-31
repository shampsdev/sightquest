import { createLogger } from "../custom/bucket-logger";

export const logger = createLogger(
  ["geo", "socket", "socket-geo", "ui", "game"],
  {
    filter: ["socket", "ui"],
  }
);
