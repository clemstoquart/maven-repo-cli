module.exports = {
    ignorePatterns: ['/*', '!/src'],
    parser:  '@typescript-eslint/parser',
    env: {
        'node': true,
        'es6': true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
    ],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: true
    },
    rules: {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-console': 0
    }
};
