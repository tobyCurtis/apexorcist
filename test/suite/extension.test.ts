import * as assert from 'assert';
import * as vscode from 'vscode';

describe('Apexorcist Extension Tests', () => {
  it('activates extension', async () => {
    const ext = vscode.extensions.getExtension('tobycurtis.apexorcist');
    await ext?.activate();
    assert.ok(ext?.isActive);
  });

  it('registers the command', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('apexorcist.run'));
  });
});