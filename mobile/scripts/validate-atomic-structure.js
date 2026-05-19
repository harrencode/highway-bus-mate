const fs = require('fs');
const path = require('path');

const atomicRoot = path.resolve(__dirname, '..', 'src', 'atomic');
const allowedPrefixes = ['atm.', 'mol.', 'obj.', 'org.', 'pag.'];

if (!fs.existsSync(atomicRoot)) {
  console.error('Atomic directory not found: src/atomic');
  process.exit(1);
}

const invalidFolders = fs
  .readdirSync(atomicRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !allowedPrefixes.some((prefix) => name.startsWith(prefix)));

if (invalidFolders.length > 0) {
  console.error('Invalid atomic folder names found:');
  invalidFolders.forEach((folder) => console.error(`- src/atomic/${folder}`));
  console.error(`Allowed prefixes: ${allowedPrefixes.join(', ')}`);
  process.exit(1);
}

console.log('Atomic folder structure is valid.');
