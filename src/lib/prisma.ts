import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({ //conexao com o bd
    log: ['query'] // faz um log para cada query feita
})