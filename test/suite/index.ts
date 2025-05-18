import * as path from 'path';
import Mocha from 'mocha';
import * as glob from 'glob';

export async function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'bdd', color: true });
  const testsRoot = path.resolve(__dirname);

  try {
    const files = await glob.glob('**/*.test.js', { cwd: testsRoot });

    files.forEach(file => mocha.addFile(path.join(testsRoot, file)));

    return new Promise((resolve, reject) => {
      mocha.run(failures => {
        failures > 0 ? reject(new Error(`${failures} tests failed.`)) : resolve();
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
}
