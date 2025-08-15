import {fetchData} from "@/services/api.js"

export const refreshToken = async (data) => {
    return fetchData("POST", "/token/refresh/", data);
  };
  