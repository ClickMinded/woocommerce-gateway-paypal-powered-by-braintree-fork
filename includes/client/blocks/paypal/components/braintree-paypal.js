/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { PAYMENT_METHOD_ID } from '../constants';
import { PayPalButtons } from './paypal-buttons';
import { PayPalPayLaterMessaging } from './pay-later-messaging';
import { PayPalDescription } from './description';
import { usePaymentForm } from '../use-payment-form';
import { CheckoutHandler } from '../checkout-handler';

/**
 * Renders the Braintree PayPal Button and PayLater Messaging.
 *
 * @param {Object} props Incoming props
 *
 * @return {JSX.Element} The Braintree PayPal saved token component.
 */
export const BraintreePayPal = (props) => {
	const [errorMessage, setErrorMessage] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const {
		eventRegistration,
		emitResponse,
		activePaymentMethod,
		components: { LoadingMask },
		billing,
		onSubmit,
		shouldSavePayment,
		token,
	} = props;

	const paymentForm = usePaymentForm({
		billing,
		onSubmit,
		shouldSavePayment,
		token,
	});
	const { loadPayPalSDK, testAmount, setTestAmount, amount } = paymentForm;

	// Disable the place order button when PayPal is active. TODO: find a better way to do this.
	useEffect(() => {
		const button = document.querySelector(
			'button.wc-block-components-checkout-place-order-button'
		);
		if (button) {
			if (activePaymentMethod === PAYMENT_METHOD_ID) {
				button.setAttribute('disabled', 'disabled');
			}
			return () => {
				button.removeAttribute('disabled');
			};
		}
	}, [activePaymentMethod]);

	return (
		<>
			<PayPalDescription
				testAmount={testAmount}
				setTestAmount={setTestAmount}
			/>
			{errorMessage && (
				<div className="woocommerce-error">{errorMessage}</div>
			)}
			{!errorMessage && (
				<LoadingMask isLoading={!isLoaded} showSpinner={true}>
					{isLoaded && <PayPalPayLaterMessaging amount={amount} />}
					<PayPalButtons
						loadPayPalSDK={loadPayPalSDK}
						onError={setErrorMessage}
						buttonLoaded={setIsLoaded}
					/>
				</LoadingMask>
			)}
			<CheckoutHandler
				checkoutFormHandler={paymentForm}
				eventRegistration={eventRegistration}
				emitResponse={emitResponse}
			/>
		</>
	);
};
