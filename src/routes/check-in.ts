import fastify, { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function CheckIn(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/check-in', {
        schema: { //params e/ou body para configurar 
            summary: 'check-in attendees',//para a documentaçao
                tags: ['check-ins'],//para a documentaçao
            params: z.object({
                attendeeId: z.coerce.number().int()
            }),
            response: {
                201: z.null()
            }
        }
    }, async (request, reply) => {
        const { attendeeId } = request.params

        const attendeeCheckIn = await prisma.checkIn.findUnique({ //findUnique -> encontrar apenas um registro
            where: { //buscara todos os campos do participante pois nao tem select para filtrar
                attendeeId, //esta buscando o id do participante pelo attendeeId do params, no check-in devido a relaçao no bd
            }
        })

        if(attendeeCheckIn !== null) {
            throw new BadRequest("Attendee already checked in");
        }

        await prisma.checkIn.create({ //cria um novo registro check-in com o id do attendee
            data: {
                attendeeId,
            }
        })

        return reply.status(201).send()

    })
}