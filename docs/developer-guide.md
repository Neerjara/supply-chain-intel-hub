# Supply Chain Intelligence Hub (SCIH) - Developer Setup & Local Operations Guide

This guide provides step-by-step instructions for setting up, building, running, testing, and troubleshooting the **Supply Chain Intelligence Hub (SCIH)** locally using **Docker Compose**, **PostgreSQL 16**, **ASP.NET Core 8 Web API**, **.NET 8 Worker Service**, and **React 18 (Vite + TypeScript + Material UI)**.

---

## Table of Contents
1. [Prerequisites & System Requirements](#1-prerequisites--system-requirements)
2. [Repository Setup & Initialization](#2-repository-setup--initialization)
3. [Running via Docker Compose (Recommended)](#3-running-via-docker-compose-recommended)
4. [Running Standalone (Local Debugging)](#4-running-standalone-local-debugging)
5. [Database Management & Seeding](#5-database-management--seeding)
6. [Executing Automated Tests](#6-executing-automated-tests)
7. [Comprehensive Troubleshooting Guide](#7-comprehensive-troubleshooting-guide)

---

## 1. Prerequisites & System Requirements

Ensure the following tools are installed on your machine before proceeding:

| Software / Tool | Minimum Version | Installation Link / Command |
| :--- | :--- | :--- |
| **Git** | 2.40+ | `winget install Git.Git` or [git-scm.com](https://git-scm.com) |
| **Docker Desktop** | 4.25+ | `winget install Docker.DockerDesktop` or [docker.com](https://www.docker.com) |
| **.NET 8.0 SDK** | 8.0.100+ | `winget install Microsoft.DotNet.SDK.8` or [dotnet.microsoft.com](https://dotnet.microsoft.com) |
| **Node.js** | 20.x LTS | `winget install OpenJS.NodeJS.LTS` or [nodejs.org](https://nodejs.org) |
| **Terraform CLI** | 1.7.0+ | `winget install Hashicorp.Terraform` or [terraform.io](https://www.terraform.io) |

---

## 2. Repository Setup & Initialization

Clone the repository and verify environment settings:

```bash
# Clone repository
git clone https://github.com/org/supply-chain-intel-hub.git
cd supply-chain-intel-hub

# Verify .NET SDK installation
dotnet --version # Should output 8.0.x

# Verify Node.js installation
node -v # Should output v20.x.x

# Verify Docker engine status
docker info
```

---

## 3. Running via Docker Compose (Recommended)

The Docker Compose stack orchestrates PostgreSQL 16, ASP.NET Core API, .NET Worker Service, and NGINX React Frontend in isolated containers with health checks.

### Step 1: Build & Launch Containers
```bash
# Build and start all 4 services in detached mode
docker-compose up -d --build
```

### Step 2: Verify Container Health
```bash
# List running container status
docker-compose ps
```

*Expected Output:*
```
NAME            IMAGE                 COMMAND                  SERVICE         STATUS
scih-postgres   postgres:16-alpine    "docker-entrypoint.s…"   scih-postgres   running (healthy)
scih-api        scih-api:latest       "dotnet SCIH.Api.dll"    scih-api        running (healthy)
scih-worker     scih-worker:latest    "dotnet SCIH.Worker.dll" scih-worker     running
scih-web        scih-web:latest       "/docker-entrypoint.…"   scih-web        running (healthy)
```

### Step 3: Access Application Endpoints

- **React Web Application**: [`http://localhost:3000`](http://localhost:3000)
- **ASP.NET Core API Swagger UI**: [`http://localhost:8080/swagger`](http://localhost:8080/swagger)
- **API Health Probe**: [`http://localhost:8080/health`](http://localhost:8080/health)
- **PostgreSQL Database**: `localhost:5432` (`User: psqladmin`, `Password: LocalDevPassword123!`, `Database: scih_db`)

### Step 4: Stopping the Stack
```bash
# Stop containers while preserving database volume
docker-compose stop

# Stop containers and remove volumes (Fresh Reset)
docker-compose down -v
```

---

## 4. Running Standalone (Local Debugging)

For active code editing with hot-reload and IDE breakpoints (Visual Studio / VS Code):

### Option A: Database via Docker + API & Frontend Standalone

1. **Start PostgreSQL Container Only**:
   ```bash
   docker-compose up -d scih-postgres
   ```

2. **Run ASP.NET Core API (.NET CLI)**:
   ```bash
   cd src/api/SCIH.Api
   dotnet run
   # Listening on http://localhost:8080 & https://localhost:7080
   ```

3. **Run .NET Worker Service**:
   ```bash
   cd src/workers/SCIH.Worker
   dotnet run
   ```

4. **Run React Frontend (Vite Dev Server)**:
   ```bash
   cd src/web
   npm install
   npm run dev
   # Vite server listening at http://localhost:3000
   ```

---

## 5. Database Management & Seeding

The PostgreSQL database is initialized automatically with tables, indexes, and sample seed data (`SHP-8921`, `SHP-7740`, `SHP-6512`) upon first launch.

### Re-running Seed Script Manually
```bash
# Connect via psql inside container
docker exec -it scih-postgres psql -U psqladmin -d scih_db -f /docker-entrypoint-initdb.d/seed-database.sql
```

### Inspecting Database Tables
```bash
docker exec -it scih-postgres psql -U psqladmin -d scih_db -c "\dt"
```

---

## 6. Executing Automated Tests

### A. Run .NET Unit Tests
```bash
# From repository root
dotnet test SCIH.sln --configuration Release
```

### B. Run Playwright E2E Browser Tests
```bash
cd tests/e2e
npm install
npx playwright install --with-deps

# Execute headless E2E tests against local environment
npm run test:dev

# View interactive HTML test report
npm run report
```

---

## 7. Comprehensive Troubleshooting Guide

| Symptom / Issue | Potential Cause | Resolution Steps |
| :--- | :--- | :--- |
| **Port Conflict (`Port 3000 / 8080 / 5432 in use`)** | Another local service (IIS, local Postgres, or Node) is binding to the port. | 1. Identify process: `netstat -ano \| findstr :5432` (Windows) or `lsof -i :5432` (macOS/Linux).<br>2. Terminate PID or update port mapping in `docker-compose.yml`. |
| **API fails with `NpgsqlException: Connection Refused`** | PostgreSQL container is still starting up or database name is invalid. | 1. Verify DB status: `docker-compose ps scih-postgres`.<br>2. Check DB logs: `docker-compose logs scih-postgres`.<br>3. Ensure connection string host is `scih-postgres` inside Docker or `localhost` when running `dotnet run` outside Docker. |
| **React API calls return `401 Unauthorized` or CORS error** | Misconfigured API base URL or missing `X-Correlation-ID` header exposure. | 1. Ensure `VITE_API_URL` points to `http://localhost:8080/api`.<br>2. Check browser network tab for preflight OPTIONS status.<br>3. Verify APIM / API CORS allowed origins in `appsettings.Development.json`. |
| **Playwright tests fail with `ERR_CONNECTION_REFUSED`** | Local Docker stack or dev server is not running prior to test run. | 1. Ensure `http://localhost:3000` is accessible before executing `npm run test:dev`.<br>2. Update `DEV_BASE_URL` in `tests/e2e/config/playwright.dev.config.ts`. |
| **Docker build fails: `out of memory` or `Killed`** | Docker Desktop resource allocation is too low. | 1. Open Docker Desktop Settings → Resources.<br>2. Increase Memory allocation to at least **4 GB** and CPU to **4 cores**.<br>3. Run `docker system prune -f` to clean build cache. |
