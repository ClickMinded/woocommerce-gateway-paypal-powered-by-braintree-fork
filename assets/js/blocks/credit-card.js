!function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=11)}([function(e,t){e.exports=window.wp.element},function(e,t){e.exports=window.wp.i18n},function(e,t){e.exports=window.wp.data},function(e,t){e.exports=window.wc.blocksCheckout},function(e,t){e.exports=window.wp.htmlEntities},function(e,t){e.exports=window.wc.wcBlocksRegistry},function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return a}));const r=(e,t,n)=>{const r=new FormData;return r.append("action",`wc_${t}_get_client_token`),r.append("nonce",n),fetch(e,{method:"POST",body:r}).then(e=>e.json()).then(e=>{if(e&&!e.success){const t=e.data&&e.data.message||"";throw new Error("Could not retrieve the client token via AJAX: "+t)}if(e&&e.success&&e.data)return e.data})},a=(e,t)=>{if(t&&t.nonce)return fetch(e,{method:"POST",body:o(t)}).then(e=>e.json())};function o(e,t,n){const r=t||new FormData;for(const t in e){if(!e.hasOwnProperty(t)||!e[t])continue;const a=n?`${n}[${t}]`:t;"object"==typeof e[t]?o(e[t],r,a):r.append(a,e[t])}return r}},function(e,t){e.exports=window.wc.wcSettings},function(e,t){function n(){return e.exports=n=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},e.exports.__esModule=!0,e.exports.default=e.exports,n.apply(this,arguments)}e.exports=n,e.exports.__esModule=!0,e.exports.default=e.exports},,,function(e,t,n){"use strict";n.r(t);var r=n(5),a=n(0),o=n(1),s=n(2);const c="braintree-credit-card";var i=n(7);let d=null;const l=()=>{if(null!==d)return d;const e=Object(i.getSetting)("braintree_credit_card_data",null);if(!e)throw new Error("Braintree Credit Card initialization data is not available");return d={ajaxUrl:e.ajax_url||"",cartContainsSubscription:e.cart_contains_subscription||!1,clientTokenNonce:e.client_token_nonce||"",cscRequired:!1!==e.csc_required,debug:e.debug||!1,description:e.description||"",enabledCardTypes:e.enabled_card_types||[],fieldsErrorMessages:e.fields_error_messages||{},hostedFieldsStyles:e.hosted_fields_styles||{},icons:e.icons||{},integrationErrorMessage:e.integration_error_message||"Unknown error",isTestEnvironment:e.is_test_environment||!1,isAdvancedFraudTool:e.is_advanced_fraud_tool||!1,orderTotal3DSecure:e.order_total_for_3ds||0,paymentErrorMessage:e.payment_error_message||"Unknown error",showSavedCards:e.show_saved_cards||!1,showSaveOption:e.show_save_option||!1,supports:e.supports||{},title:e.title||"",threeds:e.threeds||{},tokenDataNonce:e.token_data_nonce||"",tokenizationForced:e.tokenization_forced||!1},d},u=function(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];const{cscRequired:t,hostedFieldsStyles:n}=l(),r={styles:{...n,input:{"font-size":"16px","line-height":"1.375"},"::placeholder":{color:"transparent"},":focus::placeholder":{color:"#757575"},".invalid":{color:"#cc1818"}},fields:{}};if(e||(r.fields={number:{selector:"#wc-braintree-credit-card-account-number-hosted",placeholder:"•••• •••• •••• ••••"},expirationDate:{selector:"#wc-braintree-credit-card-expiry-hosted",placeholder:Object(o.__)("MM / YY","woocommerce-gateway-paypal-powered-by-braintree")}}),t){const t=e?"#wc-braintree-credit-card-csc-hosted-token":"#wc-braintree-credit-card-csc-hosted";r.fields.cvv={selector:t,placeholder:Object(o.__)("CSC","woocommerce-gateway-paypal-powered-by-braintree")}}return r},p=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];const n=[],{fieldsErrorMessages:r,cscRequired:a}=l();if(!e||!e.type)return e.message||"";if("CUSTOMER"===e.type)switch(e.code){case"HOSTED_FIELDS_FIELDS_EMPTY":t||(n.push(r.card_number_required),n.push(r.card_expirationDate_required)),a&&n.push(r.card_cvv_required);break;case"HOSTED_FIELDS_FIELDS_INVALID":if(e.details&&e.details.invalidFieldKeys)for(const t of e.details.invalidFieldKeys)n.push(r[`card_${t}_invalid`]||"");break;default:if(n.push(e.message||""),n.push(e.error&&e.error.message||""),e.details&&e.details.originalError){const t=p(e.details.originalError);t&&n.push(t)}}else"NETWORK"===e.type&&e.details&&e.details.originalError&&e.details.originalError.error&&n.push(e.details.originalError.error.message||"");return n.length?n.filter(e=>e).join(". "):""},m=async e=>{const{ajaxUrl:t,tokenDataNonce:n,paymentErrorMessage:r}=l(),a=new FormData;a.append("action","wc_braintree_credit_card_get_token_data"),a.append("token_id",e),a.append("nonce",n);const o=await fetch(t,{method:"POST",body:a}),s=await o.json();if(s&&!s.success){const e=s.data&&s.data.message||r;throw new Error(e)}if(s&&s.success&&s.data)return s.data;throw new Error(r)},b=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;l().debug&&(console.log("Braintree (Credit Card): "+e),t&&console.log(t))},y=()=>{const{icons:e={}}=l();return Object.entries(e).map(e=>{let[t,{src:n,alt:r}]=e;return{id:t,src:n,alt:r}})};var g=n(8),w=n.n(g),h=n(6);const{ajaxUrl:f,clientTokenNonce:_,tokenizationForced:E,threeds:O,isAdvancedFraudTool:j,cartContainsSubscription:v,orderTotal3DSecure:S,cscRequired:C}=l(),k=e=>{let{billing:t,shippingData:{shippingAddress:n},shouldSavePayment:r,token:o=null}=e;const{cartTotal:s,currency:i}=t,d=(s.value/10**i.minorUnit).toFixed(2),[p,m]=Object(a.useState)(""),[y,g]=Object(a.useState)(""),[w,k]=Object(a.useState)(null),[D,x]=Object(a.useState)(null),T=Object(a.useMemo)(()=>!r&&!E,[r]),M=!!o,F=Object(a.useCallback)(async()=>{const{braintree:e}=window;let t,n,r;const a=O&&O.enabled&&e&&e.threeDSecure,o=await Object(h.a)(f,"braintree_credit_card",_);b("Creating client");const s=await e.client.create({authorization:o});return b("Client Ready"),M&&!C||(b("Creating integration"),r=await e.hostedFields.create({...u(M),client:s}),k(r),(e=>{function t(e,t){const n=e.fields[e.emittedBy];n&&n.container.classList.add(t)}function n(e,t){const n=e.fields[e.emittedBy];n&&n.container.classList.remove(t)}e.on("focus",e=>{t(e,"focused")}),e.on("blur",e=>{const r=e.fields[e.emittedBy];n(e,"focused"),r.isEmpty&&t(e,"empty")}),e.on("empty",e=>{t(e,"empty")}),e.on("notEmpty",(function(e){n(e,"empty")})),e.on("cardTypeChange",(function(e){if(!e.cards)return;const t=document.getElementById("wc-braintree-credit-card-account-number-hosted");if(t.classList.forEach(e=>{e.startsWith("card-type-")&&t.classList.remove(e)}),!e.cards.length)return t.classList.add("card-type-invalid");if(1===e.cards.length){const n=e.cards[0],{enabledCardTypes:r}=l();n.type&&r.includes(n.type)?t.classList.add("card-type-"+n.type):t.classList.add("card-type-invalid")}}))})(r),b("Integration ready")),j&&e&&e.dataCollector&&(t=await e.dataCollector.create({client:s}),t&&t.deviceData&&g(t.deviceData)),a&&s.getConfiguration().gatewayConfiguration.threeDSecureEnabled&&(n=await e.threeDSecure.create({version:2,client:s}),x(n)),{hostedFields:r,dataCollector:t,threeDSecure:n}},[M]),A=Object(a.useMemo)(()=>{const e={amount:d.toString(),email:t.billingData.email||"",billingAddress:{givenName:t.billingData.first_name||"",surname:t.billingData.last_name||"",phoneNumber:t.billingData.phone||"",streetAddress:t.billingData.address_1||"",extendedAddress:t.billingData.address_2||"",locality:t.billingData.city||"",region:t.billingData.state.length<=2?t.billingData.state:"",postalCode:t.billingData.postcode||"",countryCodeAlpha2:t.billingData.country.length<=2?t.billingData.country:""},additionalInformation:{shippingGivenName:n.first_name||"",shippingSurname:n.last_name||"",shippingPhone:n.phone||"",shippingAddress:{streetAddress:n.address_1||"",extendedAddress:n.address_2||"",locality:n.city||"",region:n.state.length<=2?n.state:"",postalCode:n.postcode||"",countryCodeAlpha2:n.country.length<=2?n.country:""}}};return v&&(e.challengeRequested=!0,"0.00"===d&&S&&(e.amount=S.toFixed(2))),e},[d,t.billingData,n]),R=Object(a.useCallback)((e,t)=>(b("Verifying 3D Secure.",A),D.verifyCard({...A,nonce:e,bin:t,onLookupComplete:(e,t)=>{b("3DS lookup complete",e),t()}})),[D,A]),I=Object(a.useCallback)(()=>{const e={wc_braintree_device_data:y};return T||(e[`wc-${c}-tokenize-payment-method`]=!0),p&&(e[`wc-${c}-test-amount`]=p),e},[y,T,p]);return{testAmount:p,setTestAmount:m,setupIntegration:F,getPaymentMethodData:I,verify3DSecure:R,hostedFieldsInstance:w,threeDSecureInstance:D}};var D=n(3);const{fieldsErrorMessages:x,cscRequired:T}=l(),M=e=>{const{components:{LoadingMask:t},isLoaded:n,hostedFieldsInstance:r,token:s=null}=e,[i,d]=Object(a.useState)({number:"",expirationDate:"",cvv:""});return Object(a.useEffect)(()=>{r&&r.on("validityChange",(function(e){const t=e.fields[e.emittedBy];t.isValid||t.isPotentiallyValid?(d(t=>({...t,[e.emittedBy]:""})),t.container.classList.remove("has-error")):(d(t=>({...t,[e.emittedBy]:x[`card_${e.emittedBy}_invalid`]||Object(o.sprintf)(/** translators: Placeholders: %s - invalid field name */
Object(o.__)("%s is invalid","woocommerce-gateway-paypal-powered-by-braintree"),e.emittedBy)})),t.container.classList.add("has-error"))}))},[r]),Object(a.createElement)(t,{isLoading:!n,showSpinner:!0},Object(a.createElement)("div",{className:"wc-block-card-elements payment_method_braintree_credit_card"},!s&&Object(a.createElement)(a.Fragment,null,Object(a.createElement)("div",{className:"wc-block-gateway-container wc-card-number-element"},Object(a.createElement)("div",{id:`wc-${c}-account-number-hosted`,className:"wc-block-gateway-input empty wc-braintree-hosted-field-card-number"}),Object(a.createElement)("label",{htmlFor:`wc-${c}-account-number-hosted`},Object(o.__)("Card Number","woocommerce-gateway-paypal-powered-by-braintree")),Object(a.createElement)(D.ValidationInputError,{errorMessage:i.number})),Object(a.createElement)("div",{className:"wc-block-gateway-container wc-card-expiry-element"},Object(a.createElement)("div",{id:`wc-${c}-expiry-hosted`,className:"wc-block-gateway-input empty wc-braintree-hosted-field-expiry"}),Object(a.createElement)("label",{htmlFor:`wc-${c}-expiry-hosted`},Object(o.__)("Expiration (MMYY)","woocommerce-gateway-paypal-powered-by-braintree")),Object(a.createElement)(D.ValidationInputError,{errorMessage:i.expirationDate}))),T&&Object(a.createElement)("div",{className:"wc-block-gateway-container wc-card-cvc-element"},Object(a.createElement)("div",{id:`wc-${c}-csc-hosted${s?"-token":""}`,className:"wc-block-gateway-input empty wc-braintree-hosted-field-csc"}),Object(a.createElement)("label",{htmlFor:`wc-${c}-csc-hosted${s?"-token":""}`},Object(o.__)("Card Security Code","woocommerce-gateway-paypal-powered-by-braintree")),Object(a.createElement)(D.ValidationInputError,{errorMessage:i.cvv}))))};var F=n(4);const{threeds:A,integrationErrorMessage:R,paymentErrorMessage:I,cscRequired:L}=l(),{braintree:P}=window,N=e=>{let{checkoutFormHandler:t,eventRegistration:n,emitResponse:r,token:o=null}=e;const{onPaymentProcessing:s,onCheckoutAfterProcessingWithError:i,onCheckoutAfterProcessingWithSuccess:d}=n,{getPaymentMethodData:l,hostedFieldsInstance:u,verify3DSecure:y}=t;return function(e,t,n,r,o){let s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:null;Object(a.useEffect)(()=>{const a={type:t.responseTypes.ERROR,messageContext:t.noticeContexts.PAYMENTS},i=A&&A.enabled&&P&&P.threeDSecure,d=!(s&&!L);let l=!1;return e(async()=>{if(d&&!o)return{...a,message:R};try{const e=n();let u,p,y,g;if(d){const t=await o.tokenize();if([u,p,y,g]=[t.nonce,t.details.bin,t.details.cardType,t.type],!u)return{...a,message:t.message};e.wc_braintree_credit_card_payment_nonce=u}if(s)try{const t=await m(s);t&&t.nonce&&(u=t.nonce,p=t.bin,l=!0),e.token=t.token,e[`wc-${c}-payment-token`]=t.token}catch(e){return{...a,message:e.message||I}}if(i&&(s&&l||"CreditCard"===g&&A.card_types.includes(y))){const t=await r(u,p);if(b("3D Secure Response received",t),A.liability_shift_always_required&&!t.liabilityShifted)return{...a,message:A.liability_shift_message};e[`wc-${c}-card-type`]=s?"":y.replace(" ","").toLowerCase(),e[`wc-${c}-3d-secure-enabled`]="1",e[`wc-${c}-3d-secure-verified`]="1",e.wc_braintree_credit_card_payment_nonce=t.nonce}return{type:t.responseTypes.SUCCESS,meta:{paymentMethodData:e}}}catch(e){b("Payment Error: "+e.message,e);const t=p(e,s)||e.message;return{...a,message:Object(F.decodeEntities)(t)}}})},[t.responseTypes.SUCCESS,t.responseTypes.ERROR,t.noticeContexts.PAYMENTS,e,n,o,r,s])}(s,r,l,y,u,o),((e,t,n)=>{Object(a.useEffect)(()=>{const r=e=>{let t={type:n.responseTypes.SUCCESS};const{paymentStatus:r,paymentDetails:a}=e.processingResponse;return r===n.responseTypes.FAIL&&a.result===n.responseTypes.FAIL&&a.message&&(t={type:n.responseTypes.FAIL,message:a.message,messageContext:n.noticeContexts.PAYMENTS,retry:!0}),t},a=e(r),o=t(r);return()=>{a(),o()}},[e,t,n.noticeContexts.PAYMENTS,n.responseTypes.FAIL,n.responseTypes.SUCCESS])})(i,d,r),null},{description:$,isTestEnvironment:q}=l(),B=e=>{let{testAmount:t,setTestAmount:n}=e;return Object(a.createElement)(a.Fragment,null,!!q&&Object(a.createElement)("span",null,Object(o.__)("TEST MODE ENABLED","woocommerce-gateway-paypal-powered-by-braintree")),Object(a.createElement)("p",null,Object(F.decodeEntities)($||""),Object(a.createElement)("br",null),!!q&&Object(a.createElement)("span",{dangerouslySetInnerHTML:{__html:Object(o.__)("Test credit card numbers: <code>378282246310005</code> or <code>4111111111111111</code>","woocommerce-gateway-paypal-powered-by-braintree")}})),!!q&&Object(a.createElement)(a.Fragment,null,Object(a.createElement)(D.ValidatedTextInput,{id:`wc-${c}-test-amount`,type:"text",label:Object(o.__)("Test Amount","woocommerce-gateway-paypal-powered-by-braintree"),value:t,onChange:n}),Object(a.createElement)("p",{style:{fontSize:"10px"},dangerouslySetInnerHTML:{__html:Object(o.sprintf)(/** translators: Placeholders: %1$s - <a> tag, %2$s - </a> tag */
Object(o.__)("Enter a %1$stest amount%2$s to trigger a specific error response, or leave blank to use the order total.","woocommerce-gateway-paypal-powered-by-braintree"),'<a href="https://developers.braintreepayments.com/reference/general/testing/php#test-amounts">',"</a>")}})))},{integrationErrorMessage:U}=l(),z=y(),Y=e=>{const{emitResponse:t,eventRegistration:n}=e,{PaymentMethodIcons:r}=e.components,o=k(e),{setupIntegration:s,hostedFieldsInstance:c,testAmount:i,setTestAmount:d}=o,[l,u]=Object(a.useState)(""),[p,m]=Object(a.useState)(!1);return Object(a.useEffect)(()=>{let e,t,n;return async function(){try{const{hostedFields:r,dataCollector:a,threeDSecure:o}=await s();[e,t,n]=[r,a,o],m(!0)}catch(e){b("Integration Error: "+e.message,e),u(U)}}(),()=>{m(!1),e&&e.teardown(),t&&t.teardown(),n&&n.teardown()}},[s]),l?Object(a.createElement)("div",{className:"woocommerce-error"},l):Object(a.createElement)(a.Fragment,null,Object(a.createElement)(B,{testAmount:i,setTestAmount:d}),Object(a.createElement)(M,w()({},e,{isLoaded:p,hostedFieldsInstance:c})),!!r&&!!z.length&&Object(a.createElement)(r,{icons:z,align:"left"}),Object(a.createElement)(N,{checkoutFormHandler:o,eventRegistration:n,emitResponse:t}))},{cscRequired:V,integrationErrorMessage:H}=l(),W=y(),{title:K,showSavedCards:G,showSaveOption:J,supports:X}=l(),Q=e=>{let{RenderedComponent:t,...n}=e;return Object(s.select)("core/editor")?null:Object(a.createElement)(t,n)};var Z={name:"braintree_credit_card",label:Object(a.createElement)(e=>{const{PaymentMethodLabel:t}=e.components;return Object(a.createElement)(t,{text:K})},null),ariaLabel:Object(o.__)("Braintree CreditCard Payment Method","woocommerce-gateway-paypal-powered-by-braintree"),canMakePayment:()=>!0,content:Object(a.createElement)(Q,{RenderedComponent:Y}),edit:Object(a.createElement)(Q,{RenderedComponent:Y}),savedTokenComponent:Object(a.createElement)(Q,{RenderedComponent:e=>{const{emitResponse:t,eventRegistration:n,token:r}=e,s=k(e),{setupIntegration:c,hostedFieldsInstance:i}=s,[d,l]=Object(a.useState)(""),[u,p]=Object(a.useState)(!1);return Object(a.useEffect)(()=>{let e,t,n;return async function(){try{const{hostedFields:r,dataCollector:a,threeDSecure:o}=await c();[e,t,n]=[r,a,o],p(!0)}catch(e){b("Integration Error: "+e.message,e),l(H)}}(),()=>{p(!1),e&&e.teardown(),t&&t.teardown(),n&&n.teardown()}},[c]),d?Object(a.createElement)("div",{className:"woocommerce-error"},d):Object(a.createElement)("div",{className:"wc-braintree-hosted-fields-saved-token is-small"},V&&Object(a.createElement)("p",{className:"wc-block-components-checkout-step__description"},Object(o.__)("Card Security Code is required to make payments using saved cards","woocommerce-gateway-paypal-powered-by-braintree")),Object(a.createElement)(M,w()({},e,{token:r,isLoaded:u,hostedFieldsInstance:i})),Object(a.createElement)(N,{checkoutFormHandler:s,eventRegistration:n,emitResponse:t,token:r}))}}),icons:W,supports:{showSavedCards:G||!1,showSaveOption:J||!1,features:X||[]}};Object(r.registerPaymentMethod)(Z)}]);