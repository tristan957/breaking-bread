# bb-server

## Development

### Environment Variables

```bash
# contents of .env

NODE_ENV=DEVELOPMENT
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=localhost
TYPEORM_PORT=10260
TYPEORM_USERNAME=jesus
TYPEORM_PASSWORD=christ
TYPEORM_DATABASE=BreakingBread
TYPEORM_SYNCHRONIZE=true
APP_PORT=10262
```

### Docker

bb-server uses Docker for local devlopment. Within the `docker-compose.yml`,
you'll see a PostgreSQL instance as well as Adminer to view said instance.

To bring those up:

```text
docker-compose up -d
```

To bring those down:

```text
docker-compose down -d
```

Adminer instance will be running on `localhost:10261`, and the PostgreSQL
instance will be using a connection URI of
`postgresql://jesus:christ@localhost:10260`.
