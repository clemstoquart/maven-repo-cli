module.exports = {
    parser:  '@typescript-eslint/parser',
    env: {
        "node": true,
        "es6": true
    },
    extends: 'plugin:@typescript-eslint/recommended',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": 0
    }
};
