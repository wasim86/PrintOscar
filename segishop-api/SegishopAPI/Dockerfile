FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore
COPY SegishopAPI/SegishopAPI.csproj SegishopAPI/
RUN dotnet restore SegishopAPI/SegishopAPI.csproj

# Build
COPY SegishopAPI/ ./SegishopAPI/
RUN dotnet publish SegishopAPI/SegishopAPI.csproj -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY --from=build /src/SegishopAPI/uploads /app/seed-uploads
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "SegishopAPI.dll"]
