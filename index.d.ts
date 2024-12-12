import * as stream from 'stream';
export declare const buffertoJson: (buffer: Buffer) => any;
export declare const jsontoBuffer: (json: object) => Buffer;
export declare const transformBuffer: (buffer: Buffer, transformFn: (data: Buffer) => Buffer) => Buffer;
export declare const bufferToFile: (buffer: Buffer, filePath: string) => void;
export declare function toBuffer(data: any): Buffer;
export declare const extractUrlFromString: (str: string) => string | "";
export declare const getBufferFromStream: (stream: stream.Readable) => Promise<Buffer>;
export declare const getStreamFromBuffer: (buffer: Buffer) => stream.Readable;
export declare const FileTypeFromUrl: (url: string) => Promise<string | null>;
export declare const FileTypeFromBuffer: (buffer: Buffer) => Promise<string | null>;
export declare const FileTypeFromBlob: (blob: Blob) => Promise<string | null>;
export declare const FileTypeFromStream: (stream: stream.Readable) => Promise<string | null>;
export declare function detectType(content: string | Buffer): Promise<string>;
export declare const getJson: (url: string) => Promise<any>;
export declare const postJson: (url: string, data: object) => Promise<any>;
export declare const getBuffer: (url: string) => Promise<Buffer>;
//# sourceMappingURL=index.d.ts.map