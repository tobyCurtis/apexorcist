"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const TheWolf_1 = require("./TheWolf");
const crypto = __importStar(require("crypto"));
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const disposable = vscode.commands.registerCommand("apexorcist.run", function () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const editorText = document.getText();
            const code = new TheWolf_1.TheWolf(editorText)
                .soqlWithUser()
                .dmlAsUser()
                .withSharing()
                .globalToPublic()
                .value();
            writeToDocument(code);
            vscode.window.showInformationMessage(pickRandom(resultMessages) ?? "By the power of Chris Peterson, the demons have been cast out.");
        }
        else {
            vscode.window.showErrorMessage(pickRandom(noCodeWindowOpenMessages) ?? "My rites require code. Bring forth the cursed lines!");
        }
    });
    context.subscriptions.push(disposable);
}
function writeToDocument(newCode) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active text editor found.");
        return;
    }
    const document = editor.document;
    const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
    editor.edit((editBuilder) => {
        editBuilder.replace(fullRange, newCode);
    });
}
function pickRandom(arr) {
    if (arr.length === 0)
        return undefined;
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
const noCodeWindowOpenMessages = [
    "No code to cleanse. The demon must is hiding.",
    "No file open — I can't cast spells on the void.",
    "Summon some code first… I sense no evil here yet.",
    "Open a file, mortal. I can't Apexorcise what isn't there.",
    "My rites require code. Bring forth the cursed lines!"
];
module.exports = {
    activate,
};
//# sourceMappingURL=extension.js.map