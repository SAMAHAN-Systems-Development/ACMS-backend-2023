# **ACMS Backend**

More info at [ACMS Documentation](https://www.notion.so/samahan-sysdev/Automated-Crowd-Monitoring-System-ACMS-2023-Documentation-f4a08ad5ef8a48c68d7ae21bec210fc1)

### Tools that needs to be installed:

- Docker (https://docs.docker.com/desktop/install/windows-install/)
- Node (https://nodejs.org/en/download)
- NestJS CLI (https://docs.nestjs.com/cli/overview)
- VS Code (https://code.visualstudio.com/)

### Tech Stack

- [NestJS](https://nestjs.com/) - Back-end Framework
- [Prisma](https://www.prisma.io/) - Object Relational Mapping (ORM) Tool
- [Supabase](https://supabase.com/docs) - Database, Storage and Authentication Provider
- [PostgreSQL](https://www.postgresql.org/) - Database Management System
- [Docker](https://www.docker.com/) - Containerization Tool
- [Git](https://git-scm.com/)/[Github](https://github.com/) - Version Control

### Database Design:

**Student**

| Type    | Column Name     |
| ------- | --------------- |
| String  | uuid            |
| String  | name            |
| String  | email           |
| String  | year_and_course |
| Payment | payment         |
| Event   | event           |

**Payment**

| Type    | Column Name |
| ------- | ----------- |
| Student | student     |
| String  | photo_src   |
| String  | status      |

**Event**

| Type    | Column Name      |
| ------- | ---------------- |
| String  | title            |
| String  | price            |
| Integer | people_max_limit |
| Boolean | requires_payment |
| String  | description      |
| Boolean | isActive         |
| String  | formName         |
| Student | student          |

### Setting up your application

1. Clone the Repository:

```bash
git clone https://github.com/SAMAHAN-Systems-Development/ACMS-backend-2023
```

1. Fetch the updates:

```bash
git fetch
```

1. Switch to the branch of your ticket, for example:

```bash
git checkout 1-login-of-facilitator-cashier-and-admin
```

1. Install the libraries with this command:

```bash
npm i
```

1. Install and create the docker containers with this command (make sure that you already started your docker application):

```bash
npx supabase start
```

1. Add a .env file

   1. Create a `.env` file in your root directory
   2. Add this to your `.env` file:

   ```bash
   DATABASE_URL='postgresql://postgres:postgres@localhost:54322/postgres?schema=public';
   DIRECT_URL='postgresql://postgres:postgres@localhost:54322/postgres?schema=public';
   SUPABASE_URL='http://127.0.0.1:54321';
   SUPABASE_KEY='supabase_key';
   FRONTEND_URL='http://localhost:3001';
   NODE_ENV='development';
   ```

2. Update the database by the Prisma migrations with these commands:

```bash
npm run prisma:migrate:reset
```

```bash
npx prisma generate
```

### Running your application

If you just turned your pc on and you want to start the application, run the following commands:

1. Pull from the main

```bash
git pull origin main
```

1. Install the libraries

```bash
npm i
```

1. Run the docker containers (make sure that you already started your docker application)

```bash
npx supabase start
```

1. Run the NestJS backend

```bash
npm run start
```

- 📌 After you finish programming, run this command to stop the docker containers:
  ```bash
  npx supabase stop
  ```
