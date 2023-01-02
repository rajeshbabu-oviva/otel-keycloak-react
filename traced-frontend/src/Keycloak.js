import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
  url: "http://localhost:8080/auth",
  realm: "opentelemetry",
  clientId: "react-app",
});

export default keycloak;
