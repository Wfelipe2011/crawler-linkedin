module.exports = {
	root: true,
	env: {
		node: true,
	},
	plugins: ['@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:import/errors',
		'plugin:import/warnings',
	],
	parserOptions: {
		ecmaVersion: 2020,
		project: './tsconfig.json',
	},
	rules: {
		'no-console':
			process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger':
			process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		semi: ['error', 'always', { omitLastInOneLineBlock: true }],
		'no-extra-semi': 'error',
		'import/order': [
			'error',
			{
				pathGroups: [
					{
						pattern: '~/**',
						group: 'external',
						position: 'after',
					},
				],
				groups: [
					'builtin',
					'external',
					'internal',
					'unknown',
					'parent',
					'sibling',
					'index',
					'object',
					'type',
				],
			},
		],
		'import/no-unresolved': ['error', { ignore: ['^@/'] }],
		quotes: ['error', 'single', { allowTemplateLiterals: true }],
		'@typescript-eslint/array-type': ['error', { default: 'array' }],
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					any: "Don't use any because it is unsafe",
				},
				extendDefaults: true,
			},
		],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-function-return-type': [
			'error',
			{ allowExpressions: true },
		],
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'variable',
				format: ['camelCase', 'UPPER_CASE'],
			},
			{
				selector: 'function',
				format: ['camelCase'],
			},
			{
				selector: 'class',
				format: ['PascalCase'],
			},
			{
				selector: 'interface',
				format: ['PascalCase'],
			},
		],
		'@typescript-eslint/promise-function-async': 'error',
	},
};
