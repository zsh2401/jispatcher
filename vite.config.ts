import { defineConfig } from "vite"
import { resolve } from "path"
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src", "index.ts"),
            name: "jispatcher",
            fileName: "jispatcher",
            formats: ["umd"],
        },
        target: "es2015",
        sourcemap: true,
        minify: false
    }
})