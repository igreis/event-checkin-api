import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId', {
            schema: { //params e ou body para configurar 
                summary: 'get an event',//para a documentaçao
                tags: ['events'],//para a documentaçao
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                response: {
                    200: z.object({
                        event: z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            slug: z.string(),
                            details: z.string().nullable(),
                            maximumAttendees: z.number().int().nullable(),
                            attendeesAmount: z.number().int()
                        })
                    }),
                },
            }
        }, async (request, reply) => {
            const { eventId } = request.params

            const event = await prisma.event.findUnique({ //encontrar apenas um registro
                select: { //especificar quais colunas eu quero buscar
                    id: true,
                    title: true,
                    slug: true,
                    details: true,
                    maximumAttendees: true,
                    _count: { //contar
                        select: {
                            attendees: true //attendees dentro do event, devido ao relacionamento
                        }
                    }
                },
                where: {
                    id: eventId,
                }
            })

            if (event === null) {
                throw new BadRequest('Event not found.')
            }

            return reply.send({
                event: { //reescrever 
                    id: event.id,
                    title: event.title,
                    slug: event.slug,
                    details: event.details,
                    maximumAttendees: event.maximumAttendees,
                    attendeesAmount: event._count.attendees
                }
            }) //retorna o event dentro de chaves para ter a possibilidade de futuramente adicionar mais coisas para retornar
        })
}