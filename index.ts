import * as fs from 'fs';
import * as stream from 'stream';
import { fileTypeFromBuffer } from 'file-type';
import fetch from 'node-fetch';

export const buffertoJson = (buffer: Buffer): any => {
	return JSON.parse(buffer.toString('utf-8'));
};

export const jsontoBuffer = (json: object): Buffer => {
	return Buffer.from(JSON.stringify(json));
};

export const transformBuffer = (buffer: Buffer, transformFn: (data: Buffer) => Buffer): Buffer => {
	return transformFn(buffer);
};

export const bufferToFile = (buffer: Buffer, filePath: string): void => {
	fs.writeFileSync(filePath, buffer);
};

export function toBuffer(data: any): Buffer {
	if (data instanceof Buffer) return data;
	if (typeof data === 'string') return Buffer.from(data);
	return Buffer.from(JSON.stringify(data));
}

export const extractUrlFromString = (str: string): string | '' => {
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const matches = str.match(urlRegex);
	return matches ? matches[0] : '';
};

export const getBufferFromStream = async (stream: stream.Readable): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		stream.on('data', chunk => chunks.push(chunk));
		stream.on('end', () => resolve(Buffer.concat(chunks)));
		stream.on('error', reject);
	});
};

export const getStreamFromBuffer = (buffer: Buffer): stream.Readable => {
	const readable = new stream.Readable();
	readable.push(buffer);
	readable.push(null);
	return readable;
};

const mimeToExtensionMap: Record<string, string> = {
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

export const FileTypeFromUrl = async (url: string): Promise<string | null> => {
	const response = await fetch(url);
	const buffer = await response.buffer();
	const typeResult = await fileTypeFromBuffer(buffer);
	return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};

export const FileTypeFromBuffer = async (buffer: Buffer): Promise<string | null> => {
	const typeResult = await fileTypeFromBuffer(buffer);
	return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};

export const FileTypeFromBlob = async (blob: Blob): Promise<string | null> => {
	const buffer = await blob.arrayBuffer().then(Buffer.from);
	const typeResult = await fileTypeFromBuffer(buffer);
	return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};

export const FileTypeFromStream = async (stream: stream.Readable): Promise<string | null> => {
	const buffer = await getBufferFromStream(stream);
	const typeResult = await fileTypeFromBuffer(buffer);
	return typeResult ? mimeToExtensionMap[typeResult.mime] || typeResult.ext : null;
};

export async function detectType(content: string | Buffer): Promise<string> {
	let buffer: Buffer;

	if (typeof content === 'string') {
		try {
			if (content.startsWith('http')) {
				const url = extractUrlFromString(content);
				const response = await fetch(url);
				if (!response.ok) throw new Error('Failed to fetch content');
				buffer = await response.buffer();
			} else {
				buffer = Buffer.from(content, 'base64');
			}
		} catch (error) {
			return 'invalid';
		}
	} else {
		buffer = content;
	}

	const fileExt = await FileTypeFromBuffer(buffer);
	if (!fileExt) return 'text';

	const typeMap: Record<string, string[]> = {
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

export const getJson = async (url: string): Promise<any> => {
	const response = await fetch(url);
	return response.json();
};

export const postJson = async (url: string, data: object): Promise<any> => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	return response.json();
};

export const getBuffer = async (url: string): Promise<Buffer> => {
	const response = await fetch(url);
	return response.buffer();
};
