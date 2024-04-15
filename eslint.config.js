import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname
            },
        }
    },
    {
        rules: {
            indent: [
                'error',
                4
            ],
            'linebreak-style': [
                'error',
                'unix'
            ],
            quotes: [
                'error',
                'single'
            ],
            semi: [
                'error',
                'always'
            ],
            'no-console': 0
        }
    }
];
