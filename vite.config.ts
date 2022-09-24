import {defineConfig} from "vite";

export default defineConfig((env) => {
	const stage = {
		content: {
			input: {
				content_script: "src/Content/index.ts"
			},
			clean: true,
			copy: false
		},
		popup: {
			input: {},
			clean: false,
			copy: false
		},
		inject: {
			input: {
				inject: "src/Inject/index.ts"
			},
			clean: false,
			copy: undefined
		}
	} as any;
	const curr = stage[env.mode];
	return {
		publicDir: curr.copy,
		build: {
			emptyOutDir: curr.clean,
			minify: false,
			rollupOptions: {
				input: curr.input,
				output: {
					entryFileNames: "[name].js",
					format: "iife"
				}
			}
		}
	};
});
