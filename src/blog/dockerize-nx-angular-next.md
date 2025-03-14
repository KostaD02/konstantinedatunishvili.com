---
layout: "article.njk"
title: How to Dockerize Nx monorepo with Angular and Nest
description: How to efficiently Dockerize an Nx monorepo containing Angular and NestJs or any app.
image: "/assets/images/dockerize-nx-angular-nest.png"
imageAlt: Nx, Docker, Angular, and Nest logos
date: 2025-03-14
chips: ["Nx", "Angular", "NestJs", "Docker"]
tags:
  - post
  - tech
---

Let's assume that you already have a working [Nx](https://nx.dev/) monorepo with an [Angular](https://angular.dev/) and [Nest](https://nestjs.com/)
application configured for local development but don't know how to [dockerize](https://www.docker.com/) it. In that case, you are in the right place.
In this article, you will learn how to dockerize an Nx monorepo with any application inside it.

> **TL;DR**: First, build the applications and libraries outside of the Dockerfile, then copy the built source code and serve it as needed.

## How to Build Nx Applications

<a class="skip" href="#how-to-serve-applications-with-dockerfiles">Skip to How to server applications with Dockerfiles</a>

Inside an Nx monorepo, you will have an apps folder containing applications and a libs folder where all libraries are stored.
To build every application and library, simply run the following command:

```
nx run-many --target=build --all
```

After running this command, you should get some build files, typically inside the `dist` folder.
However, the output directory may vary depending on your configuration.

In my case, the Nest configuration is set to default, and the Angular configuration (`apps/client/project.json`) looks like this:

```json
{
  "name": "client",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "projectType": "application",
  "prefix": "monotor",
  "sourceRoot": "apps/client/src",
  "tags": [],
  "targets": {
    "build": {
      "executor": "@angular-devkit/build-angular:application",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/apps/client",
        "index": "apps/client/src/index.html",
        ...
      }
    ...
    }
  ...
  }
}
```

Output will be similar to this:

```
dist
├───apps
│   ├───client
│   │   └───browser
│   └───server
└───libs
    ├───auth
    │
    └───shared
        ├───consts
        ├───decorators
        ├───guards
        ├───interceptors
        ├───interfaces
        ├───providers
        ├───schemas
        ├───services
        └───util
```

## How to serve applications with Dockerfiles

<a class="skip" href="#docker-compose">Docker compose</a>

There are many approaches to serving applications using Dockerfiles.
This can be done using `docker-compose`, the local context of a Dockerfile, and other methods.

In this article, we will use deployed Docker images with `docker-compose`.

### Writing dockerfiles

Dockerfiles are used to define the instructions for creating a Docker image.
They specify how to package an application, including its dependencies, configurations, and runtime environment.

A `Dockerfile` should always follow this format. You can specify the build context using a dot.

For example, These are valid Dockerfile names:

```
Dockerfile
Dockerfile.server
```

You can create a Dockerfile in different locations, such as `apps/server`,
but I personally prefer to keep it in the root folder, in the same place as `docker-compose.yml`.

Now, let's create `Dockerfile.server`

```Dockerfile
FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY dist/apps/server ./server-dist

EXPOSE 3000

CMD ["node", "server-dist/main.js"]
```

The `Dockerfile.server` starts with `FROM node:alpine`, which uses a minimal [Node.js](https://nodejs.org/en) image to keep the container lightweight.
Then, `WORKDIR /app` sets the working directory inside the container, ensuring all commands run from this location.

Next, `COPY package\*.json ./` copies `package.json` and `package-lock.json` to the container.
This is followed by `RUN npm ci --only=production`, which installs only the production dependencies,
ensuring a clean and efficient install.

After that, `COPY dist/apps/server ./server-dist` brings in the built NestJS application.
This assumes the app is already built using nx build server, meaning only the **compiled** code is copied, making the image **smaller** and **reducing** build time.

Then, `EXPOSE 3000` declares that the container will use `port 3000`, though it doesn’t actually publish it. It just serves as documentation.

Finally, the `CMD ["node", "server-dist/main.js"]` command tells the container to start the NestJS application using Node.js.

Now, let's create `Dockerfile.client`

```Dockerfile
FROM nginx:alpine

COPY dist/apps/client/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

This Dockerfile is designed to serve a frontend application (such as an Angular app) using [Nginx](https://nginx.org/), a lightweight and high-performance web server.

It starts with `FROM nginx:alpine`, which uses the Alpine-based Nginx image, keeping the container small and efficient.

Next, `COPY dist/apps/client/browser /usr/share/nginx/html` copies the built Angular application from `dist/apps/client/browser`
into Nginx’s default serving directory (`/usr/share/nginx/html`). This means that when the container runs, Nginx will automatically serve the frontend files.

The `EXPOSE 80` command tells Docker that the container will use port 80, the default HTTP port.
However, like before, this does not actually publish the port—it just documents it.

Finally, `CMD ["nginx", "-g", "daemon off;"]` ensures that Nginx runs in the foreground so that Docker doesn’t terminate the container immediately.

Be careful when using this Nginx approach, as it modifies the base serving directory.
This means that if a user already has a website in that location, it will be replaced with this one.

This is a simple way to serve an application with Nginx. However, you can also use different approaches,
such as serving with Node.js, [Caddy](https://caddyserver.com/), or even Nginx with a more advanced configuration to handle multiple sites or additional optimizations.

Visit my [self-hosting project](https://github.com/KostaD02/monotor) to see how I implemented it for the client using Node.js.

### Bulding docker files

To build Docker images, run the following commands:

```
docker build -f Dockerfile.client -t kostad02/monotor-client:latest .
docker build -f Dockerfile.server -t kostad02/monotor-server:latest .
```

- `docker build` - Initiates the build process for a Docker image.
- `-f Dockerfile.client` - Specifies the Dockerfile to use **Dockerfile.client**.
- `-t kostad02/monotor-client:latest` - Assigns a tag (`-t` stands for "tag"), which names the image:
  - `kostad02/monotor-client` - The repository and image name (a repository is not required)
  - `latest` - The tag version (default is latest, but you could use v1.0, etc.).
- `.` - The build context (current directory), meaning Docker will look for necessary files there.

If you don't want to deploy your image and prefer to use a local build, you can skip to the following section: [Docker Compose](#docker-compose).

### Deploying docker images

Create an account on [Docker Hub](https://hub.docker.com/) and set up a repository.

Next, rebuild the Docker images:

```
docker build -f Dockerfile.client -t kostad02/monotor-client:latest .
docker build -f Dockerfile.server -t kostad02/monotor-server:latest .
```

To publish the images, use the following commands:

```
docker push kostad02/monotor-client:latest
docker push kostad02/monotor-server:latest
```

## Docker Compose

<a class="skip" href="#scripts">Scripts</a>

Docker Compose is a tool that helps you manage multiple Docker containers easily.
Instead of running separate docker run commands for each service (like a frontend, backend, and database),
you can define everything in a single [YAML](https://yaml.org/) file (`docker-compose.yml`).

For example, let's create a Docker Compose setup with multiple containers, including a client, server, and database.

```yaml
services:
  mongo:
    container_name: monotor-db
    image: mongo:latest
    restart: always
    volumes:
      - mongo_db:/data/db
    networks:
      - monotor-network

  server:
    container_name: monotor-server
    image: kostad02/monotor-server:latest
    restart: always
    ports:
      - "2201:2201"
    depends_on:
      - mongo
    environment:
      PORT: 2201
    networks:
      - monotor-network
    volumes:
      - monotor-data:/app/data
      - monotor-logs:/app/logs

  client:
    container_name: monotor-client
    image: kostad02/monotor-client:latest
    restart: always
    ports:
      - "2202:80"
    depends_on:
      - server
    networks:
      - monotor-network

networks:
  monotor-network:
    driver: bridge

volumes:
  mongo_db: {}
  monotor-data: {}
  monotor-logs: {}
```

In this YAML file, we use the following properties:

- `services` – Defines the different containers that will run as part of the application.
- `container_name` – Sets a custom name for the container.
- `image` – Specifies the Docker image to use for the container.
- `build` – Defines how to build an image from a Dockerfile if no prebuilt image is used.
- `ports` – Maps ports between the host machine and the container.
- `volumes` – Creates persistent storage for data that should survive container restarts.
- `environment` – Passes environment variables into the container.
- `depends_on` – Ensures that a service starts only after its dependencies are running.
- `networks` – Configures networking between containers.
- `restart` – Defines the restart policy for the container.

If you prefer to build images locally instead of using prebuilt ones, modify the YAML structure as follows:

```yaml
services:
  mongo:
    container_name: monotor-db
    image: mongo:latest
    restart: always
    volumes:
      - mongo_db:/data/db
    networks:
      - monotor-network

  server:
    container_name: monotor-server
    build:
      context: .
      dockerfile: Dockerfile.server
    restart: always
    ports:
      - "2201:2201"
    depends_on:
      - mongo
    environment:
      PORT: 2201
    networks:
      - monotor-network
    volumes:
      - monotor-data:/app/data
      - monotor-logs:/app/logs

  client:
    container_name: monotor-client
    build:
      context: .
      dockerfile: Dockerfile.client
    restart: always
    ports:
      - "2202:80"
    depends_on:
      - server
    networks:
      - monotor-network

networks:
  monotor-network:
    driver: bridge

volumes:
  mongo_db: {}
  monotor-data: {}
```

## Scripts

To make life easier, here are some predefined scripts you can use in `package.json`.

```json
{
  "scripts": {
    "build:server": "nx build server",
    "build:client": "nx build client",
    "docker:build:client": "npm run build:client && docker build -f Dockerfile.client -t kostad02/monotor-client:latest .",
    "docker:build:server": "npm run build:server && docker build -f Dockerfile.server -t kostad02/monotor-server:latest .",
    "docker:build": "npm run build && npm run docker:build:client && npm run docker:build:server",
    "docker:push": "docker push kostad02/monotor-client:latest && docker push kostad02/monotor-server:latest",
    "docker:release": "npm run docker:build && npm run docker:push"
  }
}
```

## Summary

In this guide, we covered how to Dockerize an Nx monorepo with Angular and NestJS, build Docker images, and use Docker Compose for multi-container deployment.
By following these steps, you can efficiently manage and deploy your applications in a containerized environment.

You can check out a fully working Nx project with Angular, Nest, and Docker [here](https://github.com/KostaD02/monotor).

Have fun!
