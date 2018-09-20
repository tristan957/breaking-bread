# bb-server

## Development

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

Adminer instance will be running on localhost:10261, and the PostgreSQL
instance will be using a connection URI of
`postgresql://jesus:christ@localhost:10260`.
