!function () {
    function n(e, t) {
        if (!(e instanceof t)) throw new Error("Bound instance method accessed before binding");
    }
    var a = [].indexOf;
    jQuery(document).ready(function (_) {
        "use strict";
        var e, i, r;
        return (
            (window.WC_Braintree_Payment_Form_Handler = class {
                constructor(e) {
                    (this.show_integration_ui = this.show_integration_ui.bind(this)),
                        (this.hide_integration_ui = this.hide_integration_ui.bind(this)),
                        (this.id = e.id),
                        (this.id_dasherized = e.id_dasherized),
                        (this.name = e.name),
                        (this.type = e.type),
                        (this.debug = e.debug),
                        (this.client_token_nonce = e.client_token_nonce),
                        (this.ajax_url = e.ajax_url),
                        (this.integration_error_message = e.integration_error_message),
                        (this.payment_error_message = e.payment_error_message),
                        (this.params = window.sv_wc_payment_gateway_payment_form_params);
                }
                init() {
                    return this.is_sdk_ready()
                        ? _("form.checkout").length
                            ? this.handle_checkout_page()
                            : _("form#order_review").length
                            ? this.handle_pay_page()
                            : _("form#add_payment_method").length
                            ? this.handle_add_payment_method_page()
                            : void 0
                        : console.error("Braintree SDK is missing.");
                }
                handle_checkout_page() {
                    return (
                        (this.form = _("form.checkout")),
                        (this.form_ui_selector = ".woocommerce-checkout-payment"),
                        _(document.body).on("updated_checkout", () => {
                            console.log(this.integration);
                            if(this.setting_up && this.integration){
                                //Check if the CVV field is connected to the iframe, If it's not, recreate the Braintree instance.
                                if(this.type === 'credit_card'){
                                    const cvvField = this.integration?._state?.fields?.cvv?.container?.children?.["braintree-hosted-field-cvv"];
                                    const isCreditCardIntegrationIncomplete = !cvvField?.isConnected;
                                    if(isCreditCardIntegrationIncomplete) this.setting_up = !1;
                                }
                                if(this.type === 'paypal'){
                                    //Check if the PayPal button is connected to the iframe, If it's not, recreate the Braintree instance.
                                    const isPaypalIntegrationIncomplete = !this.form[0]?.elements["wc-braintree-paypal-tokenize-payment-method"]?.form?.elements["wc-braintree-paypal-paypal-form"]?.textContent?.includes('#zoid-paypal');
                                    if(isPaypalIntegrationIncomplete) this.setting_up = !1;
                                    //Check if PayPal payment method is selected. If it is, verify if the PayPal button has a zero height. if it is, recreate the Braintree instance.
                                    const isPayPalButtonZeroHeight = this.form[0]?.elements["payment_method_braintree_paypal"]?.checked && this.form[0]?.elements["wc-braintree-paypal-paypal-form"]?.childNodes[1]?.clientHeight === 0;
                                    if(isPayPalButtonZeroHeight) this.setting_up = !1;
                                }
                                //if(this.setting_up && this.integration && this.type === 'credit_card' && !this.integration._state.fields.cvv.container.children["braintree-hosted-field-cvv"].isConnected) this.setting_up = !1;
                                //if(this.setting_up && this.integration && this.type === 'paypal' && !this.form[0].elements["wc-braintree-paypal-tokenize-payment-method"].form.elements["wc-braintree-paypal-paypal-form"].textContent.includes('#zoid-paypal')) this.setting_up = !1; 
                                //if(this.setting_up && this.integration && this.type === 'paypal' && this.form[0].elements["payment_method_braintree_paypal"].checked && this.form[0].elements["wc-braintree-paypal-paypal-form"].childNodes[1].clientHeight == 0) this.setting_up = !1;
                            }
                            if (!this.setting_up) return _('iframe[name^="braintree-"]').remove(), this.setup_braintree();
                        }),
                        _(document.body).on("updated_checkout", () => this.handle_saved_payment_methods()),
                        _(document.body).on("checkout_error", () => this.handle_checkout_error()),
                        this.form.on("checkout_place_order_" + this.id, () => {
                            if (this.is_selected()) return this.block_ui(), this.verify_form();
                        })
                    );
                }
                handle_checkout_error() {
                    return this.unblock_ui();
                }
                handle_pay_page() {
                    return (
                        (this.form = _("form#order_review")),
                        (this.form_ui_selector = "#payment"),
                        this.handle_saved_payment_methods(),
                        this.setup_braintree(),
                        this.form.submit(() => {
                            if (this.is_selected()) return this.block_ui(), this.verify_form();
                        })
                    );
                }
                handle_add_payment_method_page() {
                    return (
                        (this.form = _("form#add_payment_method")),
                        (this.form_ui_selector = "#payment"),
                        this.setup_braintree(),
                        this.form.submit(() => {
                            if (this.is_selected()) return this.block_ui(), this.verify_form();
                        })
                    );
                }
                verify_form() {
                    return !!this.using_payment_token() || (!!this.has_payment_nonce() && void 0);
                }
                submit_form(e) {
                    return _(`input[name=wc_${this.id}_payment_nonce]`).val(e), this.form.submit();
                }
                handle_saved_payment_methods() {
                    var e = _(`div.js-wc-${this.id_dasherized}-new-payment-method-form`);
                    if (
                        (_(`input.js-wc-${this.id_dasherized}-payment-token`)
                            .change(() => {
                                return _(`input.js-wc-${this.id_dasherized}-payment-token:checked`).val() ? e.slideUp(200) : e.slideDown(200);
                            })
                            .change(),
                        _("input#createaccount").change((e) => {
                            var t = _(`input.js-wc-${this.id_dasherized}-tokenize-payment-method`).closest("p.form-row");
                            return _(e.target).is(":checked") ? (t.slideDown(), t.next().show()) : (t.hide(), t.next().hide());
                        }),
                        !_("input#createaccount").is(":checked"))
                    )
                        return _("input#createaccount").change();
                }
                setup_braintree() {
                    if (!_(`#wc-${this.id_dasherized}-account-number-hosted iframe`).data("ready")) return (this.setting_up = !0), this.block_ui(), _(`input[name=wc_${this.id}_payment_nonce]`).val(""), this.create_client();
                }
                create_client() {
                  this.log("Creating client.");
                      //Validate if the client token is set, if it is, use the same client token to create the client.
                      if(this.client && this.client._configuration.authorization.length > 0){
                          braintree.client
                          .create({ authorization: this.client._configuration.authorization })
                          .then((client) => {
                              this.client = client;
                              this.log("Client ready.");
                              this.setup_integration();
                          })
                          .catch((error) => {
                              this.handle_integration_error(error);
                              this.unblock_ui();
                          });
                      }else{
                          return this.get_client_token()
                              .done((response) => {
                                  if (!response.success) {
                                      this.handle_integration_error(response.data);
                                      this.unblock_ui();
                                      return;
                                  }
      
                                  braintree.client
                                      .create({ authorization: response.data })
                                      .then((client) => {
                                          this.client = client;
                                          this.log("Client ready.");
                                          this.setup_integration();
                                      })
                                      .catch((error) => {
                                          this.handle_integration_error(error);
                                          this.unblock_ui();
                                      });
                              })
                              .fail((error, status, responseText) => {
                                  this.handle_integration_error({ message: "Could not retrieve the client token via AJAX: " + responseText });
                                  this.unblock_ui();
                              });
                      }
                }
                get_client_token() {
                    this.id;
                    var e = { action: `wc_${this.id}_get_client_token`, nonce: this.client_token_nonce };
                    return _.post(this.ajax_url, e);
                }
                setup_integration() {
                    return (
                        this.set_device_data(),
                        this.log("Creating integration."),
                        this.get_integration_class()
                            .create(this.get_integration_options())
                            .then(
                                (e) => (
                                    (this.integration = e),
                                    this.show_integration_ui(),
                                    _(`#wc-${this.id_dasherized}-account-number-hosted iframe`).data("ready", !0),
                                    this.do_integration_ready(),
                                    _(document).trigger(`wc_${this.id}_integration_ready`, this.integration),
                                    this.log("Integration ready.")//,
                                    // The setting_up flag won't be set to false until the CVV field is not connected to the iframe or the iframe gets removed.
                                    //(this.setting_up = !1)
                                )
                            )
                            .catch((e) => (this.handle_integration_error(e), this.unblock_ui(), (this.setting_up = !1),this.refresh_braintree()))
                    );
                }
                refresh_braintree() {
                  // Check if there are only 2 injected nodes when the user clicks on "Use a new card".
                  // If there are only 2 injected nodes, it means the card number and expiration date fields are not present,
                  // then, the Braintree instance needs to be recreated.
                  if(this.type === 'credit_card' && this.integration && this.form[0].elements["wc-braintree-credit-card-use-new-payment-method"].checked && this.integration._injectedNodes.length <= 2) this.setting_up = !1;
                  // Check if there are more than 2 injected nodes when the user clicks on a saved card
                  // If there are more than 2 injected nodes, it means the card number and expiration date are present 
                  // but not necessary, so the Braintree instance needs to be recreated.
                  if(this.type === 'credit_card' && this.integration && !this.form[0].elements["wc-braintree-credit-card-use-new-payment-method"].checked && this.integration._injectedNodes.length > 2) this.setting_up = !1;
  
                    if (null != this.integration && !this.refreshing && !this.setting_up)
                        return this.log("Refreshing integration."), (this.refreshing = !0), this.block_ui(), this.integration.teardown(() => ((this.integration = null), (this.refreshing = !1), this.setup_braintree()));
                }
                teardown_braintree() {
                    if (null != this.integration && !this.tearing_down && !this.setting_up)
                        return this.log("Tearing down integration."), (this.tearing_down = !0), this.block_ui(), this.integration.teardown(() => ((this.integration = null), (this.tearing_down = !1), this.unblock_ui()));
                }
                set_device_data() {
                    if (braintree && braintree.dataCollector)
                        return braintree.dataCollector.create({ client: this.client }).then((e) => {
                            if (e && e.deviceData) return _("input[id*='wc_braintree_device_data']").val(e.deviceData);
                        });
                }
                do_integration_ready() {}
                get_integration_options() {
                    return { client: this.client };
                }
                get_integration_class() {}
                handle_integration_error(e) {
                    return this.log("Integration error. " + e.message, e, "error"), this.hide_integration_ui(), this.unblock_ui();
                }
                handle_payment_error(e) {
                    return this.log("Payment error. " + e.message, e, "error"), this.render_error(this.get_user_message(e)), this.unblock_ui();
                }
                render_error(e) {
                    return (
                        _(".woocommerce-error, .woocommerce-message").remove(),
                        this.form
                            .prepend('<div class="woocommerce-error">' + e + "</div>")
                            .removeClass("processing")
                            .unblock(),
                        _("html, body").animate({ scrollTop: this.form.offset().top - 100 }, 1e3),
                        _(`input[name=wc_${this.id}_payment_nonce]`).val(""),
                        this.form.trigger(`wc_${this.id}_rendered_error`),
                        _(document.body).trigger("checkout_error"),
                        this.unblock_ui()
                    );
                }
                get_user_message(e) {
                    return this.payment_error_message;
                }
                show_integration_ui() {
                    if ((_(`div.js-wc-${this.id_dasherized}-new-payment-method-form`).find(".woocommerce-error").remove(), _("input#createaccount").length && _("input#createaccount").is(":checked")))
                        return _(`div.js-wc-${this.id_dasherized}-new-payment-method-form`).find(".form-row").show();
                }
                hide_integration_ui() {
                    return (
                        _(`div.js-wc-${this.id_dasherized}-new-payment-method-form`).prepend('<div class="woocommerce-error">' + this.integration_error_message + "</div>"),
                        _(`div.js-wc-${this.id_dasherized}-new-payment-method-form`).find(".form-row").hide()
                    );
                }
                block_ui() {
                    return _(this.form_ui_selector).block({ message: null, overlayCSS: { background: "#fff", opacity: 0.6 } });
                }
                unblock_ui() {
                    return _(this.form_ui_selector).unblock();
                }
                is_selected() {
                    return this.get_selected_gateway_id() === this.id;
                }
                is_sdk_ready() {
                    return "undefined" != typeof braintree && null !== braintree && null != braintree.client && null != this.get_integration_class();
                }
                has_payment_nonce() {
                    return this.form.find(`input[name=wc_${this.id}_payment_nonce]`).val();
                }
                using_payment_token() {
                    return this.form.find(`input.js-wc-${this.id_dasherized}-payment-token:checked`).val();
                }
                get_selected_gateway_id() {
                    return this.form.find("input[name=payment_method]:checked").val();
                }
                log(e, t = null, i) {
                    if (this.debug) return console.log(this.name + ": " + e), t ? console.log(t) : void 0;
                }
            }),
            _(document.body).trigger("wc_braintree_payment_form_handler_loaded"),
            (e = window.WC_Braintree_Credit_Card_Payment_Form_Handler = class extends WC_Braintree_Payment_Form_Handler {
                constructor(e) {
                    super(e),
                        (this.show_integration_ui = this.show_integration_ui.bind(this)),
                        (this.hide_integration_ui = this.hide_integration_ui.bind(this)),
                        (this.csc_required = e.csc_required),
                        (this.hosted_fields_styles = e.hosted_fields_styles),
                        (this.threeds = e.threeds),
                        (this.enabled_card_types = e.enabled_card_types),
                        this.init();
                }
                handle_checkout_error() {
                    return (
                        super.handle_checkout_error(), _(`input[name=wc_${this.id}_payment_nonce]`).val(""), _(`input[name=wc-${this.id_dasherized}-card-type]`).val(""), _(`input[name=wc-${this.id_dasherized}-3d-secure-verified]`).val(0)
                    );
                }
                verify_form() {
                    var e;
                    return this.has_payment_nonce() || (!this.csc_required && this.using_payment_token())
                        ? ((e = _("input.js-wc-braintree-credit-card-payment-token:checked")), this.should_verify_3d_secure_token(e) ? (this.verify_3d_secure(e.data("nonce"), null, e), !1) : super.verify_form())
                        : (this.tokenize_payment(), !1);
                }
                tokenize_payment() {
                    return this.integration
                        .tokenize()
                        .then((e) => {
                            if ((this.log("Payment method received.", e), null != e.nonce && null != e.details && null != e.details.bin))
                                return this.should_verify_3d_secure(e) ? this.verify_3d_secure(e.nonce, e.details.bin) : this.submit_form(e.nonce);
                        })
                        .catch((e) => this.handle_payment_error(e));
                }
                get_integration_options() {
                    var e = {
                        client: this.client,
                        fields: {
                            number: { selector: "#wc-braintree-credit-card-account-number-hosted", placeholder: _("#wc-braintree-credit-card-account-number-hosted").data("placeholder") },
                            cvv: { selector: "#wc-braintree-credit-card-csc-hosted", placeholder: _("#wc-braintree-credit-card-csc-hosted").data("placeholder") },
                            expirationDate: { selector: "#wc-braintree-credit-card-expiry-hosted", placeholder: _("#wc-braintree-credit-card-expiry-hosted").data("placeholder") },
                        },
                        styles: this.hosted_fields_styles,
                    };
                    return this.csc_required && this.using_payment_token() && (delete e.fields.number, delete e.fields.expirationDate), this.csc_required || delete e.fields.cvv, e;
                }
                get_integration_class() {
                    return braintree.hostedFields;
                }
                do_integration_ready() {
                    return this.integration.on("cardTypeChange", (e) => this.on_card_type_change(e)), !this.csc_required && _("input.js-wc-braintree-credit-card-payment-token:checked").val() && this.teardown_braintree(), this.unblock_ui();
                }
                handle_saved_payment_methods() {
                  var e, t;
                  return (
                      super.handle_saved_payment_methods(),
                      (t = _("div.js-wc-braintree-credit-card-new-payment-method-form")),
                      (e = _("div.wc-braintree-hosted-field-card-csc-parent")),
                      _("input.js-wc-braintree-credit-card-payment-token")
                          .change(() => {
                              if (_("input.js-wc-braintree-credit-card-payment-token:checked").val()) {
                                  if (this.csc_required && e.hasClass("form-row-last")) {
                                      e.removeClass("form-row-last").addClass("form-row-first");
                                      t.after(e);
                                      this.refresh_braintree();
                                  }
                              } else {
                                  if (this.csc_required && e.hasClass("form-row-first")) {
                                      e.removeClass("form-row-first").addClass("form-row-last");
                                      t.find("div.wc-braintree-hosted-field-card-expiry-parent").after(e);
                                  }
                                  //Only call refresh function if there are 2 nodes. 
                                  if(this.integration && this.integration._injectedNodes.length <= 2) this.refresh_braintree();
                              }
                          })
                          .change()
                  );
                }
                get_user_message(e) {
                    var t,
                        i,
                        r,
                        n,
                        a = [];
                    if ("CUSTOMER" === e.type)
                        switch (e.code) {
                            case "HOSTED_FIELDS_FIELDS_EMPTY":
                                this.csc_required && a.push(this.params.cvv_missing), this.using_payment_token() || (a.push(this.params.card_number_missing), a.push(this.params.card_exp_date_invalid));
                                break;
                            case "HOSTED_FIELDS_FIELDS_INVALID":
                                if (null != e.details)
                                    for (t = 0, i = (n = e.details.invalidFieldKeys).length; t < i; t++)
                                        switch (n[t]) {
                                            case "number":
                                                a.push(this.params.card_number_invalid);
                                                break;
                                            case "cvv":
                                                a.push(this.params.cvv_length_invalid);
                                                break;
                                            case "expirationDate":
                                                a.push(this.params.card_exp_date_invalid);
                                        }
                                break;
                            default:
                                null != e.message && a.push(e.message),
                                    null != e.error && null != e.error.message && a.push(e.error.message),
                                    null != e.details && null != e.details.originalError && (a = a.concat(this.get_user_message(e.details.originalError)));
                        }
                    else
                        "NETWORK" === e.type &&
                            null != e.details.originalError.error.message &&
                            ((r = e.details.originalError.error.message),
                            /given name format is invalid/.test(r) ? a.push(this.params.first_name_unsupported_characters) : /surname format is invalid/.test(r) ? a.push(this.params.last_name_unsupported_characters) : a.push(r));
                    return a.length ? a.join("<br/>") : super.get_user_message();
                }
                on_card_type_change(e) {
                    var t, i;
                    if (null != e.cards)
                        return (
                            (t = _("#wc-braintree-credit-card-account-number-hosted")).attr("class", function (e, t) {
                                return t.replace(/(^|\s)card-type-\S+/g, "");
                            }),
                            e.cards.length
                                ? 1 === e.cards.length
                                    ? ((e = e.cards[0]),
                                      _(`input[name=wc-${this.id_dasherized}-card-type]`).val(e.type),
                                      null != e.type && ((i = e.type), 0 <= a.call(this.enabled_card_types, i)) ? t.addClass("card-type-" + e.type) : t.addClass("card-type-invalid"))
                                    : void 0
                                : t.addClass("card-type-invalid")
                        );
                }
                is_3d_secure_enabled() {
                    return this.threeds.enabled && null != braintree.threeDSecure;
                }
                setup_integration() {
                    return (
                        this.threeds.enabled && (this.threeds.enabled = this.client.getConfiguration().gatewayConfiguration.threeDSecureEnabled),
                        this.is_3d_secure_enabled()
                            ? (_(`input[name=wc-${this.id_dasherized}-3d-secure-enabled]`).val(1),
                              this.threeDSecure && this.threeDSecure.teardown(),
                              braintree.threeDSecure
                                  .create({ version: 2, client: this.client })
                                  .then(
                                      (e) => (
                                          (this.threeDSecure = e),
                                          _(document.body).on("click", "#wc-braintree-credit-card-3dsecure-container", (e) => (_(e.currentTarget).fadeOut(200), this.threeDSecure.cancelVerifyCard(), this.unblock_ui())),
                                          super.setup_integration()
                                      )
                                  )
                                  .catch((e) => this.handle_integration_error(e)))
                            : super.setup_integration()
                    );
                }
                should_verify_3d_secure(e) {
                    var t = e.details.cardType;
                    return this.is_3d_secure_enabled() && "CreditCard" === e.type && 0 <= a.call(this.threeds.card_types, t);
                }
                should_verify_3d_secure_token(e) {
                    if (this.is_3d_secure_enabled() && e.val() && e.data("nonce") && !e.data("verified")) return !0;
                }
                verify_3d_secure(e, t, i = null) {
                    var r = _("#billing_state").val(),
                        n = _("#billing_country").val(),
                        a = _("#shipping_state").val(),
                        s = _("#shipping_country").val(),
                        r = _("input[name=billing_first_name]").val()
                            ? {
                                  givenName: _("input[name=billing_first_name]").val().latinise(),
                                  surname: _("input[name=billing_last_name]").val().latinise(),
                                  phoneNumber: _("input[name=billing_phone]").val(),
                                  streetAddress: _("input[name=billing_address_1]").val(),
                                  extendedAddress: _("input[name=billing_address_2]").val(),
                                  locality: _("#billing_city").val(),
                                  region: "string" == typeof r && r.length <= 2 ? r : "",
                                  postalCode: _("input[name=billing_postcode]").val(),
                                  countryCodeAlpha2: "string" == typeof n && n.length <= 2 ? n : "",
                              }
                            : {},
                        n = _("input[name=shipping_first_name]").val()
                            ? {
                                  shippingGivenName: _("input[name=shipping_first_name]").val().latinise(),
                                  shippingSurname: _("input[name=shipping_last_name]").val().latinise(),
                                  shippingAddress: {
                                      streetAddress: _("input[name=shipping_address_1]").val(),
                                      extendedAddress: _("input[name=shipping_address_2]").val(),
                                      locality: _("input[name=shipping_city]").val(),
                                      region: "string" == typeof a && a.length <= 2 ? a : "",
                                      postalCode: _("input[name=shipping_postcode]").val(),
                                      countryCodeAlpha2: "string" == typeof s && s.length <= 2 ? s : "",
                                  },
                              }
                            : {},
                        a = {
                            nonce: e,
                            amount: _(`input[name=wc-${this.id_dasherized}-3d-secure-order-total]`).val(),
                            email: _("input[name=billing_email]").val(),
                            billingAddress: r,
                            additionalInformation: n,
                            onLookupComplete: (e, t) => {
                                this.log("3D Secure lookup complete.", e);
                                try {
                                    return t();
                                } catch (e) {
                                    return this.handle_payment_error(e);
                                }
                            },
                        };
                    return (
                        "1" === _(`input[name=wc-${this.id_dasherized}-cart-contains-subscription]`).val() && (a.challengeRequested = !0),
                        this.log("Verifying 3D Secure.", a),
                        this.threeDSecure
                            .verifyCard(a)
                            .then(
                                (e) => (
                                    this.log("3D Secure response received.", e),
                                    this.threeds.liability_shift_always_required && !e.liabilityShifted
                                        ? this.render_error(this.threeds.failure_message)
                                        : (null != i && i.data("verified", !0), _(`input[name=wc-${this.id_dasherized}-3d-secure-verified]`).val(1), this.submit_form(e.nonce))
                                )
                            )
                            .catch((e) => this.handle_payment_error(e))
                    );
                }
                show_integration_ui() {
                    return n(this, e), super.show_integration_ui(), _(".wc-braintree-hosted-field-parent").show();
                }
                hide_integration_ui() {
                    return n(this, e), super.hide_integration_ui(), _(".wc-braintree-hosted-field-parent").hide();
                }
            }),
            _(document.body).trigger("wc_braintree_credit_card_payment_form_handler_loaded"),
            (i = window.WC_Braintree_PayPal_Payment_Form_Handler = class extends WC_Braintree_Payment_Form_Handler {
                constructor(e) {
                    super(e),
                        (this.do_integration_ready = this.do_integration_ready.bind(this)),
                        (this.on_approve = this.on_approve.bind(this)),
                        (this.get_linked_account_html = this.get_linked_account_html.bind(this)),
                        (this.is_test_environment = e.is_test_environment),
                        (this.is_paypal_pay_later_enabled = e.is_paypal_pay_later_enabled),
                        (this.is_paypal_card_enabled = e.is_paypal_card_enabled),
                        (this.disabled_funding_options = e.paypal_disabled_funding_options),
                        (this.force_buyer_country = e.force_buyer_country),
                        (this.must_login_message = e.must_login_message),
                        (this.must_login_add_method_message = e.must_login_add_method_message),
                        (this.button_styles = e.button_styles),
                        (this.cart_payment_nonce = e.cart_payment_nonce),
                        (this.paypal_intent = e.paypal_intent),
                        this.init();
                }
                init() {
                    return (
                        super.init(),
                        _(`input[name=wc_${this.id}_payment_nonce]`).val(this.cart_payment_nonce),
                        _(document.body).on("click", 'input[name="payment_method"], input.js-wc-braintree-paypal-payment-token', () => this.toggle_order_button()),
                        _(document.body).on("payment_method_selected", () => this.toggle_order_button()),
                        _(document.body).on("click", ".wc-braintree-paypal-account .cancel", (e) => (e.preventDefault(), _(e.currentTarget).parent().remove(), this.setup_braintree())),
                        _(document.body).on("update_checkout", (e) => this.teardown_braintree())
                    );
                }
                toggle_order_button() {
                    return !this.is_selected() || this.has_payment_nonce() || this.using_payment_token() ? _("#place_order").show() : _("#place_order").hide();
                }
                verify_form() {
                    var e = super.verify_form();
                    return this.has_payment_nonce() || this.using_payment_token() || this.render_error(this.must_login_message), e;
                }
                handle_payment_error(e) {
                    return super.handle_payment_error(e), (this.cart_payment_nonce = !1), this.setup_braintree();
                }
                get_integration_class() {
                    return braintree.paypalCheckout;
                }
                setup_braintree() {
                    return this.cart_payment_nonce ? this.unblock_ui() : (super.setup_braintree(), _("input.js-wc-braintree-paypal-tokenize-payment-method").prop("disabled", !1), this.toggle_order_button());
                }
                do_integration_ready() {
                    return n(this, i), this.cart_payment_nonce ? this.unblock_ui() : this.load_paypal_sdk();
                }
                load_paypal_sdk() {
                    var e,
                        t = this.get_sdk_options();
                    return this.paypal_sdk_loaded && this.previous_paypal_sdk_options && JSON.stringify(this.previous_paypal_sdk_options) === JSON.stringify(t)
                        ? this.do_paypal_sdk_loaded()
                        : ((e = t),
                          this.paypal_sdk_messages_component_loaded && (e.components = "buttons"),
                          this.integration.loadPayPalSDK(e, () => ((this.paypal_sdk_loaded = !0), (this.previous_paypal_sdk_options = t), paypal.Messages && (this.paypal_sdk_messages_component_loaded = !0), this.do_paypal_sdk_loaded())));
                }
                do_paypal_sdk_loaded() {
                    var e = this.is_single_use() ? "checkout" : "vault";
                    return (
                        this.render_pay_later_messaging(),
                        this.render_button(
                            this.integration.createPayment({
                                flow: e,
                                intent: this.is_single_use() ? this.paypal_intent : "tokenize",
                                amount: this.get_order_amount(),
                                currency: this.get_store_currency(),
                                locale: this.get_store_locale(),
                                enableShippingAddress: this.get_needs_shipping(),
                            }),
                            this.get_button_styles(),
                            "#wc_braintree_paypal_container"
                        )
                            .then(() => ("undefined" === this.get_button_styles().height && _("#wc_braintree_paypal_container").css({ width: "100%" }), this.unblock_ui()))
                            .catch((e) => (this.log("Could not render the PayPal button. " + e.message, e), this.hide_integration_ui(), this.unblock_ui()))
                    );
                }
                render_pay_later_messaging() {
                    var e = _("#wc_braintree_paypal_pay_later_messaging_container");
                    if (e.length)
                        return paypal.Messages
                            ? paypal
                                  .Messages({ amount: this.get_order_amount() })
                                  .render("#wc_braintree_paypal_pay_later_messaging_container")
                                  .catch((e) => this.log("Could not render the PayPal Pay Later messeging. " + e.message, e))
                            : e.hide();
                }
                render_button(e, t, i) {
                    return (
                        _(i).html(""),
                        (t = { env: this.is_test_environment ? "sandbox" : "production", commit: this.button_is_pay_now(), style: t, onApprove: (e, t) => this.on_approve(e, t), onError: (e) => this.handle_integration_error(e) }),
                        this.is_single_use() ? (t.createOrder = () => e) : (t.createBillingAgreement = () => e),
                        paypal.Buttons(t).render(i)
                    );
                }
                button_is_pay_now() {
                    return !_("form#add_payment_method").length;
                }
                get_button_styles() {
                    return this.button_styles;
                }
                on_approve(e, t) {
                    return (
                        n(this, i),
                        this.block_ui(),
                        this.integration
                            .tokenizePayment(e)
                            .then((e) => (this.log("Payment method tokenized.", e), this.set_payment_method(e)))
                            .catch((e) => (this.handle_payment_error(e), this.unblock_ui()))
                    );
                }
                set_payment_method(e) {
                    return (
                        _(`input[name=wc_${this.id}_payment_nonce]`).val(e.nonce),
                        _("#wc_braintree_paypal_container").html(this.get_linked_account_html(e.details)),
                        this.is_single_use() && _("input.js-wc-braintree-paypal-tokenize-payment-method").prop("disabled", !0),
                        _("#place_order").show(),
                        this.form.submit()
                    );
                }
                handle_saved_payment_methods() {
                    return (
                        super.handle_saved_payment_methods(),
                        _("input.js-wc-braintree-paypal-tokenize-payment-method")
                            .change((e) => {
                                if (null != this.integration && _(e.target).is(":visible")) return this.block_ui(), this.do_integration_ready();
                            })
                            .change()
                    );
                }
                get_linked_account_html(e) {
                    var t;
                    return (
                        n(this, i),
                        (t = _(`<div class='wc-${this.id_dasherized}-account'></div>`)),
                        null != e.firstName && null != e.lastName && t.append(`<span class='name'>${e.firstName} ${e.lastName}</span>`),
                        t.append(`<span class='email'>${e.email}</span>`),
                        t.append("<a href='#' class='cancel'>Cancel</a>"),
                        t
                    );
                }
                is_single_use() {
                    var e = _("input[name=wc-braintree-paypal-tokenize-payment-method]");
                    return 0 === e.length || ("checkbox" === e.attr("type") ? !e.is(":checked") : !e.val());
                }
                get_order_amount() {
                    return _("input[name=wc_braintree_paypal_amount]").val();
                }
                get_store_currency() {
                    return _("input[name=wc_braintree_paypal_currency]").val();
                }
                get_store_locale() {
                    return _("input[name=wc_braintree_paypal_locale]").val();
                }
                get_needs_shipping() {
                    return !!_("input[name=wc_braintree_paypal_needs_shipping]").val();
                }
                get_sdk_options() {
                    var e, t, i;
                    return (
                        ([t, e] = [[], this.disabled_funding_options]),
                        this.is_paypal_card_enabled || e.push("card"),
                        (this.is_paypal_pay_later_enabled ? t : e).push("paylater"),
                        (i = {
                            components: this.is_paypal_pay_later_enabled ? "buttons,messages" : "buttons",
                            currency: this.get_store_currency(),
                            intent: this.is_single_use() ? this.paypal_intent : "tokenize",
                            vault: !this.is_single_use(),
                            commit: this.button_is_pay_now(),
                        }),
                        this.force_buyer_country && (i["buyer-country"] = this.force_buyer_country),
                        t.length && (i["enable-funding"] = t.join(",")),
                        e.length && (i["disable-funding"] = e.join(",")),
                        i
                    );
                }
            }),
            _(document.body).trigger("wc_braintree_paypal_payment_form_handler_loaded"),
            (window.WC_Braintree_PayPal_Cart_Handler = class extends WC_Braintree_PayPal_Payment_Form_Handler {
                constructor(e) {
                    super(e),
                        (this.is_paypal_card_enabled = !1),
                        (this.set_payment_method_nonce = e.set_payment_method_nonce),
                        (this.cart_handler_url = e.cart_handler_url),
                        (this.form = _("form.woocommerce-cart-form")),
                        (this.form_ui_selector = ""),
                        this.setup_braintree(),
                        _(document.body).on("updated_cart_totals", () => this.setup_braintree());
                }
                button_is_pay_now() {
                    return !1;
                }
                set_payment_method(e) {
                    if (null != e.nonce)
                        return (
                            (e.wp_nonce = this.set_payment_method_nonce),
                            _.ajax({ type: "POST", url: this.cart_handler_url, data: e, dataType: "json" })
                                .done((e) => {
                                    if ((this.log("Cart response received.", e), null != e.redirect_url)) return (window.location = e.redirect_url);
                                })
                                .fail((e) => this.log("Error setting the PayPal cart data.", e, "error"))
                                .always(() => this.unblock_ui())
                        );
                }
                is_single_use() {
                    return "1" === _("input[name=wc_braintree_paypal_single_use]").val();
                }
                has_payment_nonce() {
                    return !1;
                }
            }),
            _(document.body).trigger("wc_braintree_paypal_cart_handler_loaded"),
            (r = window.WC_Braintree_PayPal_Product_Button_Handler = class extends WC_Braintree_PayPal_Payment_Form_Handler {
                constructor(e) {
                    super(e),
                        (this.do_integration_ready = this.do_integration_ready.bind(this)),
                        (this.validate_product_button = this.validate_product_button.bind(this)),
                        (this.validate_product_data = this.validate_product_data.bind(this)),
                        (this.is_paypal_card_enabled = !1),
                        (this.product_checkout_nonce = e.product_checkout_nonce),
                        (this.product_checkout_url = e.product_checkout_url),
                        (this.is_product_page = e.is_product_page),
                        (this.validate_product_url = e.validate_product_url),
                        (this.validate_product_nonce = e.validate_product_nonce),
                        (this.should_validate_product_data = e.should_validate_product_data),
                        (this.form = _("form.woocommerce-cart-form")),
                        (this.form_ui_selector = ""),
                        this.is_product_page && this.handle_product_page(),
                        this.setup_braintree(),
                        _(document.body).on("updated_cart_totals", () => this.setup_braintree());
                }
                handle_product_page() {
                    return (
                        (this.product_form = { element: _("form.cart"), is_variable: _("form.cart").hasClass("variations_form") }),
                        this.should_validate_product_data && this.product_form.element.on("change", this.validate_product_button),
                        this.product_form.is_variable && _(document.body).on("woocommerce_variation_has_changed", this.validate_product_button),
                        this.validate_product_button()
                    );
                }
                do_integration_ready() {
                    if ((n(this, r), super.do_integration_ready(), this.is_product_page)) return this.validate_product_button();
                }
                validate_product_button() {
                    if ((n(this, r), this.product_form.is_variable && this.product_form.element.find(".single_add_to_cart_button").is(".disabled"))) this.hide_button();
                    else {
                        if (!this.should_validate_product_data) return this.show_button();
                        this.validate_product_data(this.show_button, this.hide_button);
                    }
                }
                validate_product_data(t, i) {
                    return (
                        n(this, r),
                        _.ajax({ type: "POST", url: this.validate_product_url, data: { wp_nonce: this.validate_product_nonce, product_id: _("input[name=wc_braintree_paypal_product_id]").val(), cart_form: _("form.cart").serialize() } })
                            .done((e) => (e.data.is_valid ? (e.data.order_amount && this.maybe_update_order_amount(e.data.order_amount), t) : i)())
                            .fail(i)
                    );
                }
                hide_button() {
                    return _("#wc_braintree_paypal_container, #wc_braintree_paypal_pay_later_messaging_container").slideUp();
                }
                show_button() {
                    return _("#wc_braintree_paypal_container, #wc_braintree_paypal_pay_later_messaging_container").slideDown();
                }
                maybe_update_order_amount(e) {
                    if (parseFloat(e) !== parseFloat(this.get_order_amount())) return _('[name="wc_braintree_paypal_amount"]').val(e), this.refresh_braintree();
                }
                button_is_pay_now() {
                    return !1;
                }
                set_payment_method(e) {
                    if (null != e.nonce)
                        return (
                            ((e = e).wp_nonce = this.product_checkout_nonce),
                            (e.product_id = _("input[name=wc_braintree_paypal_product_id]").val()),
                            (e.cart_form = _("form.cart").serialize()),
                            _.ajax({ type: "POST", url: this.product_checkout_url, data: e, dataType: "json" })
                                .done((e) => {
                                    if ((this.log("Cart response received.", e), null != e.redirect_url)) return (window.location = e.redirect_url);
                                })
                                .fail((e) => this.log("Error setting the PayPal cart data.", e, "error"))
                                .always(() => this.unblock_ui())
                        );
                }
                is_single_use() {
                    return "1" === _("input[name=wc_braintree_paypal_single_use]").val();
                }
                has_payment_nonce() {
                    return !1;
                }
            }),
            _(document.body).trigger("wc_braintree_paypal_product_button_handler_loaded")
        );
    });
  }.call(this);