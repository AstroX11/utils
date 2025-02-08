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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTypeFromStream = exports.FileTypeFromBlob = exports.FileTypeFromBuffer = exports.FileTypeFromUrl = exports.getStreamFromBuffer = exports.getBufferFromStream = exports.extractUrlFromString = exports.bufferToFile = exports.transformBuffer = exports.jsontoBuffer = exports.buffertoJson = void 0;
exports.toBuffer = toBuffer;
exports.detectType = detectType;
exports.getBuffer = getBuffer;
exports.getJson = getJson;
exports.postJson = postJson;
exports.getMimeType = getMimeType;
const promises_1 = __importStar(require("fs/promises"));
const stream_1 = require("stream");
const axios_1 = __importDefault(require("axios"));
const file_type_1 = require("file-type");
const mimeToExtensionMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'video/x-matroska': 'mkv',
    'video/webm': 'webm',
    'video/avi': 'avi',
    'video/quicktime': 'mov',
    'audio/mpeg': 'mp3',
    'audio/ogg': 'ogg',
    'audio/wav': 'wav',
    'audio/flac': 'flac',
    'audio/x-m4a': 'm4a',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
};
const buffertoJson = (buffer) => {
    return JSON.parse(buffer.toString('utf-8'));
};
exports.buffertoJson = buffertoJson;
const jsontoBuffer = (json) => {
    return Buffer.from(JSON.stringify(json));
};
exports.jsontoBuffer = jsontoBuffer;
const transformBuffer = (buffer, transformFn) => {
    return transformFn(buffer);
};
exports.transformBuffer = transformBuffer;
const bufferToFile = async (buffer, filePath) => {
    await promises_1.default.writeFile(filePath, buffer);
};
exports.bufferToFile = bufferToFile;
function toBuffer(data) {
    if (data instanceof Buffer)
        return data;
    if (typeof data === 'string')
        return Buffer.from(data);
    return Buffer.from(JSON.stringify(data));
}
const extractUrlFromString = (str) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = str.match(urlRegex);
    return matches ? matches[0] : '';
};
exports.extractUrlFromString = extractUrlFromString;
const getBufferFromStream = async (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};
exports.getBufferFromStream = getBufferFromStream;
const getStreamFromBuffer = (buffer) => {
    const readable = new stream_1.Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
};
exports.getStreamFromBuffer = getStreamFromBuffer;
const FileTypeFromUrl = async (url) => {
    const response = await axios_1.default.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const typeResult = await (0, file_type_1.fromBuffer)(buffer);
    return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};
exports.FileTypeFromUrl = FileTypeFromUrl;
const FileTypeFromBuffer = async (buffer) => {
    const typeResult = await (0, file_type_1.fromBuffer)(buffer);
    return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};
exports.FileTypeFromBuffer = FileTypeFromBuffer;
const FileTypeFromBlob = async (blob) => {
    const buffer = await blob.arrayBuffer().then(Buffer.from);
    const typeResult = await (0, file_type_1.fromBuffer)(buffer);
    return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};
exports.FileTypeFromBlob = FileTypeFromBlob;
const FileTypeFromStream = async (stream) => {
    const buffer = await (0, exports.getBufferFromStream)(stream);
    const typeResult = await (0, file_type_1.fromBuffer)(buffer);
    return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};
exports.FileTypeFromStream = FileTypeFromStream;
async function detectType(content) {
    let buffer;
    if (typeof content === 'string') {
        try {
            if (content.startsWith('http')) {
                const url = (0, exports.extractUrlFromString)(content);
                const response = await axios_1.default.get(url, { responseType: 'arraybuffer' });
                buffer = Buffer.from(response.data);
            }
            else {
                buffer = Buffer.from(content, 'base64');
            }
        }
        catch (error) {
            return 'invalid';
        }
    }
    else {
        buffer = content;
    }
    const fileExt = await (0, exports.FileTypeFromBuffer)(buffer);
    if (!fileExt)
        return 'text';
    const typeMap = {
        image: ['jpg', 'png', 'gif', 'webp'],
        video: ['mp4', 'mkv', 'webm'],
        audio: ['mp3', 'ogg', 'wav'],
        document: ['pdf', 'doc', 'docx'],
        sticker: ['webp']
    };
    for (const [type, patterns] of Object.entries(typeMap)) {
        if (patterns.includes(fileExt)) {
            return type;
        }
    }
    return 'unknown';
}
async function getBuffer(url, options = {}, retryConfig = {}) {
    var _a;
    const { maxRetries = 3, retryDelay = 1000 } = retryConfig;
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const res = await (0, axios_1.default)({
                method: 'get',
                url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    Accept: 'application/octet-stream, text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    DNT: '1',
                    'Upgrade-Insecure-Requests': '1',
                    Connection: 'keep-alive',
                    'Cache-Control': 'max-age=0',
                    ...options.headers
                },
                timeout: 10000, // 10 second timeout
                maxRedirects: 5,
                validateStatus: status => status >= 200 && status < 300,
                ...options,
                responseType: 'arraybuffer'
            });
            return res.data;
        }
        catch (error) {
            attempt++;
            // Type guard to ensure error is AxiosError
            const axiosError = error;
            // If we're out of retries, throw the error
            if (attempt === maxRetries) {
                throw new Error(`Failed to fetch buffer after ${maxRetries} attempts. ` +
                    `URL: ${url}. ` +
                    `Status: ${(_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status}. ` +
                    `Message: ${axiosError.message}`);
            }
            // If the error is a 4xx client error, don't retry
            if (axiosError.response &&
                axiosError.response.status >= 400 &&
                axiosError.response.status < 500) {
                throw new Error(`Client error: ${axiosError.response.status}. ` +
                    `URL: ${url}. ` +
                    `Message: ${axiosError.message}`);
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
    // This should never be reached due to the throw in the loop
    throw new Error('Unexpected error in retry loop');
}
async function getJson(url, options = {}) {
    try {
        const res = await (0, axios_1.default)({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
                ...options.headers
            },
            ...options
        });
        return res.data;
    }
    catch (err) {
        return err;
    }
}
async function postJson(url, data, options = {}) {
    try {
        const res = await (0, axios_1.default)({
            method: 'POST',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
                ...options.headers
            },
            ...options
        });
        return res.data;
    }
    catch (err) {
        return err;
    }
}
async function getMimeType(input) {
    let buffer;
    if (Buffer.isBuffer(input)) {
        buffer = input;
    }
    else if (typeof input === 'string') {
        if (input.startsWith('http')) {
            const response = await axios_1.default.get(input, { responseType: 'arraybuffer' });
            buffer = Buffer.from(response.data);
        }
        else {
            buffer = await (0, promises_1.readFile)(input);
        }
    }
    else {
        throw new Error('Input must be a Buffer, file path, or URL.');
    }
    const type = await (0, file_type_1.fromBuffer)(buffer);
    return (type === null || type === void 0 ? void 0 : type.mime) || 'unknown';
}
exports.default = {
    buffertoJson: exports.buffertoJson,
    jsontoBuffer: exports.jsontoBuffer,
    transformBuffer: exports.transformBuffer,
    bufferToFile: exports.bufferToFile,
    toBuffer,
    extractUrlFromString: exports.extractUrlFromString,
    getBufferFromStream: exports.getBufferFromStream,
    getStreamFromBuffer: exports.getStreamFromBuffer,
    FileTypeFromUrl: exports.FileTypeFromUrl,
    FileTypeFromBuffer: exports.FileTypeFromBuffer,
    FileTypeFromBlob: exports.FileTypeFromBlob,
    FileTypeFromStream: exports.FileTypeFromStream,
    detectType,
    getBuffer,
    getJson,
    postJson,
    getMimeType
};
