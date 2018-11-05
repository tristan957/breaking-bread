import { Auth0Config } from "./Auth0Config";
export const AUTH_CONFIG: Auth0Config = {
  audience: "https://bbread.com/graphql-test",
  domain: "bbread.auth0.com",
  clientId: "wqo2XUL66yVQbN2sGxu6y4guj1U21zLh",
  callbackUrl: "http://localhost:3000/callback",

  // Jonathan's credential
  // domain: "breaking-bread.auth0.com",
  // clientId: "LOR0UoeJyEQQQH17KtIMI0e3HK5F23d3",
  // callbackUrl: "http://localhost:3000/callback",
};
