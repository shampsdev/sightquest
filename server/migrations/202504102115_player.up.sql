CREATE TABLE "player"
(
    "game_id"     varchar(255) NOT NULL,
    "user_id"     varchar(255) NOT NULL,
    "role"        varchar(255) NOT NULL,
    "score"       int NOT NULL DEFAULT 0,
    "location"    geography NOT NULL,
    "created_at"  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("game_id", "user_id"),
    FOREIGN KEY ("user_id") REFERENCES "user"("id"),
    FOREIGN KEY ("game_id") REFERENCES "game"("id")
);
