import { Readable } from 'stream';
export declare const extractUrlFromString: (str: string) => string | null;
export declare const getBufferFromStream: (stream: Readable) => Promise<Buffer>;
export declare const getStreamFromBuffer: (buffer: Buffer) => Readable;
