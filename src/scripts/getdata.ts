import fs from "fs/promises";
import path from "path";

export async function readJSONFile(filePath: string) {
  // Ensure the path starts from the database directory
  console.log(process.cwd())
  const fullPath = path.join(process.cwd(), "../", "database", filePath);
  try {
    const fileContent = await fs.readFile(fullPath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    // console.error(`Error reading file ${filePath}:`, error);
    throw new Error(`Unable to read file ${filePath} ${error}`);
  }
}
