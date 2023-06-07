const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const DependencyExtractionWebpackPlugin = require('@woocommerce/dependency-extraction-webpack-plugin');
const path = require('path');

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins.filter(
			(plugin) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin(),
	],
	entry: {
		paypal: path.resolve(process.cwd(), 'client/blocks', 'paypal.js'),
		'credit-card': path.resolve(
			process.cwd(),
			'client/blocks',
			'credit-card.js'
		),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve(process.cwd(), 'assets/js/blocks'),
	},
};
