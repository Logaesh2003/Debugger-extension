"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixController = void 0;
const vscode = require("vscode");
const api_1 = require("./api");
class FixController {
    constructor() {
        this.commentController = vscode.comments.createCommentController('fixError', 'Fix Error Suggestion');
        this.commentController.commentingRangeProvider = {
            provideCommentingRanges: (document, token) => {
                return []; // We handle comments manually via command
            }
        };
    }
    suggestFix(editor) {
        return __awaiter(this, void 0, void 0, function* () {
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
            }, () => __awaiter(this, void 0, void 0, function* () {
                const response = yield api_1.APIService.getFix(text);
                this.createComment(editor, selection, response.explanation, response.fix);
            }));
        });
    }
    createComment(editor, range, explanation, fixCode) {
        // created a thread at the selection
        const thread = this.commentController.createCommentThread(editor.document.uri, range, []);
        // Prepare the comment content
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`**Suggestion:** ${explanation}\n\n`);
        markdown.appendCodeblock(fixCode, editor.document.languageId);
        const comment = new MyComment(markdown, vscode.CommentMode.Preview, { name: 'Debugger AI' }, thread);
        comment.contextValue = 'suggestedFix';
        thread.comments = [comment];
        // Store data for the apply command (quick hack: attach to thread)
        thread.fixCode = fixCode;
        thread.targetRange = range;
        // Auto-expand
        thread.collapsibleState = vscode.CommentThreadCollapsibleState.Expanded;
        // Hide the comment input box
        thread.canReply = false;
    }
    applyFix(thread) {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        const fixCode = thread.fixCode;
        const range = thread.targetRange;
        if (fixCode && range) {
            editor.edit(editBuilder => {
                editBuilder.replace(range, fixCode);
            }).then(() => {
                thread.dispose();
            });
        }
    }
    discardFix(thread) {
        thread.dispose();
    }
    dispose() {
        this.commentController.dispose();
    }
}
exports.FixController = FixController;
class MyComment {
    constructor(body, mode, author, parent, contextValue) {
        this.body = body;
        this.mode = mode;
        this.author = author;
        this.parent = parent;
        this.contextValue = contextValue;
    }
}
//# sourceMappingURL=fixController.js.map