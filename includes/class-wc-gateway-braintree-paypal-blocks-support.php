<?php
/**
 * Braintree PayPal Cart and Checkout Blocks Support
 *
 * @package WC-Braintree/Gateway/Blocks-Support
 */

/**
 * Braintree PayPal payment method Blocks integration
 *
 * @since 3.0.0
 */
final class WC_Gateway_Braintree_PayPal_Blocks_Support extends WC_Gateway_Braintree_Blocks_Support {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->name       = 'braintree_paypal';
		$this->asset_path = WC_Braintree::instance()->get_plugin_path() . '/assets/js/blocks/paypal.asset.php';
		$this->script_url = WC_Braintree::instance()->get_plugin_url() . '/assets/js/blocks/paypal.js';
	}

	/**
	 * Initializes the payment method.
	 */
	public function initialize() {
		parent::initialize();
		add_action(
			'woocommerce_blocks_enqueue_checkout_block_scripts_before',
			function() {
				add_filter( 'woocommerce_saved_payment_methods_list', array( $this, 'add_braintree_paypal_saved_payment_methods' ), 10, 2 );
			}
		);
		add_action(
			'woocommerce_blocks_enqueue_checkout_block_scripts_after',
			function () {
				remove_filter( 'woocommerce_saved_payment_methods_list', array( $this, 'add_braintree_paypal_saved_payment_methods' ), 10, 2 );
			}
		);
	}

	/**
	 * Returns an array of key=>value pairs of data made available to the payment methods script.
	 *
	 * @return array
	 */
	public function get_payment_method_data() {
		$params           = array();
		$payment_gateways = WC()->payment_gateways->payment_gateways();
		$gateway          = $payment_gateways[ $this->name ];
		$payment_form     = $this->get_payment_form_instance();
		if ( $payment_form ) {
			$params = $payment_form->get_payment_form_handler_js_params();
		}

		return array_merge(
			parent::get_payment_method_data(),
			$params,
			array(
				'logo_url'                => 'https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png',
				'client_token_nonce'      => wp_create_nonce( 'wc_' . $this->name . '_get_client_token' ),
				'paypal_locale'           => $gateway->get_safe_locale(),
				'button_width'            => $gateway->get_button_width( $gateway->get_button_size() ),
				'debug'                   => $gateway->debug_log(),
				'messaging_logo_type'     => $gateway->get_pay_later_messaging_logo_type(),
				'messaging_logo_position' => $gateway->get_pay_later_messaging_logo_postion(),
				'messaging_text_color'    => $gateway->get_pay_later_messaging_text_color(),
			),
		);
	}

	/**
	 * Manually add braintree save tokens to the saved payment methods list.
	 *
	 * @param array $saved_methods The saved payment methods.
	 * @param int   $customer_id The customer ID.
	 * @return array $saved_methods Modified saved payment methods.
	 */
	public function add_braintree_paypal_saved_payment_methods( $saved_methods, $customer_id ) {
		$payment_gateways = WC()->payment_gateways->payment_gateways();
		$tokens           = $payment_gateways[ $this->name ]->get_payment_tokens_handler()->get_tokens( $customer_id );

		if ( ! $tokens ) {
			$tokens = array();
		}
		$saved_tokens = array();

		foreach ( $tokens as $token ) {
			$saved_tokens[] = array(
				'method'     => array(
					'gateway' => 'braintree_paypal',
					'last4'   => $token->get_payer_email(),
					'brand'   => __( 'PayPal Account', 'woocommerce-gateway-paypal-powered-by-braintree' ),
				),
				'expires'    => '',
				'is_default' => $token->is_default(),
				'actions'    => array(),
				'tokenId'    => $token->get_id(),
			);
		}

		if ( ! empty( $saved_tokens ) ) {
			$saved_methods['braintree_paypal'] = $saved_tokens;
		}

		return $saved_methods;
	}
}
