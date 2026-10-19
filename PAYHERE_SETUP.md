# D-TEL Mobile Shop - PayHere Setup

## 1. XAMPP
1. Copy this folder into `C:\xampp\htdocs\`.
2. Start Apache and MySQL.
3. Open `http://localhost/phpmyadmin`.
4. Import `database.sql` and make sure the database is named `dtel_mobile_shop`.
5. Copy `payment/config.local.php.example` to `payment/config.local.php` and add your PayHere settings there. This local file is ignored by Git.

## 2. PayHere
- This project is configured for **PayHere Sandbox**.
- Use the Merchant ID associated with your PayHere account; keep it in `payment/config.local.php`.
- The payment form sends the customer to PayHere. Card number/CVV are not collected by D-TEL.
- The PHP server uses the Merchant Secret from `payment/config.local.php` to generate the PayHere hash.

## 3. Localhost limitation
You can test the checkout redirect from localhost, but PayHere cannot send the server-to-server `notify_url` callback to localhost. For a complete payment-status test, deploy the project to a public HTTPS domain and register that domain in PayHere Integrations, then put the matching Merchant ID and Merchant Secret in `payment/config.local.php`.

## 4. Test flow
Shop -> Add to Cart -> Checkout -> Sign in -> Online Card Payment -> Place Order -> PayHere Sandbox.

After payment, PayHere calls `payment/notify.php`. The script verifies `md5sig` and changes the database payment to `Paid` only for status code `2`.

## 5. Important
Do not put the Merchant Secret into JavaScript, HTML, GitHub, screenshots, or chat. If it was previously exposed, regenerate it in PayHere and use the new secret in `payment/config.local.php`.

## Final D-TEL configuration
- Database: `dtel_mobile_shop`
- PayHere environment: Sandbox by default
- Merchant ID and Merchant Secret: configure these only in the ignored `payment/config.local.php` file.

Online Card Payment uses PayHere's hosted checkout. Card number, expiry and CVV are not collected by D-TEL.

The PayHere notification endpoint verifies merchant ID, md5 signature, currency and the exact order amount before changing an order to Paid. Failed/cancelled PayHere orders restore their reserved stock once.
