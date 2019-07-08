module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es6": true,
        "mocha": true,
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "semi": ["error", "never"],
        "quotes": ["error", "single"],
        "indent": ["error","tab"],
        "linebreak-style": ["error","unix"],
    }
};
