import { execSync } from 'child_process';

const siteId = '062830ab-a50d-4a55-8abf-257084303768';
const newNames = ['goldentrip-app', 'goldentrip-jo', 'goldentrip-travel', 'golden-trip'];

for (const name of newNames) {
  try {
    console.log(`Trying to rename site to: ${name}`);
    const result = execSync(`npx netlify api updateSite --data "{\\"site_id\\": \\"${siteId}\\", \\"body\\": { \\"name\\": \\"${name}\\" }}"`, { encoding: 'utf-8', stdio: 'pipe' });
    console.log('Success!', result);
    break;
  } catch (err) {
    console.error(`Failed to rename to ${name}:`, err.stderr || err.message);
  }
}
