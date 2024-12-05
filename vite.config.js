// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api/email": {
				target: "http://localhost:3001",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/email/, ""),
			},
			"/api/markdown": {
				target: "http://localhost:3002",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/markdown/, ""),
			},
			"/api/crud": {
				target: "http://localhost:3003",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/crud/, ""),
			},
			"/api/analytics": {
				target: "http://localhost:3004",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/analytics/, ""),
			},
		},
	},
});

