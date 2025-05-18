// test/runTest.ts
import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
  try {
    await runTests({
      extensionDevelopmentPath: path.resolve(__dirname, '../../'),
      extensionTestsPath: path.resolve(__dirname, './suite'),
    });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();