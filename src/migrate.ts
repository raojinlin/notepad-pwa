import { config } from 'dotenv';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

config({ path: '.env.local' });

import { db } from './schema';
// export const db = drizzle(postgres(process.env.POSTGRES_URL));
migrate(db, { migrationsFolder: "./drizzle" }).then(() => {
  console.log('migrate successful')
}).catch(err => {
  console.log(err);
  console.log('migrate failed: ' + err.message);
});
