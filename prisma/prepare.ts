import { execSync } from "child_process";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

execSync("npx prisma db push", { stdio: "inherit", env: process.env });
execSync("npx prisma db seed", { stdio: "inherit", env: process.env });
