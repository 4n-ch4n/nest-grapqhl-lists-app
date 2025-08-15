<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# ListsApp - GraphQL API

This project is a GraphQL API built with NestJS, Prisma, and PostgreSQL. It serves as a simple inventory management system for items, allowing for CRUD (Create, Read, Update, Delete) operations.

## Features

- **GraphQL API**: Modern, flexible API for querying and mutating data.
- **NestJS Framework**: A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- **Prisma ORM**: Next-generation ORM for Node.js and TypeScript.
- **PostgreSQL**: Powerful, open-source object-relational database system.
- **Docker**: Containerization for easy setup and deployment.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [npm](https://www.npmjs.com/)

## Getting Started

### 1. Clone the repository

### 2. Set up environment variables

Copy the `.env.template` file to a new file named `.env` and update the variables as needed.

```bash
cp .env.template .env
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the database

This project uses Docker to run a PostgreSQL database. Make sure Docker is running and then execute:

```bash
docker compose up -d
```

This will start a PostgreSQL container and expose it on the port defined in your `.env` file.

### 5. Run Prisma migrations

Apply the database schema to your PostgreSQL instance:

```bash
npx prisma migrate dev
```

This will also generate the Prisma Client based on your schema.

### 6. Run the application

```bash
npm run start:dev
```

The application will be running on `http://localhost:3000`.

## GraphQL Playground

Once the application is running, you can access the GraphQL Playground to interact with the API at:

[http://localhost:3000/graphql](http://localhost:3000/graphql)

### Example Queries and Mutations

**Create an Item:**

```graphql
mutation {
  createItem(createItemInput: {
    name: "Milk",
    quantity: 2,
    quantityUnits: "liters"
  }) {
    id
    name
    quantity
    quantityUnits
  }
}
```

**Find all Items:**

```graphql
query {
  items {
    id
    name
    quantity
  }
}
```

**Find one Item:**

```graphql
query {
  item(id: "your-item-id") {
    id
    name
    quantity
    quantityUnits
  }
}
```

## Project Structure

```
.
├── prisma/
│   └── schema.prisma       # Prisma schema file
├── src/
│   ├── app.module.ts       # Main application module
│   ├── main.ts             # Application entry point
│   └── items/              # Items feature module
│       ├── items.module.ts
│       ├── items.resolver.ts # GraphQL resolver
│       ├── items.service.ts  # Business logic
│       └── ...
├── docker-compose.yml      # Docker configuration
└── package.json            # Project dependencies and scripts
```
