import { groupIconVitePlugin } from "vitepress-plugin-group-icons";

/** @type {import('vite').UserConfig} */
export default {
  plugins: [groupIconVitePlugin()],
  server: {
    host: "0.0.0.0",
  },
};
