CREATE TABLE "user_route"
(
    "user_id"     varchar(255) NOT NULL,
    "route_id"    varchar(255) NOT NULL,
    "created_at"  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("user_id", "route_id"),
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
    FOREIGN KEY ("route_id") REFERENCES "route"("id") ON DELETE CASCADE
);
