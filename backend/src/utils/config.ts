import * as dotenv from "dotenv";

function ensureValueExists(name: string) {
  const value = process.env[name];

  if (!value) {
    console.log(`${name} configuration option is missing`);
    process.exit(1);
  }
  return value;
}

export function getConfig() {
  return {
    mongodbUrl: ensureValueExists("MONGODB_URL"),
    serverPort: ensureValueExists("SERVER_PORT"),
    cookieSecret: ensureValueExists("COOKIE_SECRET"),
  };
}

dotenv.config();
