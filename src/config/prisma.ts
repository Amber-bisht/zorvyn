import { PrismaClient } from "@prisma/client";

// Bhai, ye prisma client setup hai 
// Pure app me yahi client use karenge hum database se baat karne ke liye
// amber bisht - 5:25 1 april
const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
