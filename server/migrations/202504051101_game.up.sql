CREATE TABLE "game"
(
    "id"          varchar(255) UNIQUE NOT NULL,
    "admin_id"    varchar(255) NOT NULL,
    "state"       varchar(255) NOT NULL,
    "created_at"  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" timestamp
);
