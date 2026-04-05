/**
 * lib/formParser.ts
 * -----------------
 * Parses multipart/form-data from a Next.js API request.
 * Uses the `formidable` package (included transitively) or a manual approach.
 * We use the `busboy` package which is already a dependency of Next.js.
 */

import type { NextApiRequest } from "next";
import { Writable } from "stream";

interface ParsedFile {
  data:     Buffer | Uint8Array;
  filename: string;
  mimetype: string;
  size:     number;
}

interface ParseResult {
  fields: Record<string, string>;
  files:  Record<string, ParsedFile>;
}

export function parseFormData(req: NextApiRequest): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    // Dynamically import busboy (ships with Next.js)
    import("busboy").then((busboyModule) => {
      const Busboy = busboyModule.default;

      const bb = Busboy({
        headers: req.headers as Record<string, string>,
        limits:  { fileSize: 20 * 1024 * 1024 }, // 20 MB
      });

      const fields: Record<string, string> = {};
      const files:  Record<string, ParsedFile> = {};

      bb.on("field", (name, value) => {
        fields[name] = value;
      });

      bb.on("file", (name, stream, info) => {
        const chunks: Buffer[] = [];

        stream.on("data", (chunk: Buffer) => chunks.push(chunk));
        stream.on("end", () => {
          files[name] = {
            data:     Buffer.concat(chunks),
            filename: info.filename,
            mimetype: info.mimeType,
            size:     chunks.reduce((acc, c) => acc + c.length, 0),
          };
        });
        stream.on("error", reject);
      });

      bb.on("finish", () => resolve({ fields, files }));
      bb.on("error", reject);

      // Pipe the request into busboy
      req.pipe(bb as unknown as Writable);
    }).catch(reject);
  });
}
