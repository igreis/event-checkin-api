import fastify, { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { request } from "http";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";


export async function registerForEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>() //configurar o provedor de tipos zod
        .post('/events/:eventId/attendees', {
            schema: { //contem a definiçao para validaçao dos dados, params e/ou body para configurar 
                summary: 'register an attendee',//para a documentaçao
                tags: ['attendees'],//para a documentaçao
                body: z.object({ //objeto de validaçao
                    name: z.string().min(2), //definiçao de validaçao
                    email: z.string().email(),//definiçao de validaçao
                }),
                params: z.object({
                    eventId: z.string().uuid() //definiçao de validaçao
                })
            }
        }, async (request, reply) => {
            const { eventId } = request.params;
            const { name, email } = request.body;

            const attendeeFromEmail = await prisma.attendee.findUnique({ //faz uma busca de apenas um registro no banco de dados e atribui o resultado à constante
                where: { //define o criterio para a busca
                    eventId_email: { //verifica se existe email ja atribuido a esse evento
                        email,
                        eventId
                    }
                }
            })

            if (attendeeFromEmail !== null) { //se ja tiver um email e eventId dara erro de registro
                throw new BadRequest('This e-mail is already registered for this event.')
            }

            const [event, amountOfAttendeesForEvent] = await Promise.all([ //executa as promessas em paralelo

                prisma.event.findUnique({ //busca o evento onde o id é o eventId desse evento
                    where: {
                        id: eventId
                    }
                }),

                prisma.attendee.count({ //conta quantos registros tem nesse eventId
                    where: {
                        eventId
                    }
                })
            ])

            /*const event = await prisma.event.findUnique({ //busca o evento onde o id é o eventId desse evento
                where: {
                    id: eventId
                }
            })

            const amountOfAttendeesForEvent = await prisma.attendee.count({ //conta quantos registros tem nesse eventId
               where: {
                   eventId
                }
            })*/

            if (event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees) { // se o numero maximo(maximum) de attendees for maior doq o de registros
                throw new BadRequest('The maximin number of attendees for this event has been reached');
            }

            const attendee = await prisma.attendee.create({
                data: {
                    name,
                    email,
                    eventId
                }
            })

            return reply.status(201).send({ attendeeId: attendee.id });
        })
}