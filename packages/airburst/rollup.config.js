import typescript from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';
import copy from 'rollup-plugin-copy'

export default {
    input: './src/server/app.ts',
    output: {
        file: './lib/airburst.min.js',
        sourcemap: true,
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
        sourcemaps(),
        copy({
            targets: [
                {src: "config/*.json", dest: "lib/config"}
            ]
        })
    ]
}