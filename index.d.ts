import { getJson, postJson, getBuffer } from './src/base';
import { buffertoJson, jsontoBuffer, transformBuffer, bufferToFile, toBuffer } from './src/base_2';
import { extractUrlFromString, getStreamFromBuffer, getBufferFromStream } from './src/base_3';
import { FileTypeFromUrl, FileTypeFromBuffer, FileTypeFromBlob, FileTypeFromStream } from './src/base_4';
import { detectType } from './src/base_5';
export { detectType, toBuffer, getJson, postJson, getBuffer, buffertoJson, jsontoBuffer, transformBuffer, bufferToFile, extractUrlFromString, getStreamFromBuffer, getBufferFromStream, FileTypeFromUrl, FileTypeFromBuffer, FileTypeFromBlob, FileTypeFromStream };
