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
exports.APIService = void 0;
class APIService {
    static getFix(codeSnippet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Simulate API call
                const response = yield fetch(this.API_URL, {
                    method: 'POST',
                    body: JSON.stringify({ code: codeSnippet }),
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok)
                    throw new Error('API failed');
                return yield response.json();
                // Mock response for now as requested
                // return new Promise((resolve) => {
                //     setTimeout(() => {
                //         resolve({
                //             explanation: "It looks like you have a syntax error. I added a missing semicolon.",
                //             fix: codeSnippet.trim() + "; // Fixed by Debugger Extension"
                //         });
                //     }, 1000);
                // });
            }
            catch (error) {
                console.error(error);
                return {
                    explanation: "Failed to fetch fix. showing mock response.",
                    fix: codeSnippet + "\n// Fix fetch failed"
                };
            }
        });
    }
}
exports.APIService = APIService;
// Dummy URL
APIService.API_URL = 'http://localhost:8000/fix';
//# sourceMappingURL=api.js.map