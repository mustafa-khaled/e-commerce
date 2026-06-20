require('dotenv').config();
import { execSync } from 'child_process';

async function runAll() {
  console.log('Running product seeder...');
  execSync('npx ts-node -r tsconfig-paths/register src/seeder/product.seeder.ts', {
    stdio: 'inherit',
    cwd: __dirname + '/../..',
  });
  console.log('Seed complete. Currency and shipping seed on API startup.');
}

runAll().catch(console.error);
