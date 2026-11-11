import { createAuthClient } from "@neon/neon-js/auth";

export const authClient = createAuthClient(
  import.meta.env.VITE_NEON_AUTH_URL as string,
);
