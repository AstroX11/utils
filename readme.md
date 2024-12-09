# Utils Package

A simple utility package for various file and data operations.

## Installation

```bash
npm install utils
```

## Usage

```javascript
import { buffertoJson, jsontoBuffer, getBuffer, detectType } from 'utils';

// Example usage
const buffer = await getBuffer('https://example.com/file');
const type = await detectType(buffer);
console.log(type);
```

## Available Functions

-    `buffertoJson`: Convert a buffer to JSON
-    `jsontoBuffer`: Convert JSON to buffer
-    `transformBuffer`: Apply a transformation to a buffer
-    `bufferToFile`: Write a buffer to a file
-    `toBuffer`: Convert various types to buffer
-    `extractUrlFromString`: Extract URL from a string
-    `getBufferFromStream`: Convert stream to buffer
-    `getStreamFromBuffer`: Convert buffer to stream
-    `FileTypeFromUrl`: Detect file type from URL
-    `FileTypeFromBuffer`: Detect file type from buffer
-    `FileTypeFromBlob`: Detect file type from blob
-    `FileTypeFromStream`: Detect file type from stream
-    `detectType`: Detect content type
-    `getJson`: Fetch JSON from URL
-    `postJson`: Send JSON to URL
-    `getBuffer`: Fetch binary buffer from URL

## License

MIT

````

Here's what I've done:

1. Implemented the TypeScript functions in `index.ts`
2. Created a `tsconfig.json` configured for ES6 module output
3. Updated `package.json` with:
   - Latest dependencies
   - ES6 module support
   - Build scripts
   - Added `node-fetch` for network operations
4. Added a README with basic usage instructions

To set up the project:

```bash
npm init -y
npm install file-type@18.5.1 node-fetch@3.3.2
npm install -D typescript @types/node @types/node-fetch
npx tsc  # This will generate index.js and index.d.ts
````

The package is now set up as an ES6 module with TypeScript support. Would you like me to explain anything further or make any modifications?
