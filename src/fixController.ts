import * as vscode from 'vscode';
import { APIService } from './api';

export class FixController {
    private commentController: vscode.CommentController;

    constructor() {
        this.commentController = vscode.comments.createCommentController('fixError', 'Fix Error Suggestion');
        this.commentController.commentingRangeProvider = {
            provideCommentingRanges: (document: vscode.TextDocument, token: vscode.CancellationToken) => {
                return [];
            }
        };
    }

    async suggestFix(editor: vscode.TextEditor) {
        const selection = editor.selection;
        const text = editor.document.getText(selection);

        if (!text) {
            vscode.window.showInformationMessage('Please select some code to fix.');
            return;
        }

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Fetching fix...",
            cancellable: false
        }, async () => {
            const response = await APIService.getFix(text);
            this.createComment(editor, selection, response.explanation, response.fix);
        });
    }

    private createComment(editor: vscode.TextEditor, range: vscode.Range, explanation: string, fixCode: string) {

        const thread = this.commentController.createCommentThread(editor.document.uri, range, []);


        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`**Suggestion:** ${explanation}\n\n`);
        markdown.appendCodeblock(fixCode, editor.document.languageId);

        const comment = new MyComment(markdown, vscode.CommentMode.Preview, { name: 'Debugger AI' }, thread);

        comment.contextValue = 'suggestedFix';
        thread.comments = [comment];

        (thread as any).fixCode = fixCode;
        (thread as any).targetRange = range;

        thread.collapsibleState = vscode.CommentThreadCollapsibleState.Expanded;

        thread.canReply = false;
    }

    applyFix(thread: vscode.CommentThread) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const fixCode = (thread as any).fixCode;
        const range = (thread as any).targetRange;

        if (fixCode && range) {
            editor.edit(editBuilder => {
                editBuilder.replace(range, fixCode);
            }).then(() => {
                thread.dispose();
            });
        }
    }

    discardFix(thread: vscode.CommentThread) {
        thread.dispose();
    }

    dispose() {
        this.commentController.dispose();
    }
}

class MyComment implements vscode.Comment {
    label: string | undefined;
    constructor(
        public body: string | vscode.MarkdownString,
        public mode: vscode.CommentMode,
        public author: vscode.CommentAuthorInformation,
        public parent: vscode.CommentThread,
        public contextValue?: string
    ) { }
}
