"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    success;
    data;
    meta;
    error;
    static ok(data, meta) {
        return { success: true, data, meta };
    }
    static fail(code, message) {
        return { success: false, error: { code, message } };
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response.js.map