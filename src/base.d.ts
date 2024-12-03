/**
 * Fetches JSON data from a URL.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<any>} - The JSON data from the response.
 */
export declare const getJson: (url: string) => Promise<any>;
/**
 * Sends JSON data to a URL using POST.
 * @param {string} url - The URL to send the data to.
 * @param {object} data - The data to send (in JSON format).
 * @returns {Promise<any>} - The response data after posting.
 */
export declare const postJson: (url: string, data: object) => Promise<any>;
/**
 * Fetches a binary buffer (like an image or file) from a URL.
 * @param {string} url - The URL to get the binary data from.
 * @returns {Promise<Buffer>} - The buffer of binary data (like an image).
 */
export declare const getBuffer: (url: string) => Promise<Buffer>;
