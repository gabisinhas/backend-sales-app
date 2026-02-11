import fs from "fs/promises";
import crypto from "crypto";
import path from "path";

export class FileStorage {
  constructor() {
    this.basePath = path.resolve("storage");
    this.processedFilePath = path.join(this.basePath, "processed-files.json");
  }

  async ensureStorage() {
    try {
      await fs.mkdir(this.basePath, { recursive: true });
      await fs.access(this.processedFilePath);
    } catch {
      await fs.writeFile(this.processedFilePath, JSON.stringify([]));
    }
  }

  async calculateHash(filePath) {
    const fileBuffer = await fs.readFile(filePath);
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
  }

  async isAlreadyProcessed(fileHash) {
    await this.ensureStorage();

    const data = await fs.readFile(this.processedFilePath, "utf-8");
    const processedFiles = JSON.parse(data);

    return processedFiles.includes(fileHash);
  }

  async markAsProcessed(fileHash) {
    await this.ensureStorage();

    const data = await fs.readFile(this.processedFilePath, "utf-8");
    const processedFiles = JSON.parse(data);

    processedFiles.push(fileHash);

    await fs.writeFile(
      this.processedFilePath,
      JSON.stringify(processedFiles, null, 2)
    );
  }
}
