<?php
/**
 * WooCommerce Braintree Gateway
 *
 * This source file is subject to the GNU General Public License v3.0
 * that is bundled with this package in the file license.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl-3.0.html
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@woocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade WooCommerce Braintree Gateway to newer
 * versions in the future. If you wish to customize WooCommerce Braintree Gateway for your
 * needs please refer to http://docs.woocommerce.com/document/braintree/
 *
 * @package   WC-Braintree/Gateway/Payment-Form/Hosted-Fields
 * @author    WooCommerce
 * @copyright Copyright: (c) 2016-2020, Automattic, Inc.
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */

use SkyVerge\WooCommerce\PluginFramework\v5_11_8 as Framework;

defined( 'ABSPATH' ) or exit;

/**
 * Braintree Hosted Fields Payment Form
 *
 * @since 3.0.0
 *
 * @method \WC_Gateway_Braintree_Credit_Card get_gateway()
 */
class WC_Braintree_Hosted_Fields_Payment_Form extends WC_Braintree_Payment_Form {


	/**
	 * Gets the JS handler class name.
	 *
	 * @since 2.4.0
	 *
	 * @return string
	 */
	protected function get_js_handler_class_name() {

		return 'WC_Braintree_Credit_Card_Payment_Form_Handler';
	}


	/**
	 * Override the standard payment method HTML to add a nonce to the associated
	 * token so it can be used for 3D Secure verification. This is added as a
	 * data-nonce attribute.
	 *
	 * @since 3.0.0
	 * @param \WC_Braintree_Payment_Method $token payment token
	 * @return string saved payment method HTML
	 */
	protected function get_saved_payment_method_html( $token ) {

		$html = parent::get_saved_payment_method_html( $token );

		if ( ! Framework\SV_WC_Helper::str_exists( $html, 'data-nonce' ) && in_array( Framework\SV_WC_Payment_Gateway_Helper::normalize_card_type( $token->get_card_type() ), $this->get_gateway()->get_3d_secure_card_types(), true ) ) {

			$nonce_data = $this->get_gateway()->get_3d_secure_data_for_token( $token );
			$nonce      = $nonce_data['nonce'] ?? '';
			$bin        = $nonce_data['bin'] ?? '';

			if ( $nonce ) {
				$html = str_replace( 'name="wc-braintree-credit-card-payment-token"', 'name="wc-braintree-credit-card-payment-token" data-nonce="' . esc_attr( $nonce ) . '" data-bin="' . esc_attr( $bin ) . '"', $html );
			}
		}

		return $html;
	}


	/**
	 * Override the default form fields to add hosted field specific classes
	 *
	 * @since 3.0.0
	 * @return array credit card form fields
	 */
	protected function get_credit_card_fields() {

		$fields = parent::get_credit_card_fields();

		foreach ( array( 'card-number', 'card-expiry', 'card-csc' ) as $field_key ) {

			if ( isset( $fields[ $field_key ] ) ) {

				// parent div classes - contains both the label and hosted field container div
				$fields[ $field_key ]['class'] = array_merge( $fields[ $field_key ]['class'], array( "wc-braintree-hosted-field-{$field_key}-parent", 'wc-braintree-hosted-field-parent' ) );

				// hosted field container classes - contains the iframe element
				$fields[ $field_key ]['input_class'] = array_merge( $fields[ $field_key ]['input_class'], array( "wc-braintree-hosted-field-{$field_key}", 'wc-braintree-hosted-field' ) );
			}
		}

		// adjust expiry date label
		$fields['card-expiry']['label'] = esc_html__( 'Expiration (MMYY)', 'woocommerce-gateway-paypal-powered-by-braintree' );

		return $fields;
	}


	/**
	 * Render a custom payment field. This essentially replaces <input> types
	 * usually generated by woocommerce_form_field() with <div>s that are required
	 * by Braintree's hosted field implementation
	 *
	 * @since 3.0.0
	 * @param array $field
	 */
	public function render_payment_field( $field ) {

		?>
		<div class="form-row <?php echo implode( ' ', array_map( 'sanitize_html_class', $field['class'] ) ); ?>">
			<label for="<?php echo esc_attr( $field['id'] ) . '-hosted'; ?>"><?php echo esc_html( $field['label'] ); if ( $field['required'] ) : ?><abbr class="required" title="required">&nbsp;*</abbr><?php endif; ?></label>
			<div id="<?php echo esc_attr( $field['id'] ) . '-hosted'; ?>" class="<?php echo implode( ' ', array_map( 'sanitize_html_class', $field['input_class'] ) ); ?>" data-placeholder="<?php echo isset( $field['placeholder'] ) ? esc_attr( $field['placeholder'] ) : ''; ?>"></div>
		</div>
		<?php
	}


	/**
	 * Return the JS params passed to the the payment form handler script
	 *
	 * @since 3.0.0
	 * @see WC_Braintree_Payment_Form::get_payment_form_handler_js_params()
	 * @return array
	 */
	public function get_payment_form_handler_js_params() {

		$params = parent::get_payment_form_handler_js_params();

		// Braintree JS only returns the full names, so ensure they're correctly formatted from settings
		$braintree_card_types = array(
			'American Express' => Framework\SV_WC_Payment_Gateway_Helper::CARD_TYPE_AMEX ,
			'MasterCard'       => Framework\SV_WC_Payment_Gateway_Helper::CARD_TYPE_MASTERCARD,
			'Visa'             => Framework\SV_WC_Payment_Gateway_Helper::CARD_TYPE_VISA,
			'Maestro'          => Framework\SV_WC_Payment_Gateway_Helper::CARD_TYPE_MAESTRO,
		);

		$card_types = array_keys( array_intersect( $braintree_card_types, $this->get_gateway()->get_3d_secure_card_types() ) );

		$params = array_merge( $params, [
			'csc_required' => $this->get_gateway()->is_csc_required(),
			'threeds'      => array(
				'enabled'                         => $this->should_enable_3d_secure(), // setting this to false overrides any account configuration
				'liability_shift_always_required' => $this->get_gateway()->is_3d_secure_liability_shift_always_required(),
				'card_types'                      => $card_types,
				'failure_message'                 => esc_html__( 'We cannot process your order with the payment information that you provided. Please use an alternate payment method.', 'woocommerce-gateway-paypal-powered-by-braintree' ),
			),
			'hosted_fields_styles' => $this->get_hosted_fields_styles(),
			'enabled_card_types'   => $this->get_enabled_card_types(),
		] );

		return $params;
	}


	/**
	 * Determines whether 3D Secure should be enabled for the current transaction.
	 *
	 * @since 2.3.1
	 *
	 * @return bool
	 */
	private function should_enable_3d_secure() {

		$enable = false;

		if ( ! is_add_payment_method_page() && $this->get_gateway()->is_3d_secure_enabled() ) {

			// disable 3D Secure if we can't determine a non-zero cart total, as $0 verifications are currently not supported
			$enable = $this->get_order_total_for_3d_secure() !== 0.0;
		}

		return $enable;
	}


	/**
	 * Gets the enabled card types in the Braintree SDK format.
	 *
	 * @since 2.1.0
	 *
	 * @return array
	 */
	protected function get_enabled_card_types() {

		$types = array_map( '\\SkyVerge\\WooCommerce\\PluginFramework\\v5_11_8\\SV_WC_Payment_Gateway_Helper::normalize_card_type', $this->get_gateway()->get_card_types() );

		// The Braintree SDK has its own strings for a few card types that we need to match
		$types = str_replace( [
			Framework\SV_WC_Payment_Gateway_Helper::CARD_TYPE_AMEX,
			Framework\SV_WC_Payment_Gateway_Helper::CARD_TYPE_DINERSCLUB,
			Framework\SV_WC_Payment_Gateway_Helper::CARD_TYPE_MASTERCARD,
		], [
			'american-express',
			'diners-club',
			'master-card',
		], $types );

		return $types;
	}


	/**
	 * Get the hosted fields styles in an associative array. These are used
	 * by the Braintree SDK to apply to the inputs inside the hosted field iframes.
	 *
	 * @link https://developers.braintreepayments.com/guides/hosted-fields/styling/javascript/v2
	 *
	 * @since 3.0.0
	 * @return array
	 */
	protected function get_hosted_fields_styles() {

		$styles = array(
			'input' => array(
				'font-size' => '1.3em',
			)
		);

		/**
		 * Braintree Credit Card Hosted Fields Styles Filter.
		 *
		 * Allow actors to set the styles used for the hosted fields. See the link
		 * above for the exact format required.
		 *
		 * @since 3.0.0
		 * @param array $styles
		 * @param \WC_Braintree_Hosted_Fields_Payment_Form $this instance
		 * @return array
		 */
		return apply_filters( 'wc_' . $this->get_gateway()->get_id() . '_hosted_fields_styles', $styles, $this );
	}


	/**
	 * Renders hidden inputs for the handling 3D Secure transactions.
	 *
	 * @since 3.0.0
	 */
	public function render_payment_fields() {

		$fields = [
			'card-type',
			'3d-secure-enabled',
			'3d-secure-verified',
		];

		foreach ( $fields as $field ) {
			echo '<input type="hidden" name="wc-' . esc_attr( $this->get_gateway()->get_id_dasherized() ) . '-' . esc_attr( $field ) . '" value="" />';
		}

		$order_total = $this->get_order_total_for_3d_secure();

		echo '<input type="hidden" name="wc-' . esc_attr( $this->get_gateway()->get_id_dasherized() ) . '-3d-secure-order-total" value="' . esc_attr( Framework\SV_WC_Helper::number_format( $order_total ) ) . '" />';

		if ( wc_braintree()->is_subscriptions_active() && \WC_Subscriptions_Cart::cart_contains_subscription() ) {
			echo '<input type="hidden" name="wc-' . esc_attr( $this->get_gateway()->get_id_dasherized() ) . '-cart-contains-subscription" value="1" />';
		}

		// add hidden inputs for billing information on the order pay page (so we can send it for 3D Secure).
		$order_id = $this->get_gateway()->get_checkout_pay_page_order_id();
		if ( is_checkout_pay_page() && $order_id ) {

			$order = wc_get_order( $order_id );

			if ( $order ) {

				echo '<input type="hidden" name="billing_first_name" value="' . esc_attr( $order->get_billing_first_name( 'edit' ) ) . '" />';
				echo '<input type="hidden" name="billing_last_name" value="' . esc_attr( $order->get_billing_last_name( 'edit' ) ) . '" />';
				echo '<input type="hidden" name="billing_phone" value="' . esc_attr( $order->get_billing_phone( 'edit' ) ) . '" />';
				echo '<input type="hidden" name="billing_address_1" value="' . esc_attr( $order->get_billing_address_1( 'edit' ) ) . '" />';
				echo '<input type="hidden" name="billing_address_2" value="' . esc_attr( $order->get_billing_address_2( 'edit' ) ) . '" />';
				echo '<input type="hidden" name="billing_postcode" value="' . esc_attr( $order->get_billing_postcode( 'edit' ) ) . '" />';
				echo '<input type="hidden" name="billing_email" value="' . esc_attr( $order->get_billing_email( 'edit' ) ) . '" />';

				echo '<input type="hidden" id="billing_city" value="' . esc_attr( $order->get_billing_city( 'edit' ) ) . '" />';
				echo '<input type="hidden" id="billing_state" value="' . esc_attr( $order->get_billing_state( 'edit' ) ) . '" />';
				echo '<input type="hidden" id="billing_country" value="' . esc_attr( $order->get_billing_country( 'edit' ) ) . '" />';

				if ( $order->has_shipping_address() ) {

					echo '<input type="hidden" name="shipping_first_name" value="' . esc_attr( $order->get_shipping_first_name( 'edit' ) ) . '" />';
					echo '<input type="hidden" name="shipping_last_name" value="' . esc_attr( $order->get_shipping_last_name( 'edit' ) ) . '" />';
					echo '<input type="hidden" name="shipping_address_1" value="' . esc_attr( $order->get_shipping_address_1( 'edit' ) ) . '" />';
					echo '<input type="hidden" name="shipping_address_2" value="' . esc_attr( $order->get_shipping_address_2( 'edit' ) ) . '" />';
					echo '<input type="hidden" name="shipping_city" value="' . esc_attr( $order->get_shipping_city( 'edit' ) ) . '" />';
					echo '<input type="hidden" name="shipping_postcode" value="' . esc_attr( $order->get_shipping_postcode( 'edit' ) ) . '" />';

					echo '<input type="hidden" id="shipping_state" value="' . esc_attr( $order->get_shipping_state( 'edit' ) ) . '" />';
					echo '<input type="hidden" id="shipping_country" value="' . esc_attr( $order->get_shipping_country( 'edit' ) ) . '" />';
				}
			}
		}

		parent::render_payment_fields();
	}


	/**
	 * Calculate the order total used for card verification.
	 *
	 * @since 2.3.1
	 *
	 * @return float cart total or the subscription recurring amount
	 */
	public function get_order_total_for_3d_secure() {

		$order_total = (float) $this->get_order_total();

		if ( $order_total === 0.0 && wc_braintree()->is_subscriptions_active() && \WC_Subscriptions_Cart::cart_contains_subscription() ) {
			$order_total = $this->get_subscription_totals();
		}

		return $order_total;
	}


	/**
	 * Calculate the recurring amount for the subscriptions included in the cart.
	 *
	 * @since 2.3.1
	 *
	 * @see \WC_Subscriptions_Cart::calculate_subscription_totals()
	 * @return float
	 */
	private function get_subscription_totals() {

		$total = 0.0;

		if ( isset( WC()->cart->recurring_carts ) && is_array( WC()->cart->recurring_carts ) ) {

			foreach ( WC()->cart->recurring_carts as $recurring_cart ) {
				$total += (float) $recurring_cart->total;
			}
		}

		return $total;
	}


}
