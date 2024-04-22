import { loadEnvConfig } from "@next/env";

import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { sql } from "@vercel/postgres";

const dev = process.env.NODE_ENV !== "production";
loadEnvConfig("./", dev);

export const db = drizzle(sql);
migrate(db, { migrationsFolder: "./drizzle" }).then(() => {
    console.log('migrate successful')
}).catch(err => {
    console.log('migrate failed: ' + err.message);
});