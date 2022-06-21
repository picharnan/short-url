# Short Url

This project is just for hobby. If you want to develop just fork. Thanks for your interested.

## Stack

- TypeScript as development language
- Nest.js as Backend
- Vue.js as Frontend
- [Vuetify](https://vuetifyjs.com/en/) as UI
- Prisma as ORM database
- PostgreSQL as Database
- [Handlebars](https://handlebarsjs.com/) as Template engine

## Database

I use PostgreSQL on development process. The [prisma.io](https://www.prisma.io/) is ORM. You can choose the right database for you, such as MySQL, MSSQL, PostgreSQL. Then just modify database connect string that match your choosed database.

## Database Set-up by Docker

Run this command to build docker

```bash
docker-compose up
```

- username : postgres
- password : posrgres
- port : 5431

But you can modify DB environment at .env file

## Installation

```bash
npm install
```

## Setup database

Config connect string in .env file. Then run prisma command to migrate the database and generate Prisma client.

```bash
npx prisma db push
```

### Setup database trouble

I use PosrgreSQL as databse and don't test for other. If you have a trouble with database installation, try to modify _/prisma/schema.prisma_ file and execute db push command again.

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```
