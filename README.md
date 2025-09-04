<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# ListsApp - GraphQL API

This project is a GraphQL API built with NestJS, Prisma, and PostgreSQL. It serves as a simple inventory management system for items, lists, and list items, allowing for CRUD operations with user authentication, authorization, pagination, and database seeding.

## Features

- **GraphQL API**: Modern, flexible API for querying and mutating data.
- **Authentication**: JWT-based authentication for securing endpoints.
- **User Management**: CRUD operations for users with role-based access control.
- **Lists & List Items**: Create and manage lists and their items.
- **Pagination and Searching**: Support for paginating and searching through lists and items.
- **Database Seeding**: A dedicated module to populate the database with initial data for development.
- **NestJS Framework**: A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- **Prisma ORM**: Next-generation ORM for Node.js and TypeScript.
- **PostgreSQL**: Powerful, open-source object-relational database system.
- **Docker**: Containerization for easy setup and deployment.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [npm](https://www.npmjs.com/)

## Environment Setup

### Local Development

- Use the `.env` file for local development. Example:

### Production

- Use `.env.prod` for production deployments (e.g., DigitalOcean, Docker Compose):

- When using Docker Compose, specify the env file with `--env-file .env.prod`.

## Getting Started

### 1. Clone the repository

### 2. Set up environment variables

Copy the `.env.template` file to a new file named `.env` and update the variables as needed for local, or use `.env.prod` for production.

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

**Execute the seed:**

This will delete all data and populate the database with the initial data set.

```graphql
mutation {
  executeSeed
}
```

**Sign up a new user:**

```graphql
mutation {
  signup(signupInput: {
    fullName: "Test User",
    email: "test@example.com",
    password: "password123"
  }) {
    token
    user {
      id
      fullName
      email
    }
  }
}
```

**Sign in:**

```graphql
mutation {
  signin(signinInput: {
    email: "test@example.com",
    password: "password123"
  }) {
    token
    user {
      id
      fullName
    }
  }
}
```

After signing in, remember to include the JWT in your Authorization header for protected queries: `Authorization: Bearer <your-token>`.

**Find Items with Pagination and Search (Authenticated):**

```graphql
query {
  items(limit: 10, offset: 0, search: "milk") {
    id
    name
  }
}
```

**Find all Users with Pagination and Search (Admin role required):**

```graphql
query {
  users(limit: 10, offset: 0, search: "gmail") {
    id
    fullName
    email
    roles
  }
}
```

**Create a List:**

```graphql
mutation {
  createList(createListInput: {
    name: "Groceries"
  }) {
    id
    name
  }
}
```

**Add an Item to a List (Create ListItem):**

```graphql
mutation {
  createListItem(createListItemInput: {
    listId: "your-list-id",
    itemId: "your-item-id",
    quantity: 2
  }) {
    id
    quantity
    list {
      id
      name
    }
    item {
      id
      name
    }
  }
}
```

**Find all Lists with their Items:**

```graphql
query {
  lists {
    id
    name
    items {
      id
      quantity
      item {
        name
      }
    }
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
│   ├── auth/               # Authentication module
│   ├── common/             # Common utilities (pagination, etc.)
│   ├── items/              # Items feature module
│   ├── lists/              # Lists feature module
│   ├── list-item/          # ListItem feature module
│   ├── users/              # Users feature module
│   └── seed/               # Database seeding module
├── docker-compose.yml      # Docker configuration
└── package.json            # Project dependencies and scripts
```
