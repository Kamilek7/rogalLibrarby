import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
		port : 5174,
		cors: {
			origin: ['http://librarby.rogalrogalrogalrogal.online', 'http://localhost:5174'],
			methods: ['GET', 'POST'],
			allowedHeaders: ['Content-Type']
		},
		allowedHosts: ['rogalrogalrogalrogal.online', 'librarby.rogalrogalrogalrogal.online'] //added this
	}
})
