import { Auth0Config } from "./Auth0Config";
export const AUTH_CONFIG: Auth0Config = {
  audience: "https://www.partin.io/bread/api/v1/graphql",
  domain: "bbread.auth0.com",
  clientId: "5Km8K7jPRTeT260MGPtJSOzPb5tgqKYY",
  callbackUrl: "https://partin.io/bb-auth",

  // Jonathan's credential
  // domain: "breaking-bread.auth0.com",
  // clientId: "LOR0UoeJyEQQQH17KtIMI0e3HK5F23d3",
  // callbackUrl: "http://localhost:3000/callback",
};
