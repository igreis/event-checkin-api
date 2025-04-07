import {
  generateSlug
} from "./chunk-KDMJHR3Z.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-C7EPHLH5.mjs";

// src/routes/create-event.ts
import { z } from "zod";
async function createEvent(app) {
  app.withTypeProvider().post("/events", {
    schema: {
      //contem a definiçao para validaçao dos dados, params e/ou body para configurar 
      summary: "create an event",
      //para a documentaçao
      tags: ["events"],
      //para a documentaçao
      body: z.object({
        //criaçao de um obj para fzer a validaçao do corpo da requisiçao
        title: z.string().min(4),
        //definiçao de validaçao
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
      }),
      response: {
        201: z.object({
          //quando for 201
          eventId: z.string().uuid()
          //especifica a saida(resposta)
        })
      }
    }
  }, async (request, reply) => {
    const data = request.body;
    const slug = generateSlug(data.title);
    const eventWithSameSlug = await prisma.event.findUnique({
      //buscar um registro unico dentro do banco de dados
      where: {
        slug
        //buscou slug, caso nao tiver retorna null
      }
    });
    if (eventWithSameSlug !== null) {
      throw new BadRequest("Another event with same title already exist");
    }
    const event = await prisma.event.create({
      //criaçao de um novo registro na entidade de eventos
      data: {
        title: data.title,
        details: data.details,
        maximumAttendees: data.maximumAttendees,
        slug
      }
    });
    return reply.status(201).send({ eventId: event.id });
  });
}

export {
  createEvent
};
