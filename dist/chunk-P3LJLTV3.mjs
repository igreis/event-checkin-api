import {
  prisma
} from "./chunk-C7EPHLH5.mjs";

// src/routes/get-event-attendees.ts
import { z } from "zod";
async function getEventAttendees(app) {
  app.withTypeProvider().get("/events/:eventId/attendees", {
    schema: {
      //params e/ou body para configurar 
      summary: "get event attendees",
      //para a documentaçao
      tags: ["events"],
      //para a documentaçao
      params: z.object({
        eventId: z.string().uuid()
      }),
      querystring: z.object({
        //parametros de consulta
        query: z.string().nullish(),
        //nulish -> tanto undefined quanto null
        pageIndex: z.string().nullish().default("0").transform(Number)
        //index da pagina
      }),
      response: {
        200: z.object({
          attendees: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              email: z.string().email(),
              createdAt: z.date(),
              checkdInAt: z.date().nullable()
            })
          )
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { pageIndex, query } = request.query;
    const attendees = await prisma.attendee.findMany({
      //encontrar varios registros
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        checkIn: {
          select: {
            createdAt: true
          }
        }
      },
      where: query ? {
        //se possuir query
        eventId,
        name: {
          contains: query
          //name que contem o valor fornecido pela query
        }
      } : {
        eventId
      },
      take: 10,
      //maximo de resultados retornados
      skip: pageIndex * 10,
      //quantos resultados vao ser pulados em relaçao a quantidade de paginas
      orderBy: {
        //ordenaçao dos resultados
        createdAt: "desc"
        //decrescente para a data
      }
    });
    return reply.send({
      attendees: attendees.map((attendee) => {
        return {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          createdAt: attendee.createdAt,
          checkdInAt: attendee.checkIn?.createdAt ?? null
          //?? -> fornecer um valor padrão caso o valor à esquerda seja null ou undefined
        };
      })
    });
  });
}

export {
  getEventAttendees
};
