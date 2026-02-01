import * as vscode from 'vscode';

export interface FixResponse {
    explanation: string;
    fix: string;
}

export class APIService {
    private static readonly API_URL = 'http://localhost:8000/fix';

    static async getFix(codeSnippet: string): Promise<FixResponse> {
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                body: JSON.stringify({ code: codeSnippet }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('API failed');
            return await response.json();


        } catch (error) {
            console.error(error);
            return {
                explanation: "Failed to fetch fix. showing mock response.",
                fix: codeSnippet + "\n// Fix fetch failed"
            };
        }
    }
}
