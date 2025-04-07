import {
  registerForEvent
} from "./chunk-TTIFT77D.mjs";
import {
  errorHandler
} from "./chunk-PP7UF5HR.mjs";
import {
  CheckIn
} from "./chunk-RBD5LUUH.mjs";
import {
  createEvent
} from "./chunk-EINXZRZI.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-6IGLCYEI.mjs";
import {
  getEventAttendees
} from "./chunk-P3LJLTV3.mjs";
import {
  getEvent
} from "./chunk-7C7UJSTT.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-C7EPHLH5.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
  //qualquer url pode acessar a api
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifySwagger, {
  //configs para documentaçao
  swagger: {
    consumes: ["aplication/json"],
    //dados enviados para a api vao ser em json
    produces: ["aplication/json"],
    //produz resultados em json
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in constru\xEDda durante o NLW Unite da Rocketseat",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
  //para o swagge entender que esta usando o zod para fzer a tipagem de entrada e saida de dados
});
app.register(fastifySwaggerUI, {
  //rota para entrar na especificaçao
  routePrefix: "/docs"
});
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(CheckIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("http server running");
});
export {
  app
};
