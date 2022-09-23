import { loadScript } from "./loader";
import {runtime} from "webextension-polyfill";

loadScript(runtime.getURL("core.js"));
