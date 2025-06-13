CREATE TABLE "route"
(
    "id"            varchar(255) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "title"         varchar(255) NOT NULL,
    "description"   text NOT NULL DEFAULT '',
    "price_roubles" int NOT NULL DEFAULT 0,
    "created_at"    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "taskpoint"
(
    "id"          varchar(255) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "title"       varchar(255) NOT NULL,
    "description" text NOT NULL DEFAULT '',
    "task"        text NOT NULL DEFAULT '',
    "location"    geography NOT NULL,
    "score"       int NOT NULL DEFAULT 0,
    "created_at"  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

CREATE TABLE "route_taskpoint"
(
    "route_id"     varchar(255) NOT NULL,
    "taskpoint_id" varchar(255) NOT NULL,
    "order_index"  int NOT NULL DEFAULT 0,
    "created_at"   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("route_id", "taskpoint_id"),
    FOREIGN KEY ("route_id") REFERENCES "route"("id") ON DELETE CASCADE,
    FOREIGN KEY ("taskpoint_id") REFERENCES "taskpoint"("id") ON DELETE CASCADE
);
