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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuffer = exports.postJson = exports.getJson = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Fetches JSON data from a URL.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<any>} - The JSON data from the response.
 */
const getJson = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0', // Simulate browser request
            }
        });
        return response.data; // Just return the data from the response
    }
    catch (error) {
        console.error('Error fetching JSON:', error);
        throw error; // If something goes wrong, throw the error
    }
});
exports.getJson = getJson;
/**
 * Sends JSON data to a URL using POST.
 * @param {string} url - The URL to send the data to.
 * @param {object} data - The data to send (in JSON format).
 * @returns {Promise<any>} - The response data after posting.
 */
const postJson = (url, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(url, data, {
            headers: {
                'Content-Type': 'application/json', // Tells the server we're sending JSON
                'User-Agent': 'Mozilla/5.0', // Simulate a browser request
            }
        });
        return response.data; // Return whatever the server responds with
    }
    catch (error) {
        console.error('Error posting JSON:', error);
        throw error; // Throw error if the request fails
    }
});
exports.postJson = postJson;
/**
 * Fetches a binary buffer (like an image or file) from a URL.
 * @param {string} url - The URL to get the binary data from.
 * @returns {Promise<Buffer>} - The buffer of binary data (like an image).
 */
const getBuffer = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(url, {
            responseType: 'arraybuffer', // Tells axios to get raw binary data
            headers: {
                'User-Agent': 'Mozilla/5.0', // Simulate a browser request
            }
        });
        return Buffer.from(response.data); // Convert the binary data to a Buffer
    }
    catch (error) {
        console.error('Error fetching buffer:', error);
        throw error; // If something goes wrong, throw the error
    }
});
exports.getBuffer = getBuffer;
