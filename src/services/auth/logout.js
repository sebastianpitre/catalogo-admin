import { fetchData } from "@/services/api.js";

export const logoutUser = async (refreshToken) => {
  return fetchData("POST", "/auth/logout/", { refresh_token: refreshToken });
};
