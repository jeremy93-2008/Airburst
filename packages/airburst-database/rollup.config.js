import typescript from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
    input: './src/index.ts',
    output: {
        file: './lib/airburst-database.min.js',
        format: 'es',
        sourcemap: true,
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
        sourcemaps()
    ]
}