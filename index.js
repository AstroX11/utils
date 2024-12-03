"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XUtils = void 0;
const base_1 = require("./src/base");
const base_2_1 = require("./src/base_2");
const base_3_1 = require("./src/base_3");
const base_4_1 = require("./src/base_4");
const base_5_1 = require("./src/base_5");
const XUtils = {
    detectType: base_5_1.detectType,
    toBuffer: base_2_1.toBuffer,
    getJson: base_1.getJson,
    postJson: base_1.postJson,
    getBuffer: base_1.getBuffer,
    buffertoJson: base_2_1.buffertoJson, jsontoBuffer: base_2_1.jsontoBuffer, transformBuffer: base_2_1.transformBuffer, bufferToFile: base_2_1.bufferToFile,
    extractUrlFromString: base_3_1.extractUrlFromString,
    getStreamFromBuffer: base_3_1.getStreamFromBuffer,
    getBufferFromStream: base_3_1.getBufferFromStream, FileTypeFromUrl: base_4_1.FileTypeFromUrl, FileTypeFromBuffer: base_4_1.FileTypeFromBuffer, FileTypeFromBlob: base_4_1.FileTypeFromBlob, FileTypeFromStream: base_4_1.FileTypeFromStream,
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
};
exports.XUtils = XUtils;
exports.default = XUtils;
