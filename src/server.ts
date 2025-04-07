import fastify from "fastify"; //microframework
import fastifySwagger from "@fastify/swagger"; //documentaçao
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors"; //configura quem pode(url,front-end) acessar a api
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod"; //validaçao
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { CheckIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";
import { errorHandler } from "./error-handler";


export const app = fastify();

app.register(fastifyCors, {
    origin: '*' //qualquer url pode acessar a api
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, { //configs para documentaçao
    swagger: {
        consumes: ['aplication/json'], //dados enviados para a api vao ser em json
        produces: ['aplication/json'], //produz resultados em json
        info: {
            title: 'pass.in',
            description: 'Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat',
            version: '1.0.0'
        },
    },
    transform: jsonSchemaTransform //para o swagge entender que esta usando o zod para fzer a tipagem de entrada e saida de dados
})

app.register(fastifySwaggerUI, { //rota para entrar na especificaçao
    routePrefix: '/docs'
})

app.register(createEvent); //registrar a funçao que contem as rotas
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(CheckIn);
app.register(getEventAttendees);

app.setErrorHandler(errorHandler) //registra a classe erroHandler para tratar todos os erros

        //host -> para nao bugar no react native
app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('http server running')
})
