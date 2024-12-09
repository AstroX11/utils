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

export const extractUrlFromString = (str: string): string | null => {
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const matches = str.match(urlRegex);
	return matches ? matches[0] : null;
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

export const FileTypeFromUrl = async (url: string): Promise<string | null> => {
	const response = await fetch(url);
	const buffer = await response.buffer();
	const typeResult = await fileTypeFromBuffer(buffer);
	return typeResult ? typeResult.mime : null;
};

export const FileTypeFromBuffer = async (buffer: Buffer): Promise<string | null> => {
	const typeResult = await fileTypeFromBuffer(buffer);
	return typeResult ? typeResult.mime : null;
};

export const FileTypeFromBlob = async (blob: Blob): Promise<string | null> => {
	const buffer = await blob.arrayBuffer().then(Buffer.from);
	const typeResult = await fileTypeFromBuffer(buffer);
	return typeResult ? typeResult.mime : null;
};

export const FileTypeFromStream = async (stream: stream.Readable): Promise<string | null> => {
	const buffer = await getBufferFromStream(stream);
	const typeResult = await fileTypeFromBuffer(buffer);
	return typeResult ? typeResult.mime : null;
};

export async function detectType(content: string | Buffer): Promise<string> {
	let buffer: Buffer;

	if (typeof content === 'string') {
		if (content.startsWith('http')) {
			const response = await fetch(content);
			buffer = await response.buffer();
		} else {
			buffer = Buffer.from(content);
		}
	} else {
		buffer = content;
	}

	const mimeType = await FileTypeFromBuffer(buffer);

	if (!mimeType) return 'text';

	if (mimeType.startsWith('image/')) return 'image';
	if (mimeType.startsWith('video/')) return 'video';
	if (mimeType.startsWith('audio/')) return 'audio';
	if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';

	return 'text';
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
