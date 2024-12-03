export declare const buffertoJson: (buffer: Buffer) => any;
export declare const jsontoBuffer: (json: object) => Buffer;
export declare const transformBuffer: (buffer: Buffer, transformFn: (data: Buffer) => Buffer) => Buffer;
export declare const bufferToFile: (buffer: Buffer, filePath: string) => void;
export declare function toBuffer(data: any): Buffer;
