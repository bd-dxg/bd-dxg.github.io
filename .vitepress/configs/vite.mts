import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'

/** @type {import('vite').UserConfig} */
export default {
  plugins: [groupIconVitePlugin()],
  server: {
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      external: ['gitalk', 'rough-notation'],
      output: {
        globals: {
          gitalk: 'Gitalk',
          'rough-notation': 'RoughNotation',
        },
      },
    },
  },
}
