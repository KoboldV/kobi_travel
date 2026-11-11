import { authClient } from "../auth";

export async function apiFetch(path: string, init: RequestInit = {}) {
  const { data, error } = await authClient.getSession();
  const token = data?.session?.token;
  if (error || !token) throw new Error("Not authenticated");

  return fetch(path, {
    ...init,
    headers: {
      ...init.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
