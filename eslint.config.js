// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
	{
		ignores: ['**/*/svg.config.g.ts', 'node_modules', 'dist'],
	},
	{
		files: ['**/*.html'],
		extends: [
			...angular.configs.templateRecommended,
		],
		rules: {
			"@angular-eslint/template/prefer-control-flow": ["error"],
		}
	},
	{
		files: ['**/*.ts'],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.stylistic,
			...angular.configs.tsRecommended,
		],
		processor: angular.processInlineTemplates,
		rules: {
			"@angular-eslint/prefer-on-push-component-change-detection": ["error"],
		}
	}
);
