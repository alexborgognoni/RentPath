import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import typescript from 'typescript-eslint';

/** @type ***REMOVED***import('eslint').Linter.Config[]***REMOVED*** */
export default [
    js.configs.recommended,
    ...typescript.configs.recommended,
    ***REMOVED***
        ...react.configs.flat.recommended,
        ...react.configs.flat['jsx-runtime'], // Required for React 17+
        languageOptions: ***REMOVED***
            globals: ***REMOVED***
                ...globals.browser,
        ***REMOVED***,
    ***REMOVED***,
        rules: ***REMOVED***
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',
    ***REMOVED***,
        settings: ***REMOVED***
            react: ***REMOVED***
                version: 'detect',
        ***REMOVED***,
    ***REMOVED***,
***REMOVED***,
    ***REMOVED***
        plugins: ***REMOVED***
            'react-hooks': reactHooks,
    ***REMOVED***,
        rules: ***REMOVED***
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
    ***REMOVED***,
***REMOVED***,
    ***REMOVED***
        ignores: ['vendor', 'node_modules', 'public', 'bootstrap/ssr', 'tailwind.config.js'],
***REMOVED***,
    prettier, // Turn off all rules that might conflict with Prettier
];
