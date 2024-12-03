"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferToFile = exports.transformBuffer = exports.jsontoBuffer = exports.buffertoJson = void 0;
exports.toBuffer = toBuffer;
const fs_1 = __importDefault(require("fs"));
const file_type_1 = __importDefault(require("file-type"));
const buffertoJson = (buffer) => {
    try {
        const jsonString = buffer.toString('utf-8');
        return JSON.parse(jsonString);
    }
    catch (error) {
        throw new Error(`Unable to convert Buffer to JSON:\n${error}`);
    }
};
exports.buffertoJson = buffertoJson;
const jsontoBuffer = (json) => {
    try {
        const jsonString = JSON.stringify(json);
        return Buffer.from(jsonString, 'utf-8');
    }
    catch (error) {
        throw new Error(`Unable to convert JsonToBuffer:\n${error}`);
    }
};
exports.jsontoBuffer = jsontoBuffer;
const transformBuffer = (buffer, transformFn) => {
    try {
        return transformFn(buffer);
    }
    catch (error) {
        throw new Error(`Cannot TransForm Buffer:\n${error}`);
    }
};
exports.transformBuffer = transformBuffer;
const bufferToFile = (buffer, filePath) => {
    try {
        const type = (0, file_type_1.default)(buffer);
        if (!type)
            throw new Error('Unable to detect file type');
        const extension = type.ext;
        const fileName = filePath.endsWith(`.${extension}`) ? filePath : `${filePath}.${extension}`;
        fs_1.default.writeFileSync(fileName, buffer);
    }
    catch (error) {
        throw new Error(`Invaild Data Buffer:\n${error}`);
    }
};
exports.bufferToFile = bufferToFile;
function toBuffer(data) {
    return Buffer.from(JSON.stringify(data));
}
