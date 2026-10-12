# D-TEL Mobile Shop - PayHere Setup

## 1. XAMPP
1. Copy this folder into `C:\xampp\htdocs\`.
2. Start Apache and MySQL.
3. Open `http://localhost/phpmyadmin`.
4. Import `database.sql` and make sure the database is named `dtel_mobile_shop`.
5. Open `payment/config.php` and enter your PayHere Merchant Secret. Keep it private.

## 2. PayHere
- This project is configured for **PayHere Sandbox**.
- Merchant ID is prefilled as `1238431`; change it if your Sandbox account shows a different ID.
- The payment form sends the customer to PayHere. Card number/CVV are not collected by D-TEL.
- The Merchant Secret is used only on the PHP server to generate the PayHere hash.

## 3. Localhost limitation
You can test the checkout redirect from localhost, but PayHere cannot send the server-to-server `notify_url` callback to localhost. For a complete payment-status test, deploy the project to a public HTTPS domain and register that domain in PayHere Integrations, then put the matching Merchant Secret in `payment/config.php`.

## 4. Test flow
Shop -> Add to Cart -> Checkout -> Sign in -> Online Card Payment -> Place Order -> PayHere Sandbox.

After payment, PayHere calls `payment/notify.php`. The script verifies `md5sig` and changes the database payment to `Paid` only for status code `2`.

## 5. Important
Do not put the Merchant Secret into JavaScript, HTML, GitHub, screenshots, or chat. If it was previously exposed, regenerate it in PayHere and use the new secret.


## Final D-TEL configuration
- Database: `dtel_mobile_shop`
- PayHere environment: Sandbox by default
- Merchant ID: `1238431`
- Merchant Secret: **not included in this ZIP**. Enter your NEW secret in `payment/config.php`, or copy `payment/config.local.php.example` to `payment/config.local.php` and enter it there.
- Never share the Merchant Secret.

Online Card Payment uses PayHere's hosted checkout. Card number, expiry and CVV are not collected by D-TEL.

The PayHere notification endpoint verifies merchant ID, md5 signature, currency and the exact order amount before changing an order to Paid. Failed/cancelled PayHere orders restore their reserved stock once.


## Payment methods included
- Cash on Delivery: order is created in MySQL and payment remains Pending until collected.
- Online Card Payment: redirects to the official PayHere hosted checkout; D-TEL does not collect card numbers or CVV.
- Bank Transfer: creates a Pending order and lets the customer select a deposit-slip file. The current checkout previews the slip in the browser; it does not persist the slip file to the server/database. Confirm the deposit manually before marking it Paid.

## Important before live transactions
This ZIP has the supplied Merchant ID and secret in `payment/config.local.php` and is set to Live. The secret was shared in chat, so rotate it in your PayHere dashboard and replace it in that local file before accepting real payments. Live PayHere status notifications require a public HTTPS domain registered in PayHere; localhost alone cannot receive the server-to-server notification. Do not use real card payments until PayHere has approved the account/domain and the callback has been tested.
