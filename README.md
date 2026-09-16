# Supply Chain Intelligence Hub (SCIH)

Enterprise platform for real-time supply chain monitoring, predictive logistics analytics, and inventory automation.

## 🚀 Quick Start (Local Setup)

```bash
# 1. Clone repository
git clone https://github.com/org/supply-chain-intel-hub.git
cd supply-chain-intel-hub

# 2. Build and start local multi-container test stack
docker-compose up -d --build
```

### Endpoints
- **React Frontend**: [`http://localhost:3000`](http://localhost:3000)
- **API Swagger UI**: [`http://localhost:8080/swagger`](http://localhost:8080/swagger)
- **API Health Check**: [`http://localhost:8080/health`](http://localhost:8080/health)

---

## 📚 Complete Guides & Documentation

- [**Developer Setup & Operations Guide**](docs/developer-guide.md): Complete installation, local build, standalone debugging, and troubleshooting guide.
- [**Azure Monitoring Guide**](docs/azure-monitoring-guide.md): KQL diagnostic queries, operational metrics, and alert severity SLAs.
- [**SonarQube Quality Gate Specification**](docs/sonarqube-quality-gate.md): 80%+ line coverage requirements and security governance rules.
- [**Repository Design Specification**](docs/architecture/repository_design.md): Enterprise folder structure, branching, tagging, and environment strategies.

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Material UI + Vite
- **Backend API**: ASP.NET Core 8 Web API + Entity Framework Core 8
- **Worker Service**: .NET 8 Background Service
- **Database**: PostgreSQL 16 Flexible Server
- **Infrastructure**: Terraform 1.7+ (Azure Container Apps, APIM, Key Vault, VNet)
- **Observability**: Serilog + Azure Application Insights + Log Analytics
- **Testing**: Playwright E2E + Coverlet / Vitest Unit Testing
