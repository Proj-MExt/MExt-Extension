import { defineConfig } from "vite";
import iife from "rollup-plugin-iife";

export default defineConfig({
	plugins: [iife()],
	build: {
		minify: false,
		rollupOptions: {
			input: {
				content_script: "src/Content/index.ts",
				inject: "src/Inject/index.ts"
			},
			output: {
				manualChunks: undefined,
				entryFileNames: "[name].js"
			}
		}
	}
});
