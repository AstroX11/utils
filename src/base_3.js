"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreamFromBuffer = exports.getBufferFromStream = exports.extractUrlFromString = void 0;
const stream_1 = require("stream");
const extractUrlFromString = (str) => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const match = str.match(regex);
    return match ? match[0] : null;
};
exports.extractUrlFromString = extractUrlFromString;
const getBufferFromStream = (stream) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        stream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        stream.on('error', (err) => {
            reject(err);
        });
    });
});
exports.getBufferFromStream = getBufferFromStream;
const getStreamFromBuffer = (buffer) => {
    const stream = new stream_1.Readable();
    stream.push(buffer); // Push the buffer data into the stream
    stream.push(null); // Indicate the end of the stream
    return stream;
};
exports.getStreamFromBuffer = getStreamFromBuffer;
