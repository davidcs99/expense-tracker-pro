import { watch } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { saveIdToken, clearTokens } from "@/services/tokenStorage";

let initialized = false;

export function useAuthSession() {
  const auth0 = useAuth0();

  if (initialized) {
    return auth0;
  }

  const syncSession = async () => {
    if (!auth0.isAuthenticated.value) {
      clearTokens();
      return;
    }

    try {
      const { id_token } = await auth0.getAccessTokenSilently({ detailedResponse: true });
      saveIdToken(id_token);
    } catch (error) {
      console.error("No se pudo sincronizar la sesión con Auth0.", error);
      clearTokens();
    }
  };

  watch(
    auth0.isAuthenticated,
    () => {
      void syncSession();
    },
    { immediate: true }
  );

  initialized = true;
  return auth0;
}
