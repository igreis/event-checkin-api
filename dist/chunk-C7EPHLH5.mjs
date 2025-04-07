// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient({
  //conexao com o bd
  log: ["query"]
  // faz um log para cada query feita
});

export {
  prisma
};
