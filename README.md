fastify = micro framework 
prisma -> orm -> npx prisma init --datasource-provider SQLite: configura SQLite como provedor de fonte de dados. 
zod -> validaçao de dados
tsup -> conversor para js puro -> "build": "tsup src --format esm"

//Metodos http: get, post, put, delete, patch, head, options, ...

//corpo da requisiçao (request body) - enviar dados da requisiçao
//paramentros de busca (search params / query params) filtro ou busca dentro da listagem - http://localhost:3333/users?name=igor
//parametros de rota (route params) -> identificaçao de recursos Delete http://localhost:3333/users/5
//cabeçalhos

//conexao banco de dados

// Driver nativo / Query builders / ORMs -> ex: sequelize, prisma, ...

// 200 -> sucesso
// 300 -> redirecionamento
// 400 -> erro do cliente (erro em alguma informaçao enviado por quem esta fazendo a chama p api)
// 500 -> erro do servidor (um erro que esta acontecendo independente do que esta sendo enviado p o servidor)

comandos prisma
    npx prisma migrate dev -> mapear as mudanças e criar um arquivo com as infos
    npx prisma db seed -> para rodar a seed

## Config json para a seed
    "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
