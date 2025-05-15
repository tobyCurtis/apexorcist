const vscode = require("vscode");
const TheWolf = require("./lib/TheWolf.js");
const crypto = require('crypto');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const disposable = vscode.commands.registerCommand(
    "apexorcist.run",
    function () {
      const editorText = vscode.window.activeTextEditor.document.getText();
      const code = new TheWolf(editorText)
        .soqlWithUser()
        .dmlAsUser()
        .withSharing()
        .globalToPublic()
        .value();

      writeToDocument(code);
      vscode.window.showInformationMessage(pickRandom(resultMessages));
    }
  );

  context.subscriptions.push(disposable);
}

function writeToDocument(newCode) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active text editor found.");
    return;
  }

  const document = editor.document;
  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(document.getText().length)
  );

  editor.edit((editBuilder) => {
    editBuilder.replace(fullRange, newCode);
  });
}

function pickRandom(arr) {
  if (arr.length === 0) return undefined;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return arr[array[0] % arr.length];
}

const resultMessages = [
  "By the power of Chris Peterson, the demons have been cast out.",
  "It is done. May peace now dwell where evil once lingered.",
  "Go now in grace. The demons have been banished.",
  "Next time, call me before the furniture starts flying.",
  "The darkness is gone—for now.",
];

module.exports = {
  activate,
};
