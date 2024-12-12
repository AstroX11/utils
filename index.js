import * as fs from 'fs';
import * as stream from 'stream';
import { fileTypeFromBuffer } from 'file-type';
import fetch from 'node-fetch';
export const fetchWithRetry = async (url, options = {}) => {
    const { method = 'GET', body, headers = {}, timeout = 5000, retries = 3, validateSchema } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const fetchOptions = {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers,
                    },
                    signal: controller.signal,
                    ...(body ? { body: JSON.stringify(body) } : {}),
                };
                const response = await fetch(url, fetchOptions);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Optional schema validation
                if (validateSchema) {
                    return validateSchema.parse(data);
                }
                return data;
            }
            catch (error) {
                if (attempt === retries)
                    throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
        throw new Error('Max retries exceeded');
    }
    finally {
        clearTimeout(id);
    }
};
export const buffertoJson = (buffer) => {
    return JSON.parse(buffer.toString('utf-8'));
};
export const jsontoBuffer = (json) => {
    return Buffer.from(JSON.stringify(json));
};
export const transformBuffer = (buffer, transformFn) => {
    return transformFn(buffer);
};
export const bufferToFile = (buffer, filePath) => {
    fs.writeFileSync(filePath, buffer);
};
export function toBuffer(data) {
    if (data instanceof Buffer)
        return data;
    if (typeof data === 'string')
        return Buffer.from(data);
    return Buffer.from(JSON.stringify(data));
}
export const extractUrlFromString = (str) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = str.match(urlRegex);
    return matches ? matches[0] : '';
};
export const getBufferFromStream = async (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};
export const getStreamFromBuffer = (buffer) => {
    const readable = new stream.Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
};
const mimeToExtensionMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/mkv': 'mkv',
    'video/webm': 'webm',
    'audio/mpeg': 'mp3',
    'audio/ogg': 'ogg',
    'audio/wav': 'wav',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};
export const FileTypeFromUrl = async (url) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const typeResult = await fileTypeFromBuffer(buffer);
    return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};
export const FileTypeFromBuffer = async (buffer) => {
    const typeResult = await fileTypeFromBuffer(buffer);
    return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};
export const FileTypeFromBlob = async (blob) => {
    const buffer = await blob.arrayBuffer().then(Buffer.from);
    const typeResult = await fileTypeFromBuffer(buffer);
    return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};
export const FileTypeFromStream = async (stream) => {
    const buffer = await getBufferFromStream(stream);
    const typeResult = await fileTypeFromBuffer(buffer);
    return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};
export async function detectType(content) {
    let buffer;
    if (typeof content === 'string') {
        try {
            if (content.startsWith('http')) {
                const url = extractUrlFromString(content);
                const response = await fetch(url);
                if (!response.ok)
                    throw new Error('Failed to fetch content');
                buffer = await response.buffer();
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
    const fileExt = await FileTypeFromBuffer(buffer);
    if (!fileExt)
        return 'text';
    const typeMap = {
        image: ['jpg', 'png', 'gif', 'webp'],
        video: ['mp4', 'mkv', 'webm'],
        audio: ['mp3', 'ogg', 'wav'],
        document: ['pdf', 'doc', 'docx'],
        sticker: ['webp'],
    };
    for (const [type, patterns] of Object.entries(typeMap)) {
        if (patterns.includes(fileExt)) {
            return type;
        }
    }
    return 'unknown';
}
export const getJson = (url, options = {}) => fetchWithRetry(url, { method: 'GET', ...options });
export const postJson = (url, data, options = {}) => fetchWithRetry(url, { method: 'POST', body: data, ...options });
export const getBuffer = async (url, options = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout || 5000);
    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: options.headers,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.arrayBuffer();
    }
    finally {
        clearTimeout(id);
    }
};
//# sourceMappingURL=index.js.map