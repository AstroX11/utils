import { toBuffer } from "./src/base_2";
import { detectType } from "./src/base_5";
declare const XUtils: {
    detectType: typeof detectType;
    toBuffer: typeof toBuffer;
    getJson: (url: string) => Promise<any>;
    postJson: (url: string, data: object) => Promise<any>;
    getBuffer: (url: string) => Promise<Buffer>;
    buffertoJson: (buffer: Buffer) => any;
    jsontoBuffer: (json: object) => Buffer;
    transformBuffer: (buffer: Buffer, transformFn: (data: Buffer) => Buffer) => Buffer;
    bufferToFile: (buffer: Buffer, filePath: string) => void;
    extractUrlFromString: (str: string) => string | null;
    getStreamFromBuffer: (buffer: Buffer) => import("stream").Readable;
    getBufferFromStream: (stream: import("stream").Readable) => Promise<Buffer>;
    FileTypeFromUrl: (url: string) => Promise<string | null>;
    FileTypeFromBuffer: (buffer: Buffer) => string | null;
    FileTypeFromBlob: (blob: Blob) => Promise<string | null>;
    FileTypeFromStream: (stream: import("stream").Readable) => Promise<string | null>;
    sleep: (ms: number) => Promise<void>;
};
export { XUtils };
export default XUtils;