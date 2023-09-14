!function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=10)}([function(e,t){e.exports=window.wp.element},function(e,t){e.exports=window.wp.i18n},function(e,t){e.exports=window.wc.blocksCheckout},function(e,t){e.exports=window.wp.htmlEntities},function(e,t){e.exports=window.wc.wcBlocksRegistry},function(e,t){e.exports=window.wp.data},function(e,t){e.exports=window.wc.wcSettings},function(e,t,r){"use strict";r.d(t,"a",(function(){return n}));const n=(e,t,r)=>{const n=new FormData;return n.append("action",`wc_${t}_get_client_token`),n.append("nonce",r),fetch(e,{method:"POST",body:n}).then(e=>e.json()).then(e=>{if(e&&!e.success){const t=e.data&&e.data.message||"";throw new Error("Could not retrieve the client token via AJAX: "+t)}if(e&&e.success&&e.data)return e.data})}},function(e,t){function r(){return e.exports=r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},e.exports.__esModule=!0,e.exports.default=e.exports,r.apply(this,arguments)}e.exports=r,e.exports.__esModule=!0,e.exports.default=e.exports},,function(e,t,r){"use strict";r.r(t);var n=r(4),a=r(0),o=r(1),s=r(5);const c="braintree-credit-card";var i=r(6);let d=null;const l=()=>{if(null!==d)return d;const e=Object(i.getSetting)("braintree_credit_card_data",null);if(!e)throw new Error("Braintree Credit Card initialization data is not available");return d={ajaxUrl:e.ajax_url||"",cartContainsSubscription:e.cart_contains_subscription||!1,clientTokenNonce:e.client_token_nonce||"",cscRequired:!1!==e.csc_required,debug:e.debug||!1,description:e.description||"",enabledCardTypes:e.enabled_card_types||[],fieldsErrorMessages:e.fields_error_messages||{},hostedFieldsStyles:e.hosted_fields_styles||{},icons:e.icons||{},integrationErrorMessage:e.integration_error_message||"Unknown error",isTestEnvironment:e.is_test_environment||!1,isAdvancedFraudTool:e.is_advanced_fraud_tool||!1,orderTotal3DSecure:e.order_total_for_3ds||0,paymentErrorMessage:e.payment_error_message||"Unknown error",showSavedCards:e.show_saved_cards||!1,showSaveOption:e.show_save_option||!1,supports:e.supports||{},title:e.title||"",threeds:e.threeds||{},tokenDataNonce:e.token_data_nonce||"",tokenizationForced:e.tokenization_forced||!1},d},u=function(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];const{cscRequired:t,hostedFieldsStyles:r}=l(),n={styles:{...r,input:{"font-size":"16px","line-height":"1.375"},"::placeholder":{color:"transparent"},":focus::placeholder":{color:"#757575"},".invalid":{color:"#cc1818"}},fields:{}};if(e||(n.fields={number:{selector:"#wc-braintree-credit-card-account-number-hosted",placeholder:"•••• •••• •••• ••••"},expirationDate:{selector:"#wc-braintree-credit-card-expiry-hosted",placeholder:Object(o.__)("MM / YY","woocommerce-gateway-paypal-powered-by-braintree")}}),t){const t=e?"#wc-braintree-credit-card-csc-hosted-token":"#wc-braintree-credit-card-csc-hosted";n.fields.cvv={selector:t,placeholder:Object(o.__)("CSC","woocommerce-gateway-paypal-powered-by-braintree")}}return n},p=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];const r=[],{fieldsErrorMessages:n,cscRequired:a}=l();if(!e||!e.type)return e.message||"";if("CUSTOMER"===e.type)switch(e.code){case"HOSTED_FIELDS_FIELDS_EMPTY":t||(r.push(n.card_number_required),r.push(n.card_expirationDate_required)),a&&r.push(n.card_cvv_required);break;case"HOSTED_FIELDS_FIELDS_INVALID":if(e.details&&e.details.invalidFieldKeys)for(const t of e.details.invalidFieldKeys)r.push(n[`card_${t}_invalid`]||"");break;default:if(r.push(e.message||""),r.push(e.error&&e.error.message||""),e.details&&e.details.originalError){const t=p(e.details.originalError);t&&r.push(t)}}else"NETWORK"===e.type&&e.details&&e.details.originalError&&e.details.originalError.error&&r.push(e.details.originalError.error.message||"");return r.length?r.filter(e=>e).join(". "):""},m=async e=>{const{ajaxUrl:t,tokenDataNonce:r,paymentErrorMessage:n}=l(),a=new FormData;a.append("action","wc_braintree_credit_card_get_token_data"),a.append("token_id",e),a.append("nonce",r);const o=await fetch(t,{method:"POST",body:a}),s=await o.json();if(s&&!s.success){const e=s.data&&s.data.message||n;throw new Error(e)}if(s&&s.success&&s.data)return s.data;throw new Error(n)},b=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;l().debug&&(console.log("Braintree (Credit Card): "+e),t&&console.log(t))},y=()=>{const{icons:e={}}=l();return Object.entries(e).map(e=>{let[t,{src:r,alt:n}]=e;return{id:t,src:r,alt:n}})};var g=r(8),w=r.n(g),h=r(7);const{braintree:f}=window,{ajaxUrl:_,clientTokenNonce:E,tokenizationForced:O,threeds:j,isAdvancedFraudTool:v,cartContainsSubscription:S,orderTotal3DSecure:C,cscRequired:k}=l(),D=e=>{let{billing:t,shippingData:{shippingAddress:r},shouldSavePayment:n,token:o=null}=e;const{cartTotal:s,currency:i}=t,d=(s.value/10**i.minorUnit).toFixed(2),[p,m]=Object(a.useState)(""),[y,g]=Object(a.useState)(""),[w,D]=Object(a.useState)(null),[x,T]=Object(a.useState)(null),M=Object(a.useMemo)(()=>!n&&!O,[n]),F=!!o,A=Object(a.useCallback)(async()=>{let e,t,r;const n=j&&j.enabled&&f&&f.threeDSecure,a=await Object(h.a)(_,"braintree_credit_card",E);b("Creating client");const o=await f.client.create({authorization:a});return b("Client Ready"),F&&!k||(b("Creating integration"),r=await f.hostedFields.create({...u(F),client:o}),D(r),(e=>{function t(e,t){const r=e.fields[e.emittedBy];r&&r.container.classList.add(t)}function r(e,t){const r=e.fields[e.emittedBy];r&&r.container.classList.remove(t)}e.on("focus",e=>{t(e,"focused")}),e.on("blur",e=>{const n=e.fields[e.emittedBy];r(e,"focused"),n.isEmpty&&t(e,"empty")}),e.on("empty",e=>{t(e,"empty")}),e.on("notEmpty",(function(e){r(e,"empty")})),e.on("cardTypeChange",(function(e){if(!e.cards)return;const t=document.getElementById("wc-braintree-credit-card-account-number-hosted");if(t.classList.forEach(e=>{e.startsWith("card-type-")&&t.classList.remove(e)}),!e.cards.length)return t.classList.add("card-type-invalid");if(1===e.cards.length){const r=e.cards[0],{enabledCardTypes:n}=l();r.type&&n.includes(r.type)?t.classList.add("card-type-"+r.type):t.classList.add("card-type-invalid")}}))})(r),b("Integration ready")),v&&f&&f.dataCollector&&(e=await f.dataCollector.create({client:o}),e&&e.deviceData&&g(e.deviceData)),n&&o.getConfiguration().gatewayConfiguration.threeDSecureEnabled&&(t=await f.threeDSecure.create({version:2,client:o}),T(t)),{hostedFields:r,dataCollector:e,threeDSecure:t}},[F]),R=Object(a.useMemo)(()=>{const e={amount:d.toString(),email:t.billingData.email||"",billingAddress:{givenName:t.billingData.first_name||"",surname:t.billingData.last_name||"",phoneNumber:t.billingData.phone||"",streetAddress:t.billingData.address_1||"",extendedAddress:t.billingData.address_2||"",locality:t.billingData.city||"",region:t.billingData.state.length<=2?t.billingData.state:"",postalCode:t.billingData.postcode||"",countryCodeAlpha2:t.billingData.country.length<=2?t.billingData.country:""},additionalInformation:{shippingGivenName:r.first_name||"",shippingSurname:r.last_name||"",shippingPhone:r.phone||"",shippingAddress:{streetAddress:r.address_1||"",extendedAddress:r.address_2||"",locality:r.city||"",region:r.state.length<=2?r.state:"",postalCode:r.postcode||"",countryCodeAlpha2:r.country.length<=2?r.country:""}}};return S&&(e.challengeRequested=!0,"0.00"===d&&C&&(e.amount=C.toFixed(2))),e},[d,t.billingData,r]),I=Object(a.useCallback)((e,t)=>(b("Verifying 3D Secure.",R),x.verifyCard({...R,nonce:e,bin:t,onLookupComplete:(e,t)=>{b("3DS lookup complete",e),t()}})),[x,R]),L=Object(a.useCallback)(()=>{const e={wc_braintree_device_data:y};return M||(e[`wc-${c}-tokenize-payment-method`]=!0),p&&(e[`wc-${c}-test-amount`]=p),e},[y,M,p]);return{testAmount:p,setTestAmount:m,setupIntegration:A,getPaymentMethodData:L,verify3DSecure:I,hostedFieldsInstance:w,threeDSecureInstance:x}};var x=r(2);const{fieldsErrorMessages:T,cscRequired:M}=l(),F=e=>{const{components:{LoadingMask:t},isLoaded:r,hostedFieldsInstance:n,token:s=null}=e,[i,d]=Object(a.useState)({number:"",expirationDate:"",cvv:""});return Object(a.useEffect)(()=>{n&&n.on("validityChange",(function(e){const t=e.fields[e.emittedBy];t.isValid||t.isPotentiallyValid?(d(t=>({...t,[e.emittedBy]:""})),t.container.classList.remove("has-error")):(d(t=>({...t,[e.emittedBy]:T[`card_${e.emittedBy}_invalid`]||Object(o.sprintf)(/** translators: Placeholders: %s - invalid field name */
Object(o.__)("%s is invalid","woocommerce-gateway-paypal-powered-by-braintree"),e.emittedBy)})),t.container.classList.add("has-error"))}))},[n]),Object(a.createElement)(t,{isLoading:!r,showSpinner:!0},Object(a.createElement)("div",{className:"wc-block-card-elements payment_method_braintree_credit_card"},!s&&Object(a.createElement)(a.Fragment,null,Object(a.createElement)("div",{className:"wc-block-gateway-container wc-card-number-element"},Object(a.createElement)("div",{id:`wc-${c}-account-number-hosted`,className:"wc-block-gateway-input empty wc-braintree-hosted-field-card-number"}),Object(a.createElement)("label",{htmlFor:`wc-${c}-account-number-hosted`},Object(o.__)("Card Number","woocommerce-gateway-paypal-powered-by-braintree")),Object(a.createElement)(x.ValidationInputError,{errorMessage:i.number})),Object(a.createElement)("div",{className:"wc-block-gateway-container wc-card-expiry-element"},Object(a.createElement)("div",{id:`wc-${c}-expiry-hosted`,className:"wc-block-gateway-input empty wc-braintree-hosted-field-expiry"}),Object(a.createElement)("label",{htmlFor:`wc-${c}-expiry-hosted`},Object(o.__)("Expiration (MMYY)","woocommerce-gateway-paypal-powered-by-braintree")),Object(a.createElement)(x.ValidationInputError,{errorMessage:i.expirationDate}))),M&&Object(a.createElement)("div",{className:"wc-block-gateway-container wc-card-cvc-element"},Object(a.createElement)("div",{id:`wc-${c}-csc-hosted${s?"-token":""}`,className:"wc-block-gateway-input empty wc-braintree-hosted-field-csc"}),Object(a.createElement)("label",{htmlFor:`wc-${c}-csc-hosted${s?"-token":""}`},Object(o.__)("Card Security Code","woocommerce-gateway-paypal-powered-by-braintree")),Object(a.createElement)(x.ValidationInputError,{errorMessage:i.cvv}))))};var A=r(3);const{threeds:R,integrationErrorMessage:I,paymentErrorMessage:L,cscRequired:P}=l(),{braintree:N}=window,$=e=>{let{checkoutFormHandler:t,eventRegistration:r,emitResponse:n,token:o=null}=e;const{onPaymentProcessing:s,onCheckoutAfterProcessingWithError:i,onCheckoutAfterProcessingWithSuccess:d}=r,{getPaymentMethodData:l,hostedFieldsInstance:u,verify3DSecure:y}=t;return function(e,t,r,n,o){let s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:null;Object(a.useEffect)(()=>{const a={type:t.responseTypes.ERROR,messageContext:t.noticeContexts.PAYMENTS},i=R&&R.enabled&&N&&N.threeDSecure,d=!(s&&!P);let l=!1;return e(async()=>{if(d&&!o)return{...a,message:I};try{const e=r();let u,p,y,g;if(d){const t=await o.tokenize();if([u,p,y,g]=[t.nonce,t.details.bin,t.details.cardType,t.type],!u)return{...a,message:t.message};e.wc_braintree_credit_card_payment_nonce=u}if(s)try{const t=await m(s);t&&t.nonce&&(u=t.nonce,p=t.bin,l=!0),e.token=t.token,e[`wc-${c}-payment-token`]=t.token}catch(e){return{...a,message:e.message||L}}if(i&&(s&&l||"CreditCard"===g&&R.card_types.includes(y))){const t=await n(u,p);if(b("3D Secure Response received",t),R.liability_shift_always_required&&!t.liabilityShifted)return{...a,message:R.liability_shift_message};e[`wc-${c}-card-type`]=s?"":y.replace(" ","").toLowerCase(),e[`wc-${c}-3d-secure-enabled`]="1",e[`wc-${c}-3d-secure-verified`]="1",e.wc_braintree_credit_card_payment_nonce=t.nonce}return{type:t.responseTypes.SUCCESS,meta:{paymentMethodData:e}}}catch(e){b("Payment Error: "+e.message,e);const t=p(e,s)||e.message;return{...a,message:Object(A.decodeEntities)(t)}}})},[t.responseTypes.SUCCESS,t.responseTypes.ERROR,t.noticeContexts.PAYMENTS,e,r,o,n,s])}(s,n,l,y,u,o),((e,t,r)=>{Object(a.useEffect)(()=>{const n=e=>{let t={type:r.responseTypes.SUCCESS};const{paymentStatus:n,paymentDetails:a}=e.processingResponse;return n===r.responseTypes.FAIL&&a.result===r.responseTypes.FAIL&&a.message&&(t={type:r.responseTypes.FAIL,message:a.message,messageContext:r.noticeContexts.PAYMENTS,retry:!0}),t},a=e(n),o=t(n);return()=>{a(),o()}},[e,t,r.noticeContexts.PAYMENTS,r.responseTypes.FAIL,r.responseTypes.SUCCESS])})(i,d,n),null},{description:q,isTestEnvironment:B}=l(),U=e=>{let{testAmount:t,setTestAmount:r}=e;return Object(a.createElement)(a.Fragment,null,!!B&&Object(a.createElement)("span",null,Object(o.__)("TEST MODE ENABLED","woocommerce-gateway-paypal-powered-by-braintree")),Object(a.createElement)("p",null,Object(A.decodeEntities)(q||""),Object(a.createElement)("br",null),!!B&&Object(a.createElement)("span",{dangerouslySetInnerHTML:{__html:Object(o.__)("Test credit card numbers: <code>378282246310005</code> or <code>4111111111111111</code>","woocommerce-gateway-paypal-powered-by-braintree")}})),!!B&&Object(a.createElement)(a.Fragment,null,Object(a.createElement)(x.ValidatedTextInput,{id:`wc-${c}-test-amount`,type:"text",label:Object(o.__)("Test Amount","woocommerce-gateway-paypal-powered-by-braintree"),value:t,onChange:r}),Object(a.createElement)("p",{style:{fontSize:"10px"},dangerouslySetInnerHTML:{__html:Object(o.sprintf)(/** translators: Placeholders: %1$s - <a> tag, %2$s - </a> tag */
Object(o.__)("Enter a %1$stest amount%2$s to trigger a specific error response, or leave blank to use the order total.","woocommerce-gateway-paypal-powered-by-braintree"),'<a href="https://developers.braintreepayments.com/reference/general/testing/php#test-amounts">',"</a>")}})))},{integrationErrorMessage:z}=l(),Y=y(),V=e=>{const{emitResponse:t,eventRegistration:r}=e,{PaymentMethodIcons:n}=e.components,o=D(e),{setupIntegration:s,hostedFieldsInstance:c,testAmount:i,setTestAmount:d}=o,[l,u]=Object(a.useState)(""),[p,m]=Object(a.useState)(!1);return Object(a.useEffect)(()=>{let e,t,r;return async function(){try{const{hostedFields:n,dataCollector:a,threeDSecure:o}=await s();[e,t,r]=[n,a,o],m(!0)}catch(e){b("Integration Error: "+e.message,e),u(z)}}(),()=>{m(!1),e&&e.teardown(),t&&t.teardown(),r&&r.teardown()}},[s]),l?Object(a.createElement)("div",{className:"woocommerce-error"},l):Object(a.createElement)(a.Fragment,null,Object(a.createElement)(U,{testAmount:i,setTestAmount:d}),Object(a.createElement)(F,w()({},e,{isLoaded:p,hostedFieldsInstance:c})),!!n&&!!Y.length&&Object(a.createElement)(n,{icons:Y,align:"left"}),Object(a.createElement)($,{checkoutFormHandler:o,eventRegistration:r,emitResponse:t}))},{cscRequired:H,integrationErrorMessage:W}=l(),K=y(),{title:G,showSavedCards:J,showSaveOption:X,supports:Q}=l(),Z=e=>{let{RenderedComponent:t,...r}=e;return Object(s.select)("core/editor")?null:Object(a.createElement)(t,r)};var ee={name:"braintree_credit_card",label:Object(a.createElement)(e=>{const{PaymentMethodLabel:t}=e.components;return Object(a.createElement)(t,{text:G})},null),ariaLabel:Object(o.__)("Braintree CreditCard Payment Method","woocommerce-gateway-paypal-powered-by-braintree"),canMakePayment:()=>!0,content:Object(a.createElement)(Z,{RenderedComponent:V}),edit:Object(a.createElement)(Z,{RenderedComponent:V}),savedTokenComponent:Object(a.createElement)(Z,{RenderedComponent:e=>{const{emitResponse:t,eventRegistration:r,token:n}=e,s=D(e),{setupIntegration:c,hostedFieldsInstance:i}=s,[d,l]=Object(a.useState)(""),[u,p]=Object(a.useState)(!1);return Object(a.useEffect)(()=>{let e,t,r;return async function(){try{const{hostedFields:n,dataCollector:a,threeDSecure:o}=await c();[e,t,r]=[n,a,o],p(!0)}catch(e){b("Integration Error: "+e.message,e),l(W)}}(),()=>{p(!1),e&&e.teardown(),t&&t.teardown(),r&&r.teardown()}},[c]),d?Object(a.createElement)("div",{className:"woocommerce-error"},d):Object(a.createElement)("div",{className:"wc-braintree-hosted-fields-saved-token is-small"},H&&Object(a.createElement)("p",{className:"wc-block-components-checkout-step__description"},Object(o.__)("Card Security Code is required to make payments using saved cards","woocommerce-gateway-paypal-powered-by-braintree")),Object(a.createElement)(F,w()({},e,{token:n,isLoaded:u,hostedFieldsInstance:i})),Object(a.createElement)($,{checkoutFormHandler:s,eventRegistration:r,emitResponse:t,token:n}))}}),icons:K,supports:{showSavedCards:J||!1,showSaveOption:X||!1,features:Q||[]}};Object(n.registerPaymentMethod)(ee)}]);