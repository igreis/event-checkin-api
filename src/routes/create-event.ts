import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";

export async function createEvent(app: FastifyInstance) { //criar essa funçao para separar a rota do app sem ter uma dependencia ciclica
    app
        .withTypeProvider<ZodTypeProvider>() //configura o provedor do tipo zod
        .post('/events', {
            schema: { //contem a definiçao para validaçao dos dados, params e/ou body para configurar 
                summary: 'create an event',//para a documentaçao
                tags: ['events'],//para a documentaçao
                body: z.object({ //criaçao de um obj para fzer a validaçao do corpo da requisiçao
                    title: z.string().min(4), //definiçao de validaçao
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable()
                }),
                response: {
                    201: z.object({ //quando for 201
                        eventId: z.string().uuid() //especifica a saida(resposta)
                    })
                }
            },
        }, async (request, reply) => {
            //const { title, details, maximumAttendees } = request.body
            const data = request.body
            const slug = generateSlug(data.title) //gera o slug importando a funçao geradora
            const eventWithSameSlug = await prisma.event.findUnique({ //buscar um registro unico dentro do banco de dados
                where: {
                    slug //buscou slug, caso nao tiver retorna null
                }
            });

            if (eventWithSameSlug !== null) { //se encontrou o slug vai retornar esse erro
                throw new BadRequest('Another event with same title already exist');
            }

            const event = await prisma.event.create({ //criaçao de um novo registro na entidade de eventos
                data: {
                    title: data.title,
                    details: data.details,
                    maximumAttendees: data.maximumAttendees,
                    slug
                }
            })

            return reply.status(201).send({ eventId: event.id }) //retorno de sucesso 201 e o id do event

        })
}

