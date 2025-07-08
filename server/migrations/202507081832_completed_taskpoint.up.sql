CREATE TABLE "completed_taskpoint"
(
    "player_id"  varchar(255) NOT NULL,
    "game_id"    varchar(255) NOT NULL,
    "point_id"   varchar(255) NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT (now() at time zone 'utc'),
    "photo"      text NOT NULL DEFAULT '',
    "score"      int NOT NULL,

    PRIMARY KEY ("player_id", "game_id", "point_id"),
    FOREIGN KEY ("player_id") REFERENCES "user"("id") ON DELETE CASCADE,
    FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE,
    FOREIGN KEY ("point_id") REFERENCES "taskpoint"("id") ON DELETE CASCADE
);
