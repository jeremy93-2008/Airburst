import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy'

export default {
    input: './src/server/app.ts',
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
        copy({
            targets: [
                {src: "config/*.json", dest: "lib/config"}
            ]
        })
    ]
}