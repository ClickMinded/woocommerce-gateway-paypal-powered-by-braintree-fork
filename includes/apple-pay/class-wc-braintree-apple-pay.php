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
 * @package   WC-Braintree/Gateway/Credit-Card
 * @author    WooCommerce
 * @copyright Copyright: (c) 2016-2020, Automattic, Inc.
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */

namespace WC_Braintree;

use SkyVerge\WooCommerce\PluginFramework\v5_12_0 as Framework;

defined( 'ABSPATH' ) or exit;

/**
 * The Braintree Apple Pay base handler.
 *
 * @since 2.2.0
 */
class Apple_Pay extends Framework\SV_WC_Payment_Gateway_Apple_Pay {


	/**
	 * Initializes the frontend handler.
	 *
	 * @since 2.2.0
	 */
	protected function init_frontend() {

		$this->frontend = new Apple_Pay\Frontend( $this->get_plugin(), $this );
		// Runs at priority 11 to ensure that the button is moved after the framework's init fires.
		add_action( 'wp', array( $this, 'post_init' ), 11 );
	}

	/**
	 * Modify Apple Pay button after framework has been initialized.
	 *
	 * Moves the Apple Pay button to the new location following the framework's initialization.
	 * As the framework uses a protected function for determining the locations in which buttons
	 * are displayed, we determine whether it has registered the actions and move them if required.
	 *
	 * @see https://github.com/woocommerce/woocommerce-gateway-paypal-powered-by-braintree/pull/535
	 */
	public function post_init() {
		if ( has_action( 'woocommerce_before_add_to_cart_button', array( $this->frontend, 'maybe_render_external_checkout' ) ) ) {
			remove_action( 'woocommerce_before_add_to_cart_button', array( $this->frontend, 'maybe_render_external_checkout' ) );
			add_action( 'woocommerce_after_add_to_cart_button', array( $this->frontend, 'maybe_render_external_checkout' ) );
		}

		if ( has_action( 'woocommerce_proceed_to_checkout', array( $this->frontend, 'maybe_render_external_checkout' ) ) ) {
			remove_action( 'woocommerce_proceed_to_checkout', array( $this->frontend, 'maybe_render_external_checkout' ) );
			add_action( 'woocommerce_proceed_to_checkout', array( $this->frontend, 'maybe_render_external_checkout' ), 30 );
		}
	}

	/**
	 * Builds a new payment request.
	 *
	 * Overridden to remove some properties that are set by Braintree from account configuration.
	 *
	 * @since 2.2.0
	 *
	 * @param float|int $amount payment amount
	 * @param array $args payment args
	 * @return array
	 */
	public function build_payment_request( $amount, $args = array() ) {

		$request = parent::build_payment_request( $amount, $args );

		// these values are populated by the Braintree SDK
		unset(
			$request['currencyCode'],
			$request['countryCode'],
			$request['merchantCapabilities'],
			$request['supportedNetworks']
		);

		return $request;
	}


	/**
	 * Builds a payment response object based on an array of data.
	 *
	 * @since 2.2.0
	 *
	 * @param string $data response data as a JSON string
	 *
	 * @return Apple_Pay\API\Payment_Response
	 */
	protected function build_payment_response( $data ) {

		return new Apple_Pay\API\Payment_Response( $data );
	}


	/**
	 * Determines if a local Apple Pay certificate is required.
	 *
	 * @since 2.2.0
	 *
	 * @return bool
	 */
	public function requires_certificate() {

		return false;
	}


	/**
	 * Determines if a merchant ID is required.
	 *
	 * @since 2.2.0
	 *
	 * @return bool
	 */
	public function requires_merchant_id() {

		return false;
	}


}
