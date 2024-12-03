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
exports.FileTypeFromStream = exports.FileTypeFromBlob = exports.FileTypeFromBuffer = exports.FileTypeFromUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const file_type_1 = __importDefault(require("file-type"));
const FileTypeFromUrl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const type = (0, file_type_1.default)(buffer);
        return type ? type.ext : null;
    }
    catch (error) {
        console.error('Error fetching file type from URL:', error);
        throw error;
    }
});
exports.FileTypeFromUrl = FileTypeFromUrl;
const FileTypeFromBuffer = (buffer) => {
    const type = (0, file_type_1.default)(buffer);
    return type ? type.ext : null;
};
exports.FileTypeFromBuffer = FileTypeFromBuffer;
const FileTypeFromBlob = (blob) => __awaiter(void 0, void 0, void 0, function* () {
    const arrayBuffer = yield blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const type = (0, file_type_1.default)(buffer);
    return type ? type.ext : null;
});
exports.FileTypeFromBlob = FileTypeFromBlob;
const FileTypeFromStream = (stream) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        stream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const type = (0, file_type_1.default)(buffer);
            resolve(type ? type.ext : null);
        });
        stream.on('error', reject);
    });
});
exports.FileTypeFromStream = FileTypeFromStream;
