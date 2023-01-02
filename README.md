# OTEL + React + Keycloak Auth Server

A simple project to send frontend traces to open-telemetry collector and view it on zipkin backend.

## Setup

### Collector and backend

```cd``` into the root and run the following:

```
    docker compose up
```
This spins up the docker containers for the following 
- otel collector (running on port http://localhost:4318/v1/traces)
- zipkin backend and ui http://localhost:9411
- keycloak auth server, if the keycloak auth server fails recreate the container using following
```
    docker compose up -d --force-recreate --no-deps otel-collector
```
And it can be accessed on http://localhost:8080/auth

### Prepare authentication Server
Currently the frontend has a protected route behind keycloak-auth, inorder to view that we need to setup keycloak auth server

- go to http://localhost:8080/auth/admin and login using _admin_ as both username and password.
- create a new realm called _opentelemetry_
- under the realm create a new client called _react-app_ and add root url as the url of the frontend app in our case, http://localhost:3001/.

### Run the frontend
Once both the collector backend and the auth server are ready, now its time to run the frontend. In order run that do the following:

```
npm install
npm run start
```

Frontend can be accessed on http://localhost:3001 and click on login.

Currently, default otel-collector docker service has no auth in place, hence the tracing information can be seen propagating to otel collector and all the way to zipkin backend.

### Run the otel-collector with oidc extension
Inorder to test the auth extension, we need to replace the collector config with _auth-config.yaml_ and recreate the container again

```
docker compose up -d --force-recreate --no-deps otel-collector
```

This will verify the authorization header passed along with the trace information to the collector.

