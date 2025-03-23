import {Lucia} from "lucia";
import {dev} from "$app/environment";

import {BetterSqlite3Adapter} from "@lucia-auth/adapter-sqlite";
import {sqlite} from "$lib/server/db";

interface DatabaseSessionAttributes {
    created_at: Date;
    updated_at: Date;
}

const adapter = new BetterSqlite3Adapter(sqlite, {
    user: "access_tokens",
    session: "sessions",
});
const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev,
        },
    },
    getSessionAttributes: (attributes) => {
        return {
            created_at: attributes.created_at,
            updated_at: attributes.updated_at,
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseSessionAttributes: DatabaseSessionAttributes;
    }
}

export {lucia};