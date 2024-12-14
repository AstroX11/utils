import fs from 'fs/promises';
import { Readable } from 'stream';
import axios, { AxiosRequestConfig } from 'axios';
import { fileTypeFromBuffer } from 'file-type';

// Type definitions for enhanced type safety
type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[];

type FileType = 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'text' | 'unknown' | 'invalid';

// MIME to Extension mapping with more comprehensive coverage
const mimeToExtensionMap: Record<string, string> = {
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
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};

export const buffertoJson = (buffer: Buffer): any => {
	return JSON.parse(buffer.toString('utf-8'));
};

export const jsontoBuffer = (json: object): Buffer => {
	return Buffer.from(JSON.stringify(json));
};

export const transformBuffer = (buffer: Buffer, transformFn: (data: Buffer) => Buffer): Buffer => {
	return transformFn(buffer);
};

export const bufferToFile = async (buffer: Buffer, filePath: string): Promise<void> => {
	await fs.writeFile(filePath, buffer);
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

export const getBufferFromStream = async (stream: Readable): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		stream.on('data', chunk => chunks.push(chunk));
		stream.on('end', () => resolve(Buffer.concat(chunks)));
		stream.on('error', reject);
	});
};

export const getStreamFromBuffer = (buffer: Buffer): Readable => {
	const readable = new Readable();
	readable.push(buffer);
	readable.push(null);
	return readable;
};

export const FileTypeFromUrl = async (url: string): Promise<string | null> => {
	const response = await axios.get(url, { responseType: 'arraybuffer' });
	const buffer = Buffer.from(response.data);
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

export const FileTypeFromStream = async (stream: Readable): Promise<string | null> => {
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
				const response = await axios.get(url, { responseType: 'arraybuffer' });
				buffer = Buffer.from(response.data);
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

export async function getBuffer(url: string, options: AxiosRequestConfig = {}): Promise<Buffer> {
	try {
		const res = await axios({
			method: 'get',
			url,
			headers: {
				DNT: 1,
				'Upgrade-Insecure-Request': 1,
				...options.headers,
			},
			...options,
			responseType: 'arraybuffer',
		});
		return res.data;
	} catch (error: any) {
		throw new Error(`Error fetching buffer: ${error.message}`);
	}
}

export async function getJson(url: string, options: AxiosRequestConfig = {}): Promise<any> {
	try {
		const res = await axios({
			method: 'GET',
			url: url,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
				...options.headers,
			},
			...options,
		});
		return res.data;
	} catch (err: any) {
		return err;
	}
}

export async function postJson(url: string, data: any, options: AxiosRequestConfig = {}): Promise<any> {
	try {
		const res = await axios({
			method: 'POST',
			url: url,
			data: data,
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
				...options.headers,
			},
			...options,
		});
		return res.data;
	} catch (err: any) {
		return err;
	}
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
};
