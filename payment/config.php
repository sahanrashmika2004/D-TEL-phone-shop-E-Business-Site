<?php
// D-TEL PayHere configuration.
// IMPORTANT: Never put the Merchant Secret in JavaScript, HTML, GitHub, screenshots or chat.

$PAYHERE_ENV = 'sandbox'; // sandbox by default for local testing; use live with approved live credentials
$PAYHERE_MERCHANT_ID = '1238431'; // Merchant ID is not a secret
$PAYHERE_MERCHANT_SECRET = ''; // Keep empty here; set secret in payment/config.local.php

// Optional private override (recommended). Copy config.local.php.example -> config.local.php.
$localConfig = __DIR__ . '/config.local.php';
if (is_file($localConfig)) { require $localConfig; }

$PAYHERE_CHECKOUT_URL = ($PAYHERE_ENV === 'live')
    ? 'https://www.payhere.lk/pay/checkout'
    : 'https://sandbox.payhere.lk/pay/checkout';

if (!function_exists('payhere_is_configured')) {
    function payhere_is_configured(): bool {
        global $PAYHERE_MERCHANT_ID, $PAYHERE_MERCHANT_SECRET;
        return trim((string)$PAYHERE_MERCHANT_ID) !== ''
            && trim((string)$PAYHERE_MERCHANT_SECRET) !== '';
    }
}
?>
