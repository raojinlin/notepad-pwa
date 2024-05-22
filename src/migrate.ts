import { config } from 'dotenv';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { drizzle } from 'drizzle-orm/postgres-js';

config({ path: '.env.local' });

export const db = drizzle(postgres(process.env.POSTGRES_URL, { ssl: false, max: 1 }));
migrate(db, { migrationsFolder: "./drizzle" }).then(() => {
  console.log('migrate successful')
}).catch(err => {
  console.log(err);
  console.log('migrate failed: ' + err.message);
});
