import {defineConfig} from "vite";

export default defineConfig((env) => {
	const input: any = env.mode == "content" ? {
		content_script: "src/Content/index.ts"
	} : {
		inject: "src/Inject/index.ts"
	};
	return {
		publicDir: env.mode == "inject" ? undefined : false,
		build: {
			emptyOutDir: env.mode == "content",
			minify: false,
			rollupOptions: {
				input,
				output: {
					entryFileNames: "[name].js",
					format: "iife"
				}
			}
		}
	};
});
