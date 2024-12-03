/**
 * Detects the type of content by converting it to a buffer and checking its MIME type.
 * @param content - The content to analyze (can be a URL, buffer, or string).
 * @returns A promise resolving to the detected type ('text', 'image', 'video', 'audio', 'document', 'sticker').
 */
export declare function detectType(content: string | Buffer): Promise<string>;
