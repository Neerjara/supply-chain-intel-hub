# Stage 1: .NET 8 SDK Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS builder
WORKDIR /src

COPY ["SCIH.Api/SCIH.Api.csproj", "SCIH.Api/"]
COPY ["SCIH.Application/SCIH.Application.csproj", "SCIH.Application/"]
COPY ["SCIH.Domain/SCIH.Domain.csproj", "SCIH.Domain/"]
COPY ["SCIH.Infrastructure/SCIH.Infrastructure.csproj", "SCIH.Infrastructure/"]

RUN dotnet restore "SCIH.Api/SCIH.Api.csproj"
COPY . .

WORKDIR "/src/SCIH.Api"
RUN dotnet publish "SCIH.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: ASP.NET Core 8 Alpine Runtime (~110MB)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runner
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Security Hardening: Run as non-root user
USER $APP_UID

COPY --from=builder /app/publish .

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "SCIH.Api.dll"]
