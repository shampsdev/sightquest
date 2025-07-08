import { createLogger } from "../custom/bucket-logger";

export const logger = createLogger(["geo", "socket", "ui", "game"], {
  filter: ["socket", "ui"],
});
