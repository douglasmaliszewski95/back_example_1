import { Readable } from "stream";
import csv from "csv-parser"

interface CsvRow {
  [key: string]: string;
}

export class ReadCsvFile {

  read = async (buffer: Buffer) => {
    const stream = await this.bufferToStream(buffer);
    return await this.readStream(stream)
  }

  bufferToStream = (buffer: Buffer): Readable => {
    const readable = Readable.from(buffer);
    return readable;
  };

  readStream = (stream: Readable): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const results: string[] = [];
      stream
        .pipe(csv({ headers: false }))
        .on('data', (data: CsvRow) => {
          const keys = Object.keys(data);
          if (keys.length > 0) {
            results.push(data[keys[0]]);
          }
        })
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
}