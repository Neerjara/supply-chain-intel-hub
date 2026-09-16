# SonarQube Enterprise Quality Gate & Security Governance Specification

This document defines the automated **Quality Gate Standards**, **Coverage Thresholds**, **Security Vulnerability Rules**, and **GitHub Actions Integration** for the **Supply Chain Intelligence Hub (SCIH)**.

---

## 1. Quality Gate Pass/Fail Criteria

All Pull Requests (PRs) targeting `main` must pass the **SCIH Enterprise Quality Gate**. A failed Quality Gate automatically blocks PR merging.

| Metric | Threshold / Target | Scope | Action on Failure |
| :--- | :--- | :--- | :--- |
| **Line Code Coverage** | **>= 80.0%** | New Code | Block PR Merge |
| **Security Vulnerabilities** | **0 (Zero)** | New & Overall Code | Block PR Merge (Immediate Fix) |
| **Security Hotspots** | **100% Reviewed** | New Code | Block PR Merge (Security Sign-off) |
| **Bugs (Reliability Rating)** | **0 Bugs (Rating A)** | New Code | Block PR Merge |
| **Code Smells (Maintainability)** | **Rating A** (Debt Ratio < 5%) | New Code | Block PR Merge |
| **Duplicated Lines** | **< 3.0%** | New Code | Warning / Requires Refactoring |

---

## 2. Code Coverage Reporting & Tools

### .NET API & Worker Service
- **Collector**: `coverlet.collector` producing OpenCover XML format (`coverage.opencover.xml`).
- **Command**: `dotnet test --collect:"XPlat Code Coverage"`
- **Sonar Property**: `sonar.cs.opencover.reportsPaths=**/coverage.opencover.xml`

### React Frontend
- **Collector**: Vitest / Istanbul producing LCOV format (`coverage/lcov.info`).
- **Command**: `npm run test -- --coverage`
- **Sonar Property**: `sonar.typescript.lcov.reportPaths=coverage/lcov.info`

---

## 3. Exclusion Rules

The following file patterns are explicitly excluded from code coverage metrics to avoid skewing test ratios:

- **Entity Framework Core Migrations**: `**/Migrations/**`
- **Application Bootstrappers**: `**/Program.cs`, `src/web/src/main.tsx`
- **Auto-generated Code & Typings**: `**/*.d.ts`, `**/*.g.cs`
- **Build Artifacts & Dependencies**: `**/node_modules/**`, `**/dist/**`, `**/bin/**`, `**/obj/**`

---

## 4. Remediation SLAs for Security Findings

| Severity | Definition | Remediation SLA |
| :--- | :--- | :--- |
| **Blocker / Critical** | SQL Injection, Hardcoded Secrets, Remote Code Execution | **< 24 Hours** |
| **Major** | OWASP Top 10 breaches, Broken Auth, Insecure Deserialization | **< 3 Business Days** |
| **Minor / Info** | Code Smells, Naming Conventions, Minor Duplications | Next Sprint Backlog |
