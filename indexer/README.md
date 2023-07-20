## Run the project

To run the project the easy way is to use docker compose.

The .env is preconfigured however you need to provide ```INFURA_API_KEY```

You can build the docker-compose with this command:

```
npm run docker:build
```

The build will setup 4 bricks:

- 2 postgres servers, one for test and one for dev server
- 1 project for dev server
- 1 project for test

Run the dev server with this command:

```
npm run docker:up:dev
```

Run the tests with this command:

```
npm run docker:up:test
```

When the dev server is up, the database can be accessed with:
```
Ip:localhost
Port:5433
DbName:dev
username:root
password:root
```