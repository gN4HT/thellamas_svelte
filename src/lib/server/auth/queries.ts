import {db} from "$lib/server/db";
import {users} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";

export async function getUserAccessToken(userId: string) {

    const result = db.select().from(users).where(eq(users.id, userId)).get(); // Use `.get()` instead of `.first()`

    return result?.token || null;
}

export async function getUserId(userId: string) {
    const result = db.select().from(users).where(eq(users.id, userId)).get();
    return result?.id || null;
}