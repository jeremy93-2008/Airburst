import typescript from 'rollup-plugin-typescript2';
import json from "@rollup/plugin-json";
export default {
    input: './src/server/server.ts',
    output: {
        file: './lib/airburst.min.js',
        format: 'cjs',
        name: 'airburst'
    },
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    module: "ESNext"
                }
            }
        }),
        json()
    ]
}