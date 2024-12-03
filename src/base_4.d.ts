import { Readable } from 'stream';
export declare const FileTypeFromUrl: (url: string) => Promise<string | null>;
export declare const FileTypeFromBuffer: (buffer: Buffer) => string | null;
export declare const FileTypeFromBlob: (blob: Blob) => Promise<string | null>;
export declare const FileTypeFromStream: (stream: Readable) => Promise<string | null>;
