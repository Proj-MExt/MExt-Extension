import { defineConfig, UserConfig } from "vite";
import ViteRenamePlugin from "./plugins/ViteRename";

export default defineConfig((env) => {
	if (env.mode == "content") {
		return {
			publicDir: false,
			build: {
				emptyOutDir: true,
				minify: false,
				rollupOptions: {
					input: {
						"content-script": "src/content/index.ts"
					},
					output: {
						entryFileNames: "[name].js",
						format: "iife"
					}
				}
			}
		} as UserConfig;
	} else if (env.mode == "popup") {
		return {
			plugins: [
				ViteRenamePlugin({
					"src/popup/index.html": "popup.html"
				})
			],
			publicDir: false,
			build: {
				emptyOutDir: false,
				minify: false,
				rollupOptions: {
					input: {
						popup: "src/popup/index.html"
					},
					output: {
						assetFileNames: "assets/popup/[name].[ext]",
						entryFileNames: "assets/popup/[name].js"
					}
				}
			}
		} as UserConfig;
	} else if (env.mode == "inject") {
		return {
			build: {
				emptyOutDir: false,
				minify: false,
				rollupOptions: {
					input: {
						inject: "src/inject/index.ts"
					},
					output: {
						entryFileNames: "[name].js",
						format: "iife"
					}
				}
			}
		} as UserConfig;
	}
	throw Error("Unknown mode: " + env.mode);
});
