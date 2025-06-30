CREATE TABLE "poll"
(
    "id" varchar(255) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "type" varchar(255) NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" integer,
    "data" jsonb NULL,
    "result" jsonb NULL,
    "game_id" varchar(255) NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE
);

CREATE TABLE "vote"
(
    "poll_id" varchar(255) NOT NULL,
    "player_id" varchar(255) NOT NULL,
    "game_id" varchar(255) NOT NULL,
    "type" varchar(255) NOT NULL,
    "data" jsonb NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("poll_id", "player_id"),
    FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE CASCADE
);
