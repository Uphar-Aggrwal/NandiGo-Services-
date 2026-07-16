import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });
const password = await rl.question("Admin password to hash: ");
rl.close();

if (!password || password.trim().length < 8) {
  console.error("Password must be at least 8 non-whitespace characters.");
  process.exit(1);
}

console.log(await bcrypt.hash(password, 12));
