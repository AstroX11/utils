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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectType = detectType;
const axios_1 = __importDefault(require("axios"));
const file_type_1 = __importDefault(require("file-type"));
/**
 * Detects the type of content by converting it to a buffer and checking its MIME type.
 * @param content - The content to analyze (can be a URL, buffer, or string).
 * @returns A promise resolving to the detected type ('text', 'image', 'video', 'audio', 'document', 'sticker').
 */
function detectType(content) {
    return __awaiter(this, void 0, void 0, function* () {
        let buffer;
        if (Buffer.isBuffer(content)) {
            buffer = content;
        }
        else if (typeof content === 'string' && content.startsWith('http')) {
            const response = yield axios_1.default.get(content, { responseType: 'arraybuffer' });
            buffer = Buffer.from(response.data);
        }
        else {
            buffer = Buffer.from(content, 'utf-8');
            return 'text';
        }
        const type = (0, file_type_1.default)(buffer);
        if (!type)
            return 'text';
        switch (type.mime) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
                return 'image';
            case 'video/mp4':
            case 'video/webm':
                return 'video';
            case 'audio/mpeg':
            case 'audio/ogg':
                return 'audio';
            case 'application/pdf':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'document';
            case 'image/webp':
                return 'sticker';
            default:
                return 'document';
        }
    });
}
