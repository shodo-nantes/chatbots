/* eslint-env node */
module.exports = {
    env: {
        node: true,
        'jest/globals': true,
    },
    ignorePatterns: ['node_modules', 'dist', 'coverage', 'jest.config.js'],
    extends: [
        'eslint:recommended',
        'plugin:github/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:sonarjs/recommended',
        'plugin:unicorn/recommended',
        'prettier',
    ],
    plugins: ['github', 'prettier', 'sonarjs'],
    overrides: [
        {
            files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
            plugins: ['jest'],
            extends: ['plugin:jest/recommended'],
            globals: {
                __dirname: true,
            },
            rules: {
                'unicorn/prefer-module': 'off', // To be able to use __dirname
            },
        },
    ],
    rules: {
        // OFF
        'import/no-commonjs': 'off',
        'unicorn/prefer-module': 'off',
        'i18n-text/no-en': 'off',
        'filenames/match-regex': 'off', // handled by unicorn/filename-case
        'import/named': 'off', // doesn't work well
        'import/no-deprecated': 'off', // takes too long
        'import/default': 'off', // takes too long
        'import/no-unresolved': 'off', // module bundle is vite
        'import/no-named-as-default-member': 'off', // takes too long
        'import/no-namespace': 'off', // enable namespaces
        // ERRORS
        'import/extensions': [
            'error',
            'never',
            {
                json: 'always',
                css: 'always',
                scss: 'always',
                svg: 'always',
                png: 'always',
                jpg: 'always',
                jpeg: 'always',
                gif: 'always',
                webp: 'always',
            },
        ],
        'import/no-anonymous-default-export': ['error', { allowNew: true }],
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        'prettier/prettier': 'error',
        'unicorn/filename-case': [
            'error',
            {
                cases: {
                    camelCase: true,
                    pascalCase: true,
                },
                ignore: ['^[A-Za-z0-9]+\\.[A-Za-z0-9]+$'], // To allow syntax like TripDAO.ts
            },
        ],
        'unicorn/no-null': 'off', // To allow null values, need for some libs
        'unicorn/prefer-node-protocol': 'off', // Not really useful and some errors when using it with path like 'constants/paths.ts'
    },
};
