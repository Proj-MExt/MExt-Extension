import { defineConfig } from "vite";
import iife from "rollup-plugin-iife";
export default defineConfig({
	plugins: [iife()],
	build: {
		minify: false,
		rollupOptions: {
			input: {
				content_script: "src/ContentScript/index.ts",
				core: "src/Core/index.ts"
			},
			output: {
				manualChunks: undefined,
				entryFileNames: "[name].js"
			}
		}
	}
});
