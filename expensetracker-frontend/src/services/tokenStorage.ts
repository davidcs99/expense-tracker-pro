const ID_TOKEN_KEY = "id_token";

export function saveIdToken(token: string) {
  localStorage.setItem(ID_TOKEN_KEY, token);
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ID_TOKEN_KEY);
}
