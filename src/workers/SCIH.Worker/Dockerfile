# Stage 1: .NET 8 SDK Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS builder
WORKDIR /src

COPY ["SCIH.Worker/SCIH.Worker.csproj", "SCIH.Worker/"]
RUN dotnet restore "SCIH.Worker/SCIH.Worker.csproj"
COPY . .

WORKDIR "/src/SCIH.Worker"
RUN dotnet publish "SCIH.Worker.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: .NET 8 Runtime Alpine (~90MB)
FROM mcr.microsoft.com/dotnet/runtime:8.0-alpine AS runner
WORKDIR /app

# Security Hardening: Run as non-root user
USER $APP_UID

COPY --from=builder /app/publish .

ENTRYPOINT ["dotnet", "SCIH.Worker.dll"]
