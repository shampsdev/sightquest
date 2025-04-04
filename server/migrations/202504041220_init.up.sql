CREATE TABLE "user"
(
    "id"         varchar(255) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "username"   varchar(255) UNIQUE NOT NULL,
    "email"      varchar(255) UNIQUE NOT NULL,
    "password"   varchar(255) NOT NULL,
    "avatar"     text NOT NULL DEFAULT '',
    "background" text NOT NULL DEFAULT '',
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
