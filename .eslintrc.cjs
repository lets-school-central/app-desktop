module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"xo",
		"plugin:react/recommended",
		"plugin:import/errors",
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: [
				".eslintrc.{js,cjs}",
			],
			parserOptions: {
				sourceType: "script",
			},
		},
		{
			env: {
				node: true,
			},
			files: [
				"*.config.{js,ts}",
			],
			parserOptions: {
				sourceType: "module",
			},
		},
		{
			extends: [
				"xo-typescript",
				"plugin:react/jsx-runtime",
				"plugin:import/typescript",
			],
			plugins: [
				"react",
			],
			files: [
				"*.ts",
				"*.tsx",
			],
			rules: {
				"react/react-in-jsx-scope": "off",
				"jsx-quotes": ["error", "prefer-double"],
				"@typescript-eslint/quotes": ["error", "double"],
				"object-curly-spacing": ["error", "always"],
				"@typescript-eslint/object-curly-spacing": ["error", "always"],
				"@typescript-eslint/semi": ["error", "always"],
				"@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports", fixStyle: "separate-type-imports" }],
				"react/prop-types": "off",
				"@typescript-eslint/naming-convention": [
					"error",
					{
						selector: "typeLike",
						format: ["PascalCase"],
					},
				],
			},
			settings: {
				"import/resolver": {
					typescript: {
						alwaysTryTypes: true,
						project: "./tsconfig.json",
					},
				},
				"import/parsers": {
					"@typescript-eslint/parser": [".ts", ".tsx"],
				},
				"import/extensions": [
					".ts",
					".tsx",
				],
			},
		},
	],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	plugins: [
		"import",
	],
	rules: {
		quotes: ["error", "double"],
		"object-curly-spacing": ["error", "always"],
		"sort-imports": ["error", {
			ignoreCase: true,
			ignoreDeclarationSort: true,
			ignoreMemberSort: false,
			memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
		}],
		"import/order": ["error", {
			"newlines-between": "always",
			alphabetize: {
				order: "asc",
				caseInsensitive: true,
			},
			groups: [
				["builtin", "external"],
				"internal",
				["parent", "sibling", "index"],
				"type",
			],
			pathGroups: [
				{
					pattern: "react",
					group: "builtin",
					position: "before",
				},
				{
					pattern: "$/**",
					group: "internal",
					position: "after",
				},
			],
			pathGroupsExcludedImportTypes: ["react"],
		}],
		"import/no-anonymous-default-export": ["error", {
			allowArray: false,
			allowArrowFunction: false,
			allowAnonymousClass: false,
			allowAnonymousFunction: false,
			allowCallExpression: true,
			allowLiteral: false,
			allowObject: false,
		}],
	},
};
