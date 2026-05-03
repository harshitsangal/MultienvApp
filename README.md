# MultiEnv Ticket Management System

A full-stack application with a React frontend and separate Flask backends for development and production, demonstrating environment-specific ticket management.

## Quick start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine with Compose v2) installed and **running**
- **Port 3000** free on your machine (the web UI is published there)

### Start the stack

From the repository root (`MultienvApp`):

```bash
docker compose up --build
```

The first run downloads images and builds the frontend; it may take several minutes. When the logs settle, the app is ready.

### URLs

| Page or API | URL |
|-------------|-----|
| Home | http://localhost:3000/ |
| Dev environment (UI) | http://localhost:3000/dev |
| Prod environment (UI) | http://localhost:3000/prod |
| Dev tickets (JSON API) | http://localhost:3000/dev/api/tickets |
| Prod tickets (JSON API) | http://localhost:3000/prod/api/tickets |

The React app talks to the Flask backends through **nginx** on the same origin (`/dev/api/...` and `/prod/api/...`). MongoDB runs in Compose and is wired via `MONGO_URI` in `docker-compose.yml`; **27017** is also published if you want a local Mongo client.

### Stop

Press `Ctrl+C` in the terminal where Compose is running, or run:

```bash
docker compose down
```

To remove the database volume as well: `docker compose down -v`.

## Project Structure

```
MultienvApp/
├── docker-compose.yml
├── backend/
│   ├── dev/
│   │   ├── app.py
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── .env          # optional; not required when using Compose defaults
│   └── prod/
│       ├── app.py
│       ├── requirements.txt
│       ├── Dockerfile
│       └── .env
└── frontend/
    ├── src/
    ├── package.json
    ├── Dockerfile
    └── nginx.conf
```

## Environment Configuration

With **Docker Compose**, `MONGO_URI` is set in `docker-compose.yml` (separate MongoDB databases for dev and prod). You only need `.env` files under `backend/dev` or `backend/prod` if you run Flask outside Compose or override the connection string.

### Backend Development Environment (.env) — optional

```
MONGO_URI=your_dev_mongodb_uri
```

### Backend Production Environment (.env) — optional

```
MONGO_URI=your_prod_mongodb_uri
```



### Requirements
```
flask==2.0.1
flask-cors==3.0.10
python-dotenv==0.19.0
pymongo==3.12.0
requests==2.26.0
```



## Security Considerations

- Never commit `.env` files to version control
- Use different MongoDB databases for dev and prod
- Implement proper authentication
- Use secure headers


## Screenshots

<img width="959" height="269" alt="image" src="https://github.com/user-attachments/assets/41b30d7f-dda6-49b4-a419-76c5288ba254" />


<img width="947" height="268" alt="image" src="https://github.com/user-attachments/assets/3e67c857-b338-4043-8873-b7bac03dd64d" />


<img width="949" height="239" alt="image" src="https://github.com/user-attachments/assets/33bc8d75-0295-4972-bec8-4f8a72f69740" />


<img width="948" height="367" alt="image" src="https://github.com/user-attachments/assets/d04f364c-3104-47b3-a1fc-3ba0ed96f2dc" />
