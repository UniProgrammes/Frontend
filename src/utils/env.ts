export const isProd = import.meta.env.VITE_ENV === "production";

export const isDev = !isProd;
