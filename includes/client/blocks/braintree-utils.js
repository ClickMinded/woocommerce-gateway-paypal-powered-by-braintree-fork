/**
 * Get the client token from the server.
 *
 * @param {string} ajaxUrl         The AJAX URL.
 * @param {string} paymentMethodId The payment method ID.
 * @param {string} nonce           The ajax nonce to verify at server side.
 */
export const getClientToken = (ajaxUrl, paymentMethodId, nonce) => {
	const formData = new FormData();
	formData.append('action', `wc_${paymentMethodId}_get_client_token`);
	formData.append('nonce', nonce);

	return fetch(ajaxUrl, {
		method: 'POST',
		body: formData,
	})
		.then((response) => response.json())
		.then((res) => {
			if (res && !res.success) {
				const message = (res.data && res.data.message) || '';
				throw new Error(
					`Could not retrieve the client token via AJAX: ${message}`
				);
			}
			if (res && res.success && res.data) {
				return res.data;
			}
		});
};
