"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fixController_1 = require("./fixController");
function activate(context) {
    console.log('Debugger Extension is now active!');
    const fixController = new fixController_1.FixController();
    context.subscriptions.push(fixController);
    // Register the main command
    context.subscriptions.push(vscode.commands.registerCommand('extension.fixError', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            fixController.suggestFix(editor);
        }
    }));
    // Register button actions
    context.subscriptions.push(vscode.commands.registerCommand('extension.acceptFix', (comment) => {
        if (!comment.parent)
            return;
        fixController.applyFix(comment.parent);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.discardFix', (comment) => {
        if (!comment.parent)
            return;
        fixController.discardFix(comment.parent);
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map