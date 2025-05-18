import * as vscode from "vscode";
import { TheWolf } from "./TheWolf";
import * as crypto from 'crypto';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "apexorcist.run",
    function () {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;
        const editorText = document.getText();
        const code = new TheWolf(editorText)
          .soqlWithUser()
          .dmlAsUser()
          .withSharing()
          .globalToPublic()
          .value();
  
        writeToDocument(code);
        vscode.window.showInformationMessage(pickRandom(resultMessages) ?? "By the power of Chris Peterson, the demons have been cast out.");
      } else {
        vscode.window.showErrorMessage(pickRandom(noCodeWindowOpenMessages) ?? "My rites require code. Bring forth the cursed lines!");
      }
    }
  );

  context.subscriptions.push(disposable);
}

function writeToDocument(newCode: string) {
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

function pickRandom(arr: string[]) {
  if (arr.length === 0) return undefined;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return arr[array[0] % arr.length];
}

const resultMessages: string[] = [
  "By the power of Chris Peterson, the demons have been cast out.",
  "It is done. May peace now dwell where evil once lingered.",
  "Go now in grace. The demons have been banished.",
  "Next time, call me before the furniture starts flying.",
  "The darkness is gone—for now.",
];

const noCodeWindowOpenMessages: string[] = [
  "No code to cleanse. The demon must is hiding.",
  "No file open — I can't cast spells on the void.",
  "Summon some code first… I sense no evil here yet.",
  "Open a file, mortal. I can't Apexorcise what isn't there.",
  "My rites require code. Bring forth the cursed lines!"
];

module.exports = {
  activate,
};
