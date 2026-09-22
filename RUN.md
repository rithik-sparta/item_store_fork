# Run with Docker Compose

This project is designed to run from the repository root with Docker Compose. The stack includes:

- React frontend
- Django REST API backend
- PostgreSQL database

## Prerequisites

- Docker Desktop or Docker Engine installed
- Docker Compose available on your machine

## 1) Open the project root in a terminal

Change into the folder that contains this project, then run the following commands from there.

## 2) Build and start the environment

```bash
docker compose up --build -d
```

This builds the images and starts all containers in the background.

## 3) Check that everything is running

```bash
docker ps
```

You should see containers for:

- frontend
- backend
- pg_prod

## 4) Access the app

Open the frontend in your browser:

```text
http://localhost:3000
```

Example product page:

```text
http://localhost:3000/product/3
```

The backend API is available at:

```text
http://localhost:8000
```

Example backend review endpoint:

```text
http://localhost:8000/reviews/3/?sort_by=date&order=desc
```

## 5) Stop the environment

```bash
docker compose down
```

If you want to remove the database volume too:

```bash
docker compose down -v
```

## 6) Rebuild after code changes

If you edit the frontend or backend code and want to rebuild the containers:

```bash
docker compose up --build -d
```

## 7) View logs if something is not working

Check the frontend logs:

```bash
docker logs frontend
```

Check the backend logs:

```bash
docker logs backend
```

Check the database logs:

```bash
docker logs pg_prod
```

## 8) Notes

- The frontend is served on port 3000.
- The backend is served on port 8000.
- PostgreSQL uses port 5432.
- The backend reads environment values from `backend/default.env`.
- The database schema is initialized from `db_volume/init/create_schema.sql`.

This is the recommended way to run the project end-to-end with Docker Compose.
