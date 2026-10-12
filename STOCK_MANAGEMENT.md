# D-TEL Stock Management

## Customer website
- Product stock quantities are NOT displayed to customers.
- Customer pages do not show `units left`, `X in stock`, or stock-count labels.
- The Add to Cart / Quick Order action is disabled when the database stock is zero, so customers cannot intentionally order an unavailable item.

## Admin panel
- Product stock quantity is visible only in the Admin Product Inventory table.
- Admin can update stock using Edit Product or Quick Toggle Stock.
- When a product reaches stock `0`, a persistent **Stock Notifications** panel appears in the Admin Panel.
- The alert has no dismiss button.
- The alert remains visible after page refreshes and while the Admin Panel is open.
- The alert disappears only after that product's stock is updated to a value greater than `0` in the database/admin inventory.
- The panel automatically refreshes from MySQL approximately every 10 seconds while the Admin Panel is open.

## Database
Database name: `dtel_mobile_shop`

Product inventory is stored in:
`product.stock`
