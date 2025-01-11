import fs, { readFile } from 'fs/promises';
import { Readable } from 'stream';
import axios from 'axios';
import { fileTypeFromBuffer } from 'file-type';
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
export const buffertoJson = (buffer) => {
    return JSON.parse(buffer.toString('utf-8'));
};
export const jsontoBuffer = (json) => {
    return Buffer.from(JSON.stringify(json));
};
export const transformBuffer = (buffer, transformFn) => {
    return transformFn(buffer);
};
export const bufferToFile = async (buffer, filePath) => {
    await fs.writeFile(filePath, buffer);
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
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
};
export const FileTypeFromUrl = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
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
                const response = await axios.get(url, { responseType: 'arraybuffer' });
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
    const fileExt = await FileTypeFromBuffer(buffer);
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
export async function getBuffer(url, options = {}, retryConfig = {}) {
    const { maxRetries = 3, retryDelay = 1000 } = retryConfig;
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const res = await axios({
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
                    `Status: ${axiosError.response?.status}. ` +
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
export async function getJson(url, options = {}) {
    try {
        const res = await axios({
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
export async function postJson(url, data, options = {}) {
    try {
        const res = await axios({
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
export async function getMimeType(input) {
    let buffer;
    if (Buffer.isBuffer(input)) {
        buffer = input;
    }
    else if (typeof input === 'string') {
        if (input.startsWith('http')) {
            const response = await axios.get(input, { responseType: 'arraybuffer' });
            buffer = Buffer.from(response.data);
        }
        else {
            buffer = await readFile(input);
        }
    }
    else {
        throw new Error('Input must be a Buffer, file path, or URL.');
    }
    const type = await fileTypeFromBuffer(buffer);
    return type?.mime || 'unknown';
}
export default {
    buffertoJson,
    jsontoBuffer,
    transformBuffer,
    bufferToFile,
    toBuffer,
    extractUrlFromString,
    getBufferFromStream,
    getStreamFromBuffer,
    FileTypeFromUrl,
    FileTypeFromBuffer,
    FileTypeFromBlob,
    FileTypeFromStream,
    detectType,
    getBuffer,
    getJson,
    postJson,
    getMimeType
};
