/**
 * External dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { PayPalButtons } from './paypal-buttons';
import { PayPalPayLaterMessaging } from './pay-later-messaging';
import { usePaymentForm } from '../use-payment-form';

/**
 * Renders the Braintree PayPal Button and PayLater Messaging.
 *
 * @param {Object} props Incoming props
 *
 * @return {JSX.Element} The Braintree PayPal saved token component.
 */
export const BraintreePayPalExpress = (props) => {
	const [errorMessage, setErrorMessage] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const {
		components: { LoadingMask },
		billing,
		onSubmit,
		shouldSavePayment,
		token,
		shippingData,
	} = props;

	const paymentForm = usePaymentForm({
		billing,
		onSubmit,
		shouldSavePayment,
		token,
		isExpress: true,
		needsShipping: shippingData.needsShipping,
	});
	const { loadPayPalSDK, amount } = paymentForm;

	return (
		<>
			{errorMessage && (
				<div className="woocommerce-error">{errorMessage}</div>
			)}
			{!errorMessage && (
				<LoadingMask isLoading={!isLoaded}>
					{isLoaded && <PayPalPayLaterMessaging amount={amount} />}
					<PayPalButtons
						loadPayPalSDK={loadPayPalSDK}
						onError={setErrorMessage}
						buttonLoaded={setIsLoaded}
					/>
				</LoadingMask>
			)}
		</>
	);
};
