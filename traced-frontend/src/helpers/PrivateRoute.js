import { useKeycloak } from "@react-keycloak/web";

const PrivateRoute = ({ children }) => {
  const { keycloak } = useKeycloak();

  const isLoggedIn = keycloak.authenticated;
  if (isLoggedIn) {
    window.accessToken = keycloak.token;

    console.log("the current access-token is ", window.accessToken);
  }

  return isLoggedIn ? children : null;
};

export default PrivateRoute;
