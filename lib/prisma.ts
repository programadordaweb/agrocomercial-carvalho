import { PrismaClient } from "./generated/prisma/client";

const globalForPrisma = globalThis as unknown as { _prisma?: InstanceType<typeof PrismaClient> };

export function db(): InstanceType<typeof PrismaClient> {
  if (!globalForPrisma._prisma) {
    // @ts-expect-error Prisma constructor
    globalForPrisma._prisma = new PrismaClient();
  }
  return globalForPrisma._prisma;
}
