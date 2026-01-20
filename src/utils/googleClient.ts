import { OAuth2Client } from "google-auth-library";

const validateEnv = () => {
  switch (true) {
    case !process.env.GOOGLE_CLIENT_ID:
      throw new Error("GOOGLE_CLIENT_ID Not Found !");

    case !process.env.GOOGLE_CLIENT_SECRET:
      throw new Error("GOOGLE_CLIENT_SECRET Not Found !");

    default:
      return true;
  }
};

export const getGoogleClient = () => {
  validateEnv();

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!;

  return new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri,
  });
};
