import * as vscode from 'vscode';
import { FixController } from './fixController';

export function activate(context: vscode.ExtensionContext) {
    console.log('Debugger Extension is now active!');

    const fixController = new FixController();
    context.subscriptions.push(fixController);

    context.subscriptions.push(vscode.commands.registerCommand('extension.fixError', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            fixController.suggestFix(editor);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.acceptFix', (comment: any) => {
        if (!comment.parent) return;
        fixController.applyFix(comment.parent);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.discardFix', (comment: any) => {
        if (!comment.parent) return;
        fixController.discardFix(comment.parent);
    }));
}

export function deactivate() { }
