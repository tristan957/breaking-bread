import { Auth0Config } from "./Auth0Config";
export const AUTH_CONFIG: Auth0Config = {
  audience: "https://bbread.com/graphql-test",
  domain: "bbread.auth0.com",
  clientId: "5Km8K7jPRTeT260MGPtJSOzPb5tgqKYY",
  callbackUrl: "http://localhost:3000/callback",

  // Jonathan's credential
  // domain: "breaking-bread.auth0.com",
  // clientId: "LOR0UoeJyEQQQH17KtIMI0e3HK5F23d3",
  // callbackUrl: "http://localhost:3000/callback",
};