import axios from "axios";
import { env } from "../../env";

export const captchaApiClient = axios.create({
  baseURL: env.CAPTCHA_API_BASE_URL,
});