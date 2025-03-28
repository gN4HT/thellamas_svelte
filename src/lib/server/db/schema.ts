import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {generateId} from "lucia";

const timestamp = {
    createdAt: integer("created_at", {mode: "timestamp"})
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", {mode: "timestamp"})
        .notNull()
        .$defaultFn(() => new Date()),
};


const users = sqliteTable("access_tokens", {
    id: text("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => generateId(15)),
    token: text().unique().notNull(),
    user_id: text('user_id').unique().notNull()
});


const sessions = sqliteTable("sessions", {
    id: text("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => generateId(15)),
    expiresAt: integer("expires_at").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id),
    ...timestamp,
});

export {sessions, users};