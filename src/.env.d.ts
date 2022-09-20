/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_CORE_VERSION_STR: string;
	readonly VITE_CORE_VERSION: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
