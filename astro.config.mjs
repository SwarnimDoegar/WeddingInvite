import { defineConfig } from "astro/config";

export default defineConfig({
  // Served at the root of its own subdomain, so there's no project-page
  // subpath any more — the base is "/" in both dev and prod.
  site: "https://invite.swasthika.online",
});
