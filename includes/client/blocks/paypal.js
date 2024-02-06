/**
 * External dependencies
 */
import { registerPaymentMethod } from '@woocommerce/blocks-registry';

/**
 * Internal dependencies
 */
import braintreePayPalPaymentMethod from './paypal/index';

// Register Braintree PayPal payment method.
registerPaymentMethod(braintreePayPalPaymentMethod);
