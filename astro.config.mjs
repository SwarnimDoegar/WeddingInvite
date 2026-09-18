import { defineConfig } from "astro/config";

const isProdBuild = process.env.NODE_ENV === "production";

export default defineConfig({
  site: "https://swarnimdoegar.github.io",
  base: isProdBuild ? "/WeddingInvite" : "/",
});
