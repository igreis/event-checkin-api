import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-C7EPHLH5.mjs";

// src/routes/check-in.ts
import z from "zod";
async function CheckIn(app) {
  app.withTypeProvider().get("/attendees/:attendeeId/check-in", {
    schema: {
      //params e/ou body para configurar 
      summary: "check-in attendees",
      //para a documentaçao
      tags: ["check-ins"],
      //para a documentaçao
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        201: z.null()
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const attendeeCheckIn = await prisma.checkIn.findUnique({
      //findUnique -> encontrar apenas um registro
      where: {
        //buscara todos os campos do participante pois nao tem select para filtrar
        attendeeId
        //esta buscando o id do participante pelo attendeeId do params, no check-in devido a relaçao no bd
      }
    });
    if (attendeeCheckIn !== null) {
      throw new BadRequest("Attendee already checked in");
    }
    await prisma.checkIn.create({
      //cria um novo registro check-in com o id do attendee
      data: {
        attendeeId
      }
    });
    return reply.status(201).send();
  });
}

export {
  CheckIn
};
