import { resolve } from 'path'

export default {
  root: resolve(__dirname, 'src'),
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        calc: resolve(__dirname, 'src/calc.html')
      }
    }
  },
  server: {
    port: 9309,
    host: true
  },
}