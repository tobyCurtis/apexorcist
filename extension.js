const vscode = require("vscode");
const TheWolf = require("./lib/TheWolf.js")

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("Apexorcist activated");

  const disposable = vscode.commands.registerCommand(
    "apexorcist.run",
    function () {
      const code = new TheWolf(vscode.window.activeTextEditor.document.getText())
        .soqlWithUser()
        .dmlAsUser()
		.withSharing()
		.globalToPublic()
        .value();

      writeToDocument(code);
      vscode.window.showInformationMessage("Hello World from Apexorcist! 3");
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

module.exports = {
  activate
};
