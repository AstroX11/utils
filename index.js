import * as fs from 'fs';
import * as stream from 'stream';
import { fileTypeFromBuffer } from 'file-type';
import fetch from 'node-fetch';
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
export const FileTypeFromUrl = async (url) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const typeResult = await fileTypeFromBuffer(buffer);
    return typeResult ? typeResult.mime : null;
};
export const FileTypeFromBuffer = async (buffer) => {
    const typeResult = await fileTypeFromBuffer(buffer);
    return typeResult ? typeResult.mime : null;
};
export const FileTypeFromBlob = async (blob) => {
    const buffer = await blob.arrayBuffer().then(Buffer.from);
    const typeResult = await fileTypeFromBuffer(buffer);
    return typeResult ? typeResult.mime : null;
};
export const FileTypeFromStream = async (stream) => {
    const buffer = await getBufferFromStream(stream);
    const typeResult = await fileTypeFromBuffer(buffer);
    return typeResult ? typeResult.mime : null;
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
    const mimeType = await FileTypeFromBuffer(buffer);
    if (!mimeType)
        return 'text';
    const typeMap = {
        image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        video: ['video/mp4', 'video/mkv', 'video/webm'],
        audio: ['audio/mpeg', 'audio/ogg', 'audio/wav'],
        document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        sticker: ['image/webp'],
    };
    for (const [type, patterns] of Object.entries(typeMap)) {
        if (patterns.includes(mimeType)) {
            return type;
        }
    }
    return 'unknown';
}
export const getJson = async (url) => {
    const response = await fetch(url);
    return response.json();
};
export const postJson = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
};
export const getBuffer = async (url) => {
    const response = await fetch(url);
    return response.buffer();
};
//# sourceMappingURL=index.js.map