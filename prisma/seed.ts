//ARQUIVO SEED PARA CONFIGURAR UM AMBIENTE INICIAL, POPULAR E ADICIONAR CONFIGS PADRAO

import { prisma } from '../src/lib/prisma';

async function Seed() {
    await prisma.event.create({
        data: {
            id: 'db0fe413-49ee-4428-b2e2-9d648cf1a537', //uuid ramdom gerado pelo google
            title: 'Unite Summit',
            slug: 'unit-summit',
            details: 'um evento p devs',
            maximumAttendees: 120
        }
    })
}

Seed().then(() => {
    console.log('Database seeded')
    prisma.$disconnect()
})