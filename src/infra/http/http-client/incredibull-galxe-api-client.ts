import axios from "axios";
import { env } from "../../env";

export const incredbullGalxeApiClient = axios.create({
  baseURL: env.INCREDBULL_GALXE_API_BASE_URL,
});