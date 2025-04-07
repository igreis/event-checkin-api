import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-C7EPHLH5.mjs";

// src/routes/get-attendee-badge.ts
import z from "zod";
async function getAttendeeBadge(app) {
  app.withTypeProvider().get("/attendees/:attendeeId/badge", {
    schema: {
      //params e/ou body para configurar 
      summary: "get and attendee badge",
      //para a documentaçao
      tags: ["attendees"],
      //para a documentaçao
      params: z.object({
        attendeeId: z.coerce.number().int()
        //converte para number inteiro
      }),
      response: {
        200: z.object({
          badge: z.object({
            name: z.string(),
            email: z.string().email(),
            eventTitle: z.string(),
            checkInURL: z.string().url()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const attendee = await prisma.attendee.findUnique({
      //findUnique -> encontrar apenas um registro
      select: {
        //seleciona os campos para buscar
        name: true,
        email: true,
        event: {
          select: {
            title: true
          }
        }
      },
      where: {
        //especifica o attendee
        id: attendeeId
      }
    });
    if (attendee === null) {
      throw new BadRequest("Attendee not found.");
    }
    const baseURL = `${request.protocol}://${request.hostname}`;
    const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL);
    return reply.send({
      badge: {
        name: attendee.name,
        email: attendee.email,
        eventTitle: attendee.event.title,
        checkInURL: checkInURL.toString()
        //converte a classe para string
      }
    });
  });
}

export {
  getAttendeeBadge
};
