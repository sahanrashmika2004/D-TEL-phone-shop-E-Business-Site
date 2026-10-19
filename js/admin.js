/**
 * D-TEL Mobile & Accessories Hub - Store Administrator Management Panel Engine
 * ICT2142 E-Business Systems Project
 * Supports 3-Image Views, Order Management, Customer Details Modal & MySQL Database Synchronization
 */

document.addEventListener("DOMContentLoaded", async () => {
  const adminProductsTable = document.getElementById("adminProductsTable");
  const adminOrdersTable = document.getElementById("adminOrdersTable");
  const productModalOverlay = document.getElementById("productModalOverlay");
  const orderDetailsModalOverlay = document.getElementById("orderDetailsModalOverlay");

  // Admin Authentication Gate: Ensure user is logged in with admin / Dtel@123
  function checkAdminAuth() {
    if (typeof Auth !== 'undefined' && !Auth.isAdmin()) {
      const layout = document.querySelector(".admin-layout");
      if (layout) layout.style.display = "none";

      let lockScreen = document.getElementById("adminLockScreen");
      if (!lockScreen) {
        lockScreen = document.createElement("div");
        lockScreen.id = "adminLockScreen";
        lockScreen.className = "admin-lock-container";
        lockScreen.innerHTML = `
          <div class="admin-lock-card">
            <div style="width:54px; height:54px; border-radius:14px; background:linear-gradient(135deg, #f59e0b, #d97706); display:inline-flex; align-items:center; justify-content:center; color:#fff; font-size:1.6rem; margin-bottom:1rem; box-shadow:0 0 20px rgba(245,158,11,0.4);">
              <i class="fas fa-lock"></i>
            </div>
            <h2 style="font-size:1.5rem; margin-bottom:0.35rem; color:#fff;">Store Admin Portal</h2>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem;">Enter administrator credentials to manage D-TEL inventory & orders</p>

            <div class="demo-fill-box" style="background:rgba(245,158,11,0.08); border-color:rgba(245,158,11,0.3); text-align:left;">
              <span><i class="fas fa-key" style="color:var(--accent-amber);"></i> <strong>dtel@gmail.com</strong> / <strong>Dtel@123</strong></span>
              <button type="button" class="demo-fill-btn" style="border-color:#f59e0b; color:#f59e0b;" onclick="document.getElementById('adminPageUser').value='dtel@gmail.com'; document.getElementById('adminPagePass').value='Dtel@123';">Auto Fill</button>
            </div>

            <div class="auth-alert" id="adminPageAlert"></div>

            <form id="adminPageLoginForm" onsubmit="window.handleAdminPageLogin(event)">
              <div style="margin-bottom:1rem; text-align:left;">
                <label style="font-size:0.85rem; font-weight:700; color:#fff; display:block; margin-bottom:0.35rem;">Admin Email / Username *</label>
                <input type="text" id="adminPageUser" required value="dtel@gmail.com" placeholder="dtel@gmail.com">
              </div>

              <div style="margin-bottom:1.5rem; text-align:left;">
                <label style="font-size:0.85rem; font-weight:700; color:#fff; display:block; margin-bottom:0.35rem;">Password *</label>
                <input type="password" id="adminPagePass" required placeholder="Dtel@123">
              </div>

              <button type="submit" id="adminPageSubmitBtn" class="btn-primary" style="width:100%; padding:0.9rem; font-size:1rem; font-weight:700; background:linear-gradient(135deg, #f59e0b, #d97706); box-shadow:0 4px 14px rgba(245,158,11,0.35);">
                <i class="fas fa-unlock-alt"></i> Unlock Admin Dashboard
              </button>
            </form>

            <div style="margin-top:1.5rem; border-top:1px solid var(--border-color); padding-top:1rem;">
              <a href="index.html" style="font-size:0.85rem; color:var(--accent-cyan);"><i class="fas fa-arrow-left"></i> Return to Live Store</a>
            </div>
          </div>
        `;
        document.body.prepend(lockScreen);
      }
      return false;
    } else {
      const lockScreen = document.getElementById("adminLockScreen");
      if (lockScreen) lockScreen.remove();
      const layout = document.querySelector(".admin-layout");
      if (layout) layout.style.display = "grid";
      return true;
    }
  }

  // Handle Admin Login submission on admin lock screen
  window.handleAdminPageLogin = async function(e) {
    e.preventDefault();
    const user = document.getElementById("adminPageUser").value.trim();
    const pass = document.getElementById("adminPagePass").value;
    const alertEl = document.getElementById("adminPageAlert");
    const btn = document.getElementById("adminPageSubmitBtn");

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Verifying Admin Access...`;

    const res = await Auth.loginAdmin(user, pass);
    btn.disabled = false;
    btn.innerHTML = `<i class="fas fa-unlock-alt"></i> Unlock Admin Dashboard`;

    if (res.success) {
      if (alertEl) {
        alertEl.className = "auth-alert success";
        alertEl.textContent = "Admin credentials verified! Loading dashboard...";
      }
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } else {
      if (alertEl) {
        alertEl.className = "auth-alert error";
        alertEl.textContent = res.message || "Invalid credentials. Use dtel@gmail.com / Dtel@123";
      }
    }
  };

  // Run gate check
  if (!checkAdminAuth()) {
    return;
  }

  // Metrics elements
  const statRevenue = document.getElementById("statRevenue");
  const statOrders = document.getElementById("statOrders");
  const statProducts = document.getElementById("statProducts");
  const statOutOfStock = document.getElementById("statOutOfStock");

  // Category ID Mapping definition
  const CATEGORY_MAP = {
    "Smartphones": 1,
    "Chargers": 2,
    "Covers": 3,
    "Audio": 4,
    "Power": 5,
    "Accessories": 6
  };

  const CATEGORY_NAMES = {
    1: "Smartphones",
    2: "Chargers",
    3: "Covers",
    4: "Audio",
    5: "Power",
    6: "Accessories"
  };

  // Sync products from MySQL DB if available
  async function syncProductsFromDatabase() {
    if (typeof ApiClient !== "undefined") {
      try {
        const dbProducts = await ApiClient.getProducts();
        if (Array.isArray(dbProducts) && dbProducts.length > 0) {
          const localProducts = StorageDB.getProducts();
          const merged = [...localProducts];

          dbProducts.forEach(dbp => {
            const catName = dbp.category_name || CATEGORY_NAMES[dbp.category_id] || "Smartphones";
            const existingIdx = merged.findIndex(p => p.id == dbp.product_id || p.id === `prod_${dbp.product_id}`);
            const formatted = {
              id: dbp.product_id ? (String(dbp.product_id).startsWith('prod_') ? dbp.product_id : `prod_${dbp.product_id}`) : `prod_${Date.now()}`,
              numericId: dbp.product_id,
              category_id: dbp.category_id || CATEGORY_MAP[catName] || 1,
              name: dbp.product_name,
              category: catName,
              brand: (typeof normalizeBrand === 'function') ? normalizeBrand(dbp.brand) : (dbp.brand || "Generic"),
              model: dbp.model || "",
              price: parseFloat(dbp.price),
              oldPrice: (dbp.original_price && parseFloat(dbp.original_price) > 0) ? parseFloat(dbp.original_price) : (dbp.old_price ? parseFloat(dbp.old_price) : null),
              original_price: (dbp.original_price && parseFloat(dbp.original_price) > 0) ? parseFloat(dbp.original_price) : null,
              offer_price: (dbp.offer_price && parseFloat(dbp.offer_price) > 0) ? parseFloat(dbp.offer_price) : null,
              is_offer: (dbp.is_offer == 1 || dbp.is_offer === true || dbp.is_offer === '1') ? 1 : 0,
              stock: parseInt(dbp.stock),
              description: dbp.description || "",
              specs: dbp.specs || "",
              image: dbp.image || "images/cat-chargers.svg",
              image_2: dbp.image_2 || null,
              image_3: dbp.image_3 || null,
              image2: dbp.image_2 || null,
              image3: dbp.image_3 || null,
              connector: dbp.connector || "USB-C",
              status: dbp.status || "active"
            };

            if (existingIdx >= 0) {
              merged[existingIdx] = { ...merged[existingIdx], ...formatted };
            } else {
              merged.unshift(formatted);
            }
          });

          StorageDB.saveProducts(merged);
        }
      } catch (e) {
        console.warn("Could not sync products from MySQL:", e);
      }
    }
  }

  // Sync orders from MySQL DB
  async function syncOrdersFromDatabase() {
    if (typeof ApiClient !== "undefined" && ApiClient.getOrders) {
      try {
        const dbOrders = await ApiClient.getOrders();
        if (Array.isArray(dbOrders) && dbOrders.length > 0) {
          const localOrders = (typeof StorageDB.getAllOrders === 'function') 
            ? StorageDB.getAllOrders() 
            : (JSON.parse(localStorage.getItem("tz_orders")) || []);

          const merged = [...localOrders];

          dbOrders.forEach(dbo => {
            const dboId = dbo.order_id ? `ORD-${dbo.order_id}` : (dbo.id || `ORD-${Date.now()}`);
            const existingIdx = merged.findIndex(o => 
              (o.order_id && o.order_id == dbo.order_id) || 
              o.id === dboId || 
              o.id == dbo.order_id || 
              (o.db_id && o.db_id == dbo.order_id)
            );

            // Format items
            let items = [];
            if (Array.isArray(dbo.items) && dbo.items.length > 0) {
              items = dbo.items.map(it => ({
                id: it.product_id ? `prod_${it.product_id}` : (it.id || 'prod_1'),
                product_id: it.product_id,
                name: it.product_name || it.name || 'Mobile Product',
                price: parseFloat(it.unit_price || it.price || 0),
                qty: parseInt(it.quantity || it.qty || 1),
                image: it.image || 'images/cat-chargers.svg',
                brand: it.brand || 'D-TEL',
                model: it.model || ''
              }));
            }

            let orderSubtotal = 0;
            if (items.length > 0) {
              orderSubtotal = items.reduce((sum, it) => sum + ((parseFloat(it.price) || 0) * (parseInt(it.qty) || 1)), 0);
            }
            let rawTotal = parseFloat(dbo.total_amount || dbo.total || 0);
            if (rawTotal < 10 && orderSubtotal >= 10) {
              rawTotal = orderSubtotal;
            }

            const formatted = {
              id: dboId,
              order_id: dbo.order_id,
              db_id: dbo.order_id,
              userId: dbo.user_id ? `uid_${dbo.user_id}` : (dbo.userId || 'guest'),
              user_id: dbo.user_id,
              customerName: dbo.customer_name || dbo.customerName || dbo.name || 'Valued Customer',
              customerEmail: dbo.customer_email || dbo.email || '',
              phone: dbo.customer_phone || dbo.phone || '0771234567',
              address: dbo.customer_address || dbo.delivery_address || dbo.address || 'Sri Lanka',
              delivery_address: dbo.customer_address || dbo.delivery_address || dbo.address || 'Sri Lanka',
              date: dbo.order_date || dbo.created_at || dbo.date || new Date().toISOString(),
              subtotal: orderSubtotal || rawTotal,
              discount: parseFloat(dbo.discount || 0) || 0,
              delivery_fee: parseFloat(dbo.delivery_fee || 0) || (orderSubtotal > 20000 ? 0 : 350),
              total: rawTotal,
              total_amount: rawTotal,
              paymentMethod: dbo.payment_method || dbo.paymentMethod || 'Cash on Delivery',
              payment_method: dbo.payment_method || dbo.paymentMethod || 'Cash on Delivery',
              paymentStatus: dbo.payment_status || dbo.paymentStatus || 'Pending',
              payment_status: dbo.payment_status || dbo.paymentStatus || 'Pending',
              bank_slip_path: dbo.bank_slip_path || dbo.bankSlipPath || null,
              bankSlipPath: dbo.bank_slip_path || dbo.bankSlipPath || null,
              status: dbo.status || 'Pending',
              items: items.length > 0 ? items : (existingIdx >= 0 && merged[existingIdx].items ? merged[existingIdx].items : [])
            };

            if (existingIdx >= 0) {
              merged[existingIdx] = { ...merged[existingIdx], ...formatted };
            } else {
              merged.push(formatted);
            }
          });

          // Sort newest first
          merged.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
          StorageDB.saveOrders(merged);
        }
      } catch (e) {
        console.warn("Could not sync orders from MySQL:", e);
      }
    }
  }

  // Robust calculation helper for orders
  function getOrderAmounts(order) {
    if (!order) return { subtotal: 0, discount: 0, deliveryFee: 0, total: 0 };
    let itemsSubtotal = 0;
    if (Array.isArray(order.items) && order.items.length > 0) {
      itemsSubtotal = order.items.reduce((sum, it) => {
        const price = parseFloat(it.price || it.unit_price || 0) || 0;
        const qty = parseInt(it.qty || it.quantity || 1) || 1;
        return sum + (price * qty);
      }, 0);
    }
    const discount = parseFloat(order.discount || 0) || 0;
    const deliveryFee = parseFloat(order.delivery_fee || order.shipping || (itemsSubtotal > 20000 || itemsSubtotal === 0 ? 0 : 350)) || 0;
    let recordedTotal = parseFloat(order.total_amount || order.total || 0) || 0;

    // Heal legacy / corrupt totals (e.g. 0.27 when items are thousands)
    if (recordedTotal < 10 && itemsSubtotal >= 10) {
      recordedTotal = Math.max(0, itemsSubtotal - discount + deliveryFee);
    } else if (recordedTotal <= 0 && itemsSubtotal > 0) {
      recordedTotal = Math.max(0, itemsSubtotal - discount + deliveryFee);
    }

    return {
      subtotal: itemsSubtotal || recordedTotal,
      discount: discount,
      deliveryFee: deliveryFee,
      total: recordedTotal || itemsSubtotal
    };
  }

  // Initial DB sync (Products & Orders)
  await syncProductsFromDatabase();
  await syncOrdersFromDatabase();

  // -------------------------------------------------------------------------
  // Persistent Out-of-Stock Notifications (ADMIN ONLY)
  // No dismiss button is provided. An alert disappears only after stock is
  // updated to a value greater than 0 in the database/admin inventory.
  // -------------------------------------------------------------------------
  const stockAlertPanel = document.getElementById("stockAlertPanel");
  const stockAlertList = document.getElementById("stockAlertList");
  const stockAlertCount = document.getElementById("stockAlertCount");

  function renderStockAlerts() {
    if (!stockAlertPanel || !stockAlertList) return;
    const products = StorageDB.getProducts() || [];
    const outProducts = products
      .filter(p => Number(p.stock) <= 0)
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

    if (stockAlertCount) stockAlertCount.textContent = `${outProducts.length} Out of Stock`;

    if (outProducts.length === 0) {
      stockAlertPanel.style.display = 'none';
      stockAlertList.innerHTML = '';
      return;
    }

    stockAlertPanel.style.display = 'block';
    stockAlertList.innerHTML = outProducts.map(p => `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:0.75rem; padding:0.7rem 0.8rem; border:1px solid rgba(244,63,94,0.2); background:rgba(15,23,42,0.45); border-radius:10px;">
        <div style="display:flex; align-items:center; gap:0.7rem; min-width:0;">
          <i class="fas fa-triangle-exclamation" style="color:var(--accent-rose);"></i>
          <div style="min-width:0;">
            <div style="font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name || 'Unnamed Product'}</div>
            <div style="font-size:0.74rem; color:var(--text-muted);">${p.brand || 'D-TEL'} • ${p.category || 'Product'}</div>
          </div>
        </div>
        <button type="button" class="icon-btn" title="Open product editor" onclick="window.openEditProductModal('${p.id}')" style="padding:0.45rem 0.65rem; flex:none;">
          <i class="fas fa-edit"></i> Update Stock
        </button>
      </div>
    `).join('');
  }

  // Render Dashboard Metrics
  function updateDashboardMetrics() {
    const products = StorageDB.getProducts();
    const orders = (typeof StorageDB.getAllOrders === 'function') ? StorageDB.getAllOrders() : StorageDB.getOrders();

    const totalRevenue = orders.reduce((sum, o) => {
      const isCancelled = (o.status || '').toLowerCase() === 'cancelled';
      const amounts = getOrderAmounts(o);
      return isCancelled ? sum : sum + amounts.total;
    }, 0);
    const outOfStockCount = products.filter(p => p.stock <= 0).length;

    if (statRevenue) statRevenue.textContent = `LKR ${Math.round(totalRevenue).toLocaleString()}`;
    if (statOrders) statOrders.textContent = orders.length;
    if (statProducts) statProducts.textContent = products.length;
    if (statOutOfStock) statOutOfStock.textContent = outOfStockCount;
  }

  // Render Products Table
  function renderAdminProducts() {
    if (!adminProductsTable) return;
    const products = StorageDB.getProducts();

    if (products.length === 0) {
      adminProductsTable.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">
            No products found in catalog. Click "Add New Product" to list your first item.
          </td>
        </tr>
      `;
      return;
    }

    adminProductsTable.innerHTML = products.map(p => {
      const isOut = p.stock <= 0;
      const img1 = p.image || 'images/cat-chargers.svg';
      const img2 = p.image_2 || p.image2;
      const img3 = p.image_3 || p.image3;
      const imgCount = 1 + (img2 ? 1 : 0) + (img3 ? 1 : 0);

      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:0.85rem;">
              <div style="position:relative;">
                <img src="${img1}" alt="${p.name}" class="table-thumb" onerror="this.src='images/cat-chargers.svg'">
                <span style="position:absolute; bottom:-4px; right:-4px; background:var(--bg-secondary); border:1px solid var(--accent-cyan); font-size:0.65rem; padding:1px 4px; border-radius:4px; font-weight:700; color:var(--accent-cyan);" title="${imgCount} Image Views Attached">
                  ${imgCount} <i class="fas fa-images" style="font-size:0.55rem;"></i>
                </span>
              </div>
              <div>
                <div style="font-weight:700; font-size:0.95rem;">${p.name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted); display:flex; align-items:center; gap:0.4rem; margin-top:2px;">
                  <span style="background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px; font-weight:600;">${p.brand || 'D-TEL'}</span>
                  <span>•</span>
                  <span style="color:var(--accent-cyan); font-weight:600;">${p.category}</span>
                  ${p.qualityTier ? `<span>•</span> <span style="color:#fb7185; font-weight:700;">${p.qualityTier}</span>` : ''}
                </div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-size:0.85rem; color:var(--text-main); font-weight:500;">${p.connector || 'Universal'}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${p.model || 'Standard'}</div>
          </td>
          <td>
            <strong style="color:var(--accent-cyan); font-size:0.95rem;">LKR ${Number(p.price || 0).toLocaleString()}</strong>
            ${p.oldPrice ? `<div style="font-size:0.75rem; color:var(--text-dim); text-decoration:line-through;">LKR ${Number(p.oldPrice).toLocaleString()}</div>` : ''}
            ${(p.is_offer == 1 || p.is_offer === true || (p.oldPrice && p.oldPrice > p.price)) ? `<div style="margin-top:3px;"><span style="font-size:0.65rem; background:rgba(244,63,94,0.18); color:#fb7185; border:1px solid rgba(244,63,94,0.3); border-radius:4px; padding:1px 6px; font-weight:800; display:inline-flex; align-items:center; gap:2px;"><i class="fas fa-fire"></i> SPECIAL OFFER</span></div>` : ''}
          </td>
          <td>
            <span class="status-pill ${isOut ? 'out-of-stock' : 'in-stock'}">
              <i class="fas fa-circle" style="font-size:0.5rem; margin-right:4px;"></i>
              ${isOut ? 'Out of Stock (0)' : `In Stock (${p.stock})`}
            </span>
          </td>
          <td>
            <div style="display:flex; gap:0.35rem;">
              <a href="product-detail.html?id=${p.id}" target="_blank" class="icon-btn" title="View Store Page" style="padding:0.4rem 0.6rem; font-size:0.8rem;">
                <i class="fas fa-eye"></i>
              </a>
              <button class="icon-btn" onclick="window.toggleStockStatus('${p.id}')" title="Quick Toggle Stock" style="padding:0.4rem 0.6rem; font-size:0.8rem;">
                <i class="fas fa-sync-alt"></i>
              </button>
              <button class="icon-btn" onclick="window.openEditProductModal('${p.id}')" title="Edit Product" style="padding:0.4rem 0.6rem; font-size:0.8rem;">
                <i class="fas fa-edit"></i>
              </button>
              <button class="icon-btn" style="color:var(--accent-rose); padding:0.4rem 0.6rem; font-size:0.8rem;" onclick="window.handleDeleteProduct('${p.id}')" title="Delete Product">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // Keep the admin notification in sync with live MySQL stock.
  // Alerts are not dismissible; they disappear only when stock is updated.
  const stockAlertPoller = setInterval(async () => {
    try {
      await syncProductsFromDatabase();
      renderAdminProducts();
      renderStockAlerts();
      updateDashboardMetrics();
    } catch (e) {
      console.warn('Stock notification refresh failed:', e);
    }
  }, 10000);

  // =========================================================================
  // ORDERS FILTERING & RENDERING CONTROLLER
  // =========================================================================
  let currentOrderFilter = 'all';
  let currentOrderSearch = '';

  window.setOrderFilter = function(filter, btnEl) {
    currentOrderFilter = filter;
    document.querySelectorAll(".order-filter-pill").forEach(p => p.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    renderAdminOrders();
  };

  window.filterAdminOrders = function() {
    const input = document.getElementById("orderSearchInput");
    currentOrderSearch = input ? input.value.trim().toLowerCase() : '';
    renderAdminOrders();
  };

  window.refreshAdminOrders = async function() {
    const btn = document.querySelector('button[onclick="window.refreshAdminOrders()"]');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Syncing...`;
    }
    await syncOrdersFromDatabase();
    renderAdminOrders();
    updateDashboardMetrics();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fas fa-sync-alt"></i> Refresh`;
    }
  };

  // Render Orders Table
  function renderAdminOrders() {
    if (!adminOrdersTable) return;
    const allOrders = (typeof StorageDB.getAllOrders === 'function')
      ? StorageDB.getAllOrders()
      : (JSON.parse(localStorage.getItem("tz_orders")) || []);

    // Update filter counts
    const countAll = allOrders.length;
    const countPending = allOrders.filter(o => (o.status || 'Pending').toLowerCase() === 'pending').length;
    const countProcessing = allOrders.filter(o => (o.status || '').toLowerCase() === 'processing').length;
    const countShipped = allOrders.filter(o => (o.status || '').toLowerCase() === 'shipped').length;
    const countCompleted = allOrders.filter(o => (o.status || '').toLowerCase() === 'completed' || (o.status || '').toLowerCase() === 'delivered').length;
    const countCancelled = allOrders.filter(o => (o.status || '').toLowerCase() === 'cancelled').length;

    const elAll = document.getElementById("countFilterAll");
    const elPending = document.getElementById("countFilterPending");
    const elProcessing = document.getElementById("countFilterProcessing");
    const elShipped = document.getElementById("countFilterShipped");
    const elCompleted = document.getElementById("countFilterCompleted");
    const elCancelled = document.getElementById("countFilterCancelled");

    if (elAll) elAll.textContent = countAll;
    if (elPending) elPending.textContent = countPending;
    if (elProcessing) elProcessing.textContent = countProcessing;
    if (elShipped) elShipped.textContent = countShipped;
    if (elCompleted) elCompleted.textContent = countCompleted;
    if (elCancelled) elCancelled.textContent = countCancelled;

    // Filter by tab
    let filtered = allOrders;
    if (currentOrderFilter !== 'all') {
      if (currentOrderFilter === 'Completed') {
        filtered = filtered.filter(o => (o.status || '').toLowerCase() === 'completed' || (o.status || '').toLowerCase() === 'delivered');
      } else {
        filtered = filtered.filter(o => (o.status || 'Pending').toLowerCase() === currentOrderFilter.toLowerCase());
      }
    }

    // Filter by search query
    if (currentOrderSearch) {
      filtered = filtered.filter(o => {
        const id = String(o.id || o.order_id || '').toLowerCase();
        const name = String(o.customerName || o.name || '').toLowerCase();
        const phone = String(o.phone || '').toLowerCase();
        const email = String(o.customerEmail || o.email || '').toLowerCase();
        const address = String(o.address || o.delivery_address || '').toLowerCase();
        const items = Array.isArray(o.items) ? o.items.map(i => (i.name || i.product_name || '').toLowerCase()).join(" ") : '';
        return id.includes(currentOrderSearch) || name.includes(currentOrderSearch) || phone.includes(currentOrderSearch) || email.includes(currentOrderSearch) || address.includes(currentOrderSearch) || items.includes(currentOrderSearch);
      });
    }

    if (filtered.length === 0) {
      adminOrdersTable.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:2.5rem; color:var(--text-muted);">
            <i class="fas fa-box-open" style="font-size:2.2rem; color:rgba(255,255,255,0.15); margin-bottom:0.75rem; display:block;"></i>
            No orders found matching your criteria.
          </td>
        </tr>
      `;
      return;
    }

    adminOrdersTable.innerHTML = filtered.map(o => {
      const orderDateObj = new Date(o.date || Date.now());
      const formattedDate = orderDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const formattedTime = orderDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      const itemsList = Array.isArray(o.items) && o.items.length > 0
        ? o.items.map(i => `• ${i.name || i.product_name || 'Item'} <strong style="color:var(--accent-cyan);">(x${i.qty || i.quantity || 1})</strong>`).join("<br>") 
        : "Standard Mobile Item (x1)";
      
      const itemCount = Array.isArray(o.items) 
        ? o.items.reduce((s, i) => s + (parseInt(i.qty || i.quantity) || 1), 0)
        : 1;

      const amounts = getOrderAmounts(o);

      const rawPhone = String(o.phone || '').replace(/[^0-9+]/g, '');
      const waPhone = rawPhone.startsWith('+') ? rawPhone.replace('+', '') : (rawPhone.startsWith('0') ? '94' + rawPhone.slice(1) : rawPhone);
      const waMsg = encodeURIComponent(`Hello ${o.customerName || 'Customer'}, this is D-TEL Cellular regarding your Order #${o.id || o.order_id}. Total: LKR ${amounts.total.toLocaleString()}`);

      const paymentStatus = o.paymentStatus || o.payment_status || 'Pending';
      const isPaid = paymentStatus.toLowerCase() === 'paid';

      return `
        <tr>
          <td>
            <strong style="color:var(--accent-cyan); font-size:0.95rem;">#${o.id || o.order_id}</strong>
            ${o.order_id ? `<div style="font-size:0.7rem; color:var(--text-muted);">DB #${o.order_id}</div>` : ''}
          </td>
          <td>
            <div style="font-weight:600; font-size:0.85rem; color:#fff;">${formattedDate}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${formattedTime}</div>
          </td>
          <td>
            <div style="font-weight:700; color:#fff; font-size:0.92rem; display:flex; align-items:center; gap:0.4rem;">
              <i class="fas fa-user-circle" style="color:var(--accent-blue);"></i> ${o.customerName || 'Customer'}
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px; display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
              <a href="tel:${rawPhone}" style="color:var(--accent-cyan); text-decoration:none;"><i class="fas fa-phone-alt" style="font-size:0.75rem;"></i> ${o.phone || 'No Phone'}</a>
              ${waPhone ? `<a href="https://wa.me/${waPhone}?text=${waMsg}" target="_blank" style="color:#22c55e; text-decoration:none; font-weight:700;" title="Chat on WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ''}
            </div>
            ${o.customerEmail || o.email ? `<div style="font-size:0.75rem; color:var(--text-dim); margin-top:1px;"><i class="fas fa-envelope" style="font-size:0.7rem;"></i> ${o.customerEmail || o.email}</div>` : ''}
          </td>
          <td>
            <div style="font-size:0.82rem; color:var(--text-main); max-width:200px; line-height:1.35;" title="${o.delivery_address || o.address || ''}">
              <i class="fas fa-map-marker-alt" style="color:var(--accent-rose); font-size:0.75rem; margin-right:2px;"></i>
              ${o.delivery_address || o.address || 'Sri Lanka'}
            </div>
          </td>
          <td>
            <div style="font-size:0.82rem; line-height:1.45; max-width:240px;">
              <span style="font-size:0.72rem; background:rgba(255,255,255,0.08); padding:1px 6px; border-radius:4px; font-weight:700; color:var(--accent-cyan); margin-bottom:4px; display:inline-block;">
                ${itemCount} ${itemCount === 1 ? 'item' : 'items'}
              </span><br>
              ${itemsList}
            </div>
          </td>
          <td>
            <strong style="color:var(--accent-green); font-size:0.95rem;">LKR ${amounts.total.toLocaleString()}</strong>
            ${amounts.discount > 0 ? `<div style="font-size:0.72rem; color:var(--accent-cyan);">Discount: -${amounts.discount.toLocaleString()}</div>` : ''}
          </td>
          <td>
            <div style="display:flex; flex-direction:column; gap:0.25rem; align-items:flex-start;">
              <span style="font-size:0.75rem; background:rgba(255,255,255,0.06); padding:0.2rem 0.5rem; border-radius:4px; font-weight:600; color:#fff;">
                <i class="fas fa-credit-card" style="font-size:0.7rem; margin-right:3px;"></i> ${o.paymentMethod || o.payment_method || 'COD'}
              </span>
              <span class="status-pill ${isPaid ? 'in-stock' : 'out-of-stock'}" style="font-size:0.7rem; padding:2px 6px; cursor:pointer;" onclick="window.toggleOrderPaymentStatus('${o.id || o.order_id}')" title="Click to toggle Paid/Pending">
                <i class="fas fa-circle" style="font-size:0.4rem; margin-right:3px;"></i> ${isPaid ? 'Paid' : 'Payment Pending'}
              </span>
              ${(o.bank_slip_path || o.bankSlipPath || o.bankSlipDataUri) ? `
                <span style="font-size:0.68rem; background:rgba(245,158,11,0.15); color:#fde68a; border:1px solid rgba(245,158,11,0.3); padding:2px 6px; border-radius:4px; font-weight:700; display:inline-flex; align-items:center; gap:3px;">
                  <i class="fas fa-paperclip" style="font-size:0.6rem;"></i> Slip Attached
                </span>
              ` : (((o.paymentMethod || o.payment_method || '').toLowerCase().includes('bank')) ? `
                <span style="font-size:0.68rem; background:rgba(245,158,11,0.06); color:#f59e0b; border:1px dashed rgba(245,158,11,0.3); padding:2px 6px; border-radius:4px; font-weight:700; display:inline-flex; align-items:center; gap:3px;">
                  <i class="fas fa-clock" style="font-size:0.6rem;"></i> Slip Pending
                </span>
              ` : '')}
            </div>
          </td>
          <td>
            <select style="padding:0.35rem 0.6rem; font-size:0.8rem; width:auto; border-radius:var(--radius-sm); font-weight:600; background:var(--bg-primary); color:#fff; border:1px solid var(--border-color);" onchange="window.updateOrderStatus('${o.id || o.order_id}', this.value)">
              <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
              <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>⚙️ Processing</option>
              <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>🚚 Shipped</option>
              <option value="Completed" ${o.status === 'Completed' || o.status === 'Delivered' ? 'selected' : ''}>✅ Completed</option>
              <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>❌ Cancelled</option>
            </select>
          </td>
          <td>
            <div style="display:flex; gap:0.35rem; align-items:center;">
              <button class="icon-btn" onclick="window.openOrderDetailsModal('${o.id || o.order_id}')" title="View Full Customer & Order Details" style="padding:0.45rem 0.65rem; font-size:0.85rem; background:rgba(6,182,212,0.15); color:var(--accent-cyan); border-color:rgba(6,182,212,0.3);">
                <i class="fas fa-id-card"></i> View
              </button>
              <button class="icon-btn" style="color:var(--accent-rose); padding:0.45rem 0.65rem; font-size:0.85rem;" onclick="window.handleDeleteOrder('${o.id || o.order_id}')" title="Delete Order Record">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // Direct Bank Slip Viewer helper
  window.viewBankSlip = async function(orderId) {
    const numId = parseInt(String(orderId).replace(/\D/g, '')) || 0;
    let targetPath = null;

    const allOrders = (typeof StorageDB.getAllOrders === 'function') ? StorageDB.getAllOrders() : [];
    const o = allOrders.find(x => x.id === orderId || x.order_id == orderId || String(x.id).replace(/\D/g, '') == String(numId));
    if (o && (o.bank_slip_path || o.bankSlipPath)) {
      targetPath = o.bank_slip_path || o.bankSlipPath;
    }

    if (!targetPath && numId > 0) {
      try {
        const res = await fetch(`api/orders.php?order_id=${numId}`);
        if (res.ok) {
          const j = await res.json();
          if (j && j.data && j.data.bank_slip_path) {
            targetPath = j.data.bank_slip_path;
            if (o) { o.bank_slip_path = targetPath; o.bankSlipPath = targetPath; StorageDB.saveOrders(allOrders); }
          }
        }
      } catch(e) {}
    }

    if (targetPath) {
      let finalUrl = targetPath;
      if (!targetPath.startsWith('http://') && !targetPath.startsWith('https://') && !targetPath.startsWith('data:')) {
        const basePath = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
        finalUrl = targetPath.startsWith('/') ? (window.location.origin + targetPath) : (basePath + targetPath);
      }
      window.open(finalUrl, '_blank');
    } else {
      alert("Bank slip receipt has not been uploaded yet or could not be found on server.");
    }
  };

  // Customer & Order Details Modal Viewer
  window.openOrderDetailsModal = async function(orderId) {
    const modalOverlay = document.getElementById("orderDetailsModalOverlay");
    if (!modalOverlay) return;

    let allOrders = (typeof StorageDB.getAllOrders === 'function')
      ? StorageDB.getAllOrders()
      : (JSON.parse(localStorage.getItem("tz_orders")) || []);

    let order = allOrders.find(o => o.id === orderId || o.order_id == orderId || String(o.id) === String(orderId));

    // Always fetch latest order details from database to ensure fresh bank_slip_path
    const numId = parseInt(String(orderId).replace(/\D/g, '')) || (order && order.order_id ? parseInt(order.order_id) : 0);
    if (numId > 0) {
      try {
        const freshRes = await fetch(`api/orders.php?order_id=${numId}`);
        if (freshRes.ok) {
          const freshJson = await freshRes.json();
          if (freshJson && freshJson.status === 'success' && freshJson.data) {
            const dbo = freshJson.data;
            if (!order) {
              order = {
                id: `ORD-${dbo.order_id}`,
                order_id: dbo.order_id,
                customerName: dbo.customer_name || 'Customer',
                phone: dbo.customer_phone || dbo.phone,
                email: dbo.customer_email || dbo.email,
                delivery_address: dbo.customer_address || dbo.delivery_address,
                paymentMethod: dbo.payment_method || 'Bank Transfer',
                paymentStatus: dbo.payment_status || 'Pending',
                bank_slip_path: dbo.bank_slip_path,
                bankSlipPath: dbo.bank_slip_path,
                status: dbo.status || 'Pending',
                total: parseFloat(dbo.total_amount || 0),
                items: dbo.items || []
              };
            } else {
              if (dbo.bank_slip_path) {
                order.bank_slip_path = dbo.bank_slip_path;
                order.bankSlipPath = dbo.bank_slip_path;
              }
              if (dbo.payment_status) {
                order.payment_status = dbo.payment_status;
                order.paymentStatus = dbo.payment_status;
              }
              if (dbo.status) {
                order.status = dbo.status;
              }
              const idx = allOrders.findIndex(x => x.id === order.id || x.order_id == order.order_id);
              if (idx >= 0) {
                allOrders[idx] = { ...allOrders[idx], ...order };
                StorageDB.saveOrders(allOrders);
              }
            }
          }
        }
      } catch (fetchErr) {
        console.warn("Could not fetch fresh order from server:", fetchErr);
      }
    }

    if (!order) {
      alert("Order details could not be found.");
      return;
    }

    const amounts = getOrderAmounts(order);

    const orderDateObj = new Date(order.date || Date.now());
    const formattedDate = orderDateObj.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = orderDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const rawPhone = String(order.phone || '').replace(/[^0-9+]/g, '');
    const waPhone = rawPhone.startsWith('+') ? rawPhone.replace('+', '') : (rawPhone.startsWith('0') ? '94' + rawPhone.slice(1) : rawPhone);
    const waMsg = encodeURIComponent(`Hello ${order.customerName || 'Customer'}! D-TEL Cellular is updating you on your Order #${order.id || order.order_id}.\nStatus: ${order.status}\nTotal: LKR ${amounts.total.toLocaleString()}\nThank you for shopping with D-TEL!`);

    const paymentStatus = order.paymentStatus || order.payment_status || 'Pending';
    const isPaid = paymentStatus.toLowerCase() === 'paid';

    // Resolve bank slip path
    const slipPath = order.bank_slip_path || order.bankSlipPath || order.bankSlipDataUri || (order.bankSlip && typeof order.bankSlip === 'string' && (order.bankSlip.startsWith('data:') || order.bankSlip.startsWith('images/')) ? order.bankSlip : null);
    const payMethod = (order.paymentMethod || order.payment_method || '').toLowerCase();
    const isBank = payMethod.includes('bank') || !!slipPath || !!order.bankSlip;

    let fullSlipUrl = null;
    let isPdfSlip = false;
    if (slipPath) {
      isPdfSlip = slipPath.toLowerCase().includes('.pdf') || slipPath.startsWith('data:application/pdf');
      fullSlipUrl = slipPath;
      if (!slipPath.startsWith('http://') && !slipPath.startsWith('https://') && !slipPath.startsWith('data:')) {
        const basePath = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
        fullSlipUrl = slipPath.startsWith('/') ? (window.location.origin + slipPath) : (basePath + slipPath);
      }
    }

    const itemsHtml = Array.isArray(order.items) && order.items.length > 0
      ? order.items.map(item => {
          const itemImg = item.image || 'images/cat-chargers.svg';
          const unitPrice = parseFloat(item.price || item.unit_price || 0);
          const qty = parseInt(item.qty || item.quantity || 1);
          const subtotal = unitPrice * qty;

          return `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
              <td style="padding:0.75rem 0.5rem; display:flex; align-items:center; gap:0.75rem;">
                <img src="${itemImg}" alt="${item.name || item.product_name}" style="width:42px; height:42px; object-fit:contain; border-radius:6px; background:rgba(255,255,255,0.04); border:1px solid var(--border-color);" onerror="this.src='images/cat-chargers.svg'">
                <div>
                  <div style="font-weight:700; color:#fff; font-size:0.9rem;">${item.name || item.product_name || 'Product'}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${item.brand || 'D-TEL'} ${item.model ? '• ' + item.model : ''}</div>
                </div>
              </td>
              <td style="padding:0.75rem 0.5rem; text-align:center; color:var(--text-main); font-weight:600;">LKR ${unitPrice.toLocaleString()}</td>
              <td style="padding:0.75rem 0.5rem; text-align:center; color:var(--accent-cyan); font-weight:700;">x${qty}</td>
              <td style="padding:0.75rem 0.5rem; text-align:right; color:var(--accent-green); font-weight:700;">LKR ${subtotal.toLocaleString()}</td>
            </tr>
          `;
        }).join("")
      : `<tr><td colspan="4" style="text-align:center; padding:1.5rem; color:var(--text-muted);">Standard Order Package</td></tr>`;

    modalOverlay.querySelector(".modal-card").innerHTML = `
      <button class="modal-close-btn" onclick="window.closeOrderDetailsModal()" title="Close">&times;</button>

      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; border-bottom:1px solid var(--border-color); padding-bottom:1rem; flex-wrap:wrap; gap:1rem;">
        <div style="display:flex; align-items:center; gap:0.85rem;">
          <div style="width:46px; height:46px; border-radius:12px; background:linear-gradient(135deg, var(--accent-cyan), var(--accent-blue)); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.4rem; box-shadow:0 0 15px rgba(6,182,212,0.35);">
            <i class="fas fa-file-invoice"></i>
          </div>
          <div>
            <h2 style="font-size:1.4rem; margin-bottom:2px; color:#fff;">Order Details & Customer Profile</h2>
            <p style="font-size:0.85rem; color:var(--text-muted);">
              Order <strong style="color:var(--accent-cyan);">#${order.id || order.order_id}</strong> • Placed on ${formattedDate} at ${formattedTime}
            </p>
          </div>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <span class="status-pill ${isPaid ? 'in-stock' : 'out-of-stock'}" style="font-size:0.8rem; padding:0.35rem 0.75rem;">
            ${isPaid ? 'Payment Paid' : 'Payment Pending'}
          </span>
          <span style="background:rgba(6,182,212,0.15); color:var(--accent-cyan); border:1px solid rgba(6,182,212,0.3); padding:0.35rem 0.75rem; border-radius:var(--radius-full); font-size:0.8rem; font-weight:700;">
            ${order.status || 'Pending'}
          </span>
        </div>
      </div>

      <!-- 2-COLUMN GRID: CUSTOMER DETAILS & PAYMENT INFO -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
        
        <!-- CUSTOMER PROFILE CARD -->
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem;">
          <h3 style="font-size:1rem; color:var(--accent-cyan); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0.5rem;">
            <i class="fas fa-user-circle"></i> Customer Information
          </h3>

          <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.9rem;">
            <div>
              <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; font-weight:700; display:block;">Full Name</span>
              <strong style="color:#fff; font-size:1.05rem;">${order.customerName || 'Valued Customer'}</strong>
            </div>

            <div>
              <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; font-weight:700; display:block;">Contact Phone</span>
              <div style="display:flex; gap:0.5rem; align-items:center; margin-top:2px;">
                <a href="tel:${rawPhone}" style="color:#fff; font-weight:700; text-decoration:none;">${order.phone || 'Not Provided'}</a>
                ${waPhone ? `
                  <a href="https://wa.me/${waPhone}?text=${waMsg}" target="_blank" class="btn-secondary" style="padding:0.25rem 0.65rem; font-size:0.78rem; background:rgba(34,197,94,0.15); color:#22c55e; border-color:rgba(34,197,94,0.3); text-decoration:none;">
                    <i class="fab fa-whatsapp"></i> Chat
                  </a>
                ` : ''}
              </div>
            </div>

            <div>
              <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; font-weight:700; display:block;">Email Address</span>
              <span style="color:var(--text-main);">${order.customerEmail || order.email || 'No email specified'}</span>
            </div>

            <div>
              <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; font-weight:700; display:block;">Delivery Destination</span>
              <span style="color:var(--text-main); line-height:1.4;">
                <i class="fas fa-truck" style="color:var(--accent-cyan); font-size:0.8rem; margin-right:4px;"></i>
                ${order.delivery_address || order.address || 'Sri Lanka'}
              </span>
            </div>
          </div>
        </div>

        <!-- PAYMENT & FULFILLMENT STATUS CARD -->
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem;">
          <h3 style="font-size:1rem; color:var(--accent-green); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0.5rem;">
            <i class="fas fa-credit-card"></i> Payment & Order Fulfillment
          </h3>

          <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.9rem;">
            <div>
              <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; font-weight:700; display:block;">Payment Method</span>
              <strong style="color:#fff; font-size:1rem;"><i class="fas fa-money-bill-wave" style="color:var(--accent-amber);"></i> ${order.paymentMethod || order.payment_method || 'Cash on Delivery'}</strong>
              ${order.cardBrand ? `<div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">Card: ${order.cardBrand} ${order.cardLast4 ? '(•••• ' + order.cardLast4 + ')' : ''}</div>` : ''}
              
              ${isBank ? `
                <div style="margin-top:0.45rem;">
                  <button type="button" onclick="window.viewBankSlip('${order.id || order.order_id}')" style="background:linear-gradient(135deg, #06b6d4, #2563eb); color:#fff; border:none; padding:0.45rem 0.9rem; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:0.45rem; box-shadow:0 2px 8px rgba(6,182,212,0.35);">
                    <i class="fas fa-file-invoice"></i> Open Bank Slip Receipt <i class="fas fa-external-link-alt" style="font-size:0.72rem; margin-left:3px;"></i>
                  </button>
                  ${order.bankSlip ? `<div style="font-size:0.75rem; color:var(--accent-cyan); margin-top:4px;"><i class="fas fa-paperclip"></i> ${order.bankSlip}</div>` : ''}
                </div>
              ` : ''}
            </div>

            ${(() => {
              if (isBank) {
                if (fullSlipUrl) {
                  return `
                    <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.35); border-radius:10px; padding:0.85rem;">
                      <div style="font-weight:700; color:#fde68a; font-size:0.85rem; margin-bottom:0.6rem; display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
                        <i class="fas fa-file-invoice"></i> Bank Transfer Receipt / Deposit Slip
                        <span style="background:rgba(16,185,129,0.2); color:#6ee7b7; border:1px solid rgba(16,185,129,0.3); padding:2px 8px; border-radius:999px; font-size:0.72rem; font-weight:700; margin-left:auto;">UPLOADED</span>
                      </div>
                      ${isPdfSlip ? `
                        <div style="display:flex; flex-direction:column; gap:0.75rem;">
                          <div style="display:flex; align-items:center; justify-content:space-between; gap:0.75rem; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:0.75rem 1rem; flex-wrap:wrap;">
                            <div style="display:flex; align-items:center; gap:0.75rem; min-width:0; overflow:hidden;">
                              <i class="fas fa-file-pdf" style="color:#ef4444; font-size:2rem; flex-shrink:0;"></i>
                              <div style="overflow:hidden;">
                                <div style="font-weight:700; color:#fff; font-size:0.9rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${order.bankSlip || slipPath.split('/').pop()}</div>
                                <div style="font-size:0.75rem; color:#fca5a5;">PDF Bank Deposit Receipt</div>
                              </div>
                            </div>
                            <div style="display:flex; gap:0.5rem; flex-shrink:0;">
                              <a href="${fullSlipUrl}" target="_blank" style="background:#ef4444; color:#fff; padding:0.5rem 1rem; border-radius:6px; font-size:0.85rem; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:0.4rem; box-shadow:0 2px 8px rgba(239,68,68,0.4);">
                                <i class="fas fa-external-link-alt"></i> Open PDF in New Window
                              </a>
                            </div>
                          </div>
                          <!-- Embedded PDF preview for instant in-modal reading -->
                          <div style="border-radius:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.15);">
                            <iframe src="${fullSlipUrl}" style="width:100%; height:380px; border:none; display:block; background:#fff;"></iframe>
                          </div>
                        </div>
                      ` : `
                        <div>
                          <div style="border-radius:8px; overflow:hidden; border:1px solid rgba(245,158,11,0.3); background:#000; position:relative; max-height:280px; text-align:center;">
                            <img src="${fullSlipUrl}" alt="Bank Deposit Slip" style="width:100%; max-height:280px; object-fit:contain; display:block;" onerror="this.parentElement.innerHTML='<div style=\\'padding:1.5rem;color:#fca5a5;text-align:center;\\'><i class=\\'fas fa-exclamation-triangle\\'></i> Slip image could not be loaded</div>'">
                          </div>
                          <div style="display:flex; gap:0.5rem; margin-top:0.6rem;">
                            <a href="${fullSlipUrl}" target="_blank" style="flex:1; text-align:center; background:linear-gradient(135deg, #06b6d4, #3b82f6); color:#fff; padding:0.55rem 0.75rem; border-radius:6px; font-size:0.85rem; font-weight:700; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:0.4rem;">
                              <i class="fas fa-expand-alt"></i> View Full Size
                            </a>
                            <a href="${fullSlipUrl}" download style="flex:1; text-align:center; background:rgba(16,185,129,0.15); color:#6ee7b7; border:1px solid rgba(16,185,129,0.3); padding:0.55rem 0.75rem; border-radius:6px; font-size:0.85rem; font-weight:700; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:0.4rem;">
                              <i class="fas fa-download"></i> Download Slip
                            </a>
                          </div>
                        </div>
                      `}
                    </div>
                  `;
                } else {
                  return `
                    <div style="background:rgba(245,158,11,0.06); border:1px dashed rgba(245,158,11,0.3); border-radius:10px; padding:0.85rem; text-align:center;">
                      <i class="fas fa-clock" style="color:#f59e0b; font-size:1.3rem; margin-bottom:0.35rem; display:block;"></i>
                      <div style="font-size:0.85rem; color:#fde68a; font-weight:700;">Bank Slip Not Yet Uploaded</div>
                      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Customer may send via WhatsApp or upload later</div>
                      <button type="button" onclick="window.viewBankSlip('${order.id || order.order_id}')" style="margin-top:0.5rem; background:rgba(245,158,11,0.2); color:#fde68a; border:1px solid rgba(245,158,11,0.4); padding:0.35rem 0.75rem; border-radius:6px; font-size:0.75rem; font-weight:700; cursor:pointer;">
                        <i class="fas fa-sync-alt"></i> Check Server for Slip
                      </button>
                    </div>
                  `;
                }
              }
              return '';
            })()}

            <div>
              <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; font-weight:700; display:block; margin-bottom:0.25rem;">Payment Status</span>
              <select id="modalPaymentStatusSelect" style="padding:0.4rem 0.75rem; font-size:0.85rem; border-radius:var(--radius-sm); background:var(--bg-secondary); color:#fff; border:1px solid var(--border-color); width:100%;">
                <option value="Pending" ${!isPaid ? 'selected' : ''}>⏳ Pending Payment</option>
                <option value="Paid" ${isPaid ? 'selected' : ''}>✅ Paid & Verified</option>
                <option value="Refunded" ${paymentStatus.toLowerCase() === 'refunded' ? 'selected' : ''}>↩️ Refunded</option>
              </select>
            </div>

            <div>
              <span style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; font-weight:700; display:block; margin-bottom:0.25rem;">Order Fulfillment Status</span>
              <select id="modalOrderStatusSelect" style="padding:0.4rem 0.75rem; font-size:0.85rem; border-radius:var(--radius-sm); background:var(--bg-secondary); color:#fff; border:1px solid var(--border-color); width:100%;">
                <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
                <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>⚙️ Processing (In Warehouse)</option>
                <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>🚚 Shipped with Courier</option>
                <option value="Completed" ${order.status === 'Completed' || order.status === 'Delivered' ? 'selected' : ''}>✅ Completed & Delivered</option>
                <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>❌ Cancelled</option>
              </select>
            </div>
          </div>
        </div>

      </div>


      <!-- ORDERED ITEMS BREAKDOWN -->
      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.5rem;">
        <h3 style="font-size:1rem; color:#fff; margin-bottom:0.85rem; display:flex; align-items:center; gap:0.5rem;">
          <i class="fas fa-boxes" style="color:var(--accent-blue);"></i> Purchased Hardware Items
        </h3>

        <div class="table-responsive">
          <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
            <thead>
              <tr style="border-bottom:1px solid var(--border-color); color:var(--text-muted); text-align:left;">
                <th style="padding:0.5rem;">Item Description</th>
                <th style="padding:0.5rem; text-align:center;">Unit Price</th>
                <th style="padding:0.5rem; text-align:center;">Qty</th>
                <th style="padding:0.5rem; text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="border-top:1px solid var(--border-color);">
                <td colspan="3" style="padding:0.6rem 0.5rem 0.2rem; text-align:right; color:var(--text-muted);">
                  Items Subtotal:
                </td>
                <td style="padding:0.6rem 0.5rem 0.2rem; text-align:right; color:#fff; font-weight:700;">
                  LKR ${amounts.subtotal.toLocaleString()}
                </td>
              </tr>
              ${amounts.discount > 0 ? `
                <tr>
                  <td colspan="3" style="padding:0.2rem 0.5rem; text-align:right; color:var(--accent-rose);">
                    Promo / Coupon Discount:
                  </td>
                  <td style="padding:0.2rem 0.5rem; text-align:right; color:var(--accent-rose); font-weight:700;">
                    - LKR ${amounts.discount.toLocaleString()}
                  </td>
                </tr>
              ` : ''}
              <tr>
                <td colspan="3" style="padding:0.2rem 0.5rem; text-align:right; color:var(--text-muted);">
                  Courier Delivery Fee:
                </td>
                <td style="padding:0.2rem 0.5rem; text-align:right; color:var(--text-main); font-weight:600;">
                  ${amounts.deliveryFee === 0 ? '<span style="color:var(--accent-green); font-weight:700;">FREE (Over 20k)</span>' : 'LKR ' + amounts.deliveryFee.toLocaleString()}
                </td>
              </tr>
              <tr style="border-top:1px dashed var(--border-color);">
                <td colspan="3" style="padding:0.75rem 0.5rem 0.25rem; text-align:right; font-weight:800; color:#fff; font-size:1.05rem;">
                  Total Amount:
                </td>
                <td style="padding:0.75rem 0.5rem 0.25rem; text-align:right; font-weight:900; color:var(--accent-green); font-size:1.2rem;">
                  LKR ${amounts.total.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- ACTIONS FOOTER -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; border-top:1px solid var(--border-color); padding-top:1.25rem;">
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button type="button" class="btn-secondary" onclick="window.printOrderInvoice('${order.id || order.order_id}')" style="font-size:0.85rem; padding:0.6rem 1rem;">
            <i class="fas fa-print"></i> Print Invoice
          </button>
          ${waPhone ? `
            <a href="https://wa.me/${waPhone}?text=${waMsg}" target="_blank" class="btn-secondary" style="font-size:0.85rem; padding:0.6rem 1rem; color:#22c55e; border-color:rgba(34,197,94,0.4); text-decoration:none;">
              <i class="fab fa-whatsapp"></i> WhatsApp Update
            </a>
          ` : ''}
        </div>

        <div style="display:flex; gap:0.5rem;">
          <button type="button" class="btn-secondary" onclick="window.closeOrderDetailsModal()" style="font-size:0.85rem; padding:0.6rem 1.25rem;">
            Close
          </button>
          <button type="button" class="btn-primary" onclick="window.saveModalOrderChanges('${order.id || order.order_id}')" style="font-size:0.85rem; padding:0.6rem 1.5rem;">
            <i class="fas fa-check"></i> Save & Apply Updates
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add("active");
  };

  window.closeOrderDetailsModal = function() {
    const modalOverlay = document.getElementById("orderDetailsModalOverlay");
    if (modalOverlay) modalOverlay.classList.remove("active");
  };

  // Close order details modal when clicking outside
  if (orderDetailsModalOverlay) {
    orderDetailsModalOverlay.addEventListener("click", (e) => {
      if (e.target === orderDetailsModalOverlay) {
        window.closeOrderDetailsModal();
      }
    });
  }

  // Save Modal Order Changes (Status & Payment Status)
  window.saveModalOrderChanges = async function(orderId) {
    const statusSelect = document.getElementById("modalOrderStatusSelect");
    const paymentSelect = document.getElementById("modalPaymentStatusSelect");

    if (!statusSelect || !paymentSelect) return;

    const newStatus = statusSelect.value;
    const newPaymentStatus = paymentSelect.value;

    const allOrders = (typeof StorageDB.getAllOrders === 'function')
      ? StorageDB.getAllOrders()
      : (JSON.parse(localStorage.getItem("tz_orders")) || []);

    const order = allOrders.find(o => o.id === orderId || o.order_id == orderId || String(o.id) === String(orderId));
    if (order) {
      order.status = newStatus;
      order.paymentStatus = newPaymentStatus;
      order.payment_status = newPaymentStatus;
      StorageDB.saveOrders(allOrders);

      // Attempt MySQL update
      if (typeof ApiClient !== "undefined" && (order.order_id || order.db_id)) {
        try {
          const dbId = order.order_id || order.db_id || parseInt(String(order.id).replace(/[^0-9]/g, ''));
          await ApiClient.updateOrderStatus(dbId, newStatus, newPaymentStatus);
        } catch (e) {
          console.warn("MySQL order status update skipped:", e);
        }
      }

      window.closeOrderDetailsModal();
      renderAdminOrders();
      updateDashboardMetrics();
      alert(`✅ Order #${order.id || order.order_id} status updated to: ${newStatus} (${newPaymentStatus})`);
    }
  };

  // Toggle Payment Status directly from table
  window.toggleOrderPaymentStatus = async function(orderId) {
    const allOrders = (typeof StorageDB.getAllOrders === 'function')
      ? StorageDB.getAllOrders()
      : (JSON.parse(localStorage.getItem("tz_orders")) || []);

    const order = allOrders.find(o => o.id === orderId || o.order_id == orderId || String(o.id) === String(orderId));
    if (order) {
      const current = (order.paymentStatus || order.payment_status || 'Pending').toLowerCase();
      const newPaymentStatus = current === 'paid' ? 'Pending' : 'Paid';
      order.paymentStatus = newPaymentStatus;
      order.payment_status = newPaymentStatus;
      StorageDB.saveOrders(allOrders);

      if (typeof ApiClient !== "undefined" && (order.order_id || order.db_id)) {
        try {
          const dbId = order.order_id || order.db_id || parseInt(String(order.id).replace(/[^0-9]/g, ''));
          await ApiClient.updateOrderStatus(dbId, order.status || 'Pending', newPaymentStatus);
        } catch (e) {}
      }

      renderAdminOrders();
    }
  };

  // Delete Order Action
  window.handleDeleteOrder = async function(orderId) {
    if (confirm(`Are you sure you want to delete order #${orderId}? This cannot be undone.`)) {
      let allOrders = (typeof StorageDB.getAllOrders === 'function')
        ? StorageDB.getAllOrders()
        : (JSON.parse(localStorage.getItem("tz_orders")) || []);

      const orderToDelete = allOrders.find(o => o.id === orderId || o.order_id == orderId || String(o.id) === String(orderId));
      allOrders = allOrders.filter(o => o.id !== orderId && o.order_id != orderId && String(o.id) !== String(orderId));
      StorageDB.saveOrders(allOrders);

      if (typeof ApiClient !== "undefined" && orderToDelete && (orderToDelete.order_id || orderToDelete.db_id)) {
        try {
          const dbId = orderToDelete.order_id || orderToDelete.db_id || parseInt(String(orderToDelete.id).replace(/[^0-9]/g, ''));
          await fetch(`./api/orders.php?order_id=${dbId}`, { method: 'DELETE' });
        } catch (e) {}
      }

      renderAdminOrders();
      updateDashboardMetrics();
    }
  };

  // Print Order Invoice
  window.printOrderInvoice = function(orderId) {
    const allOrders = (typeof StorageDB.getAllOrders === 'function')
      ? StorageDB.getAllOrders()
      : (JSON.parse(localStorage.getItem("tz_orders")) || []);

    const order = allOrders.find(o => o.id === orderId || o.order_id == orderId || String(o.id) === String(orderId));
    if (!order) return;

    const amounts = getOrderAmounts(order);

    const printWin = window.open('', '_blank');
    const itemsRows = Array.isArray(order.items)
      ? order.items.map(i => `
          <tr>
            <td style="padding:8px; border-bottom:1px solid #ddd;">${i.name || i.product_name || 'Item'}</td>
            <td style="padding:8px; border-bottom:1px solid #ddd; text-align:center;">${i.qty || i.quantity || 1}</td>
            <td style="padding:8px; border-bottom:1px solid #ddd; text-align:right;">LKR ${Number(i.price || i.unit_price || 0).toLocaleString()}</td>
            <td style="padding:8px; border-bottom:1px solid #ddd; text-align:right;">LKR ${(Number(i.price || i.unit_price || 0) * parseInt(i.qty || i.quantity || 1)).toLocaleString()}</td>
          </tr>
        `).join('')
      : '';

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>D-TEL Invoice #${order.id || order.order_id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #333; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #06b6d4; padding-bottom: 15px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #0f172a; }
          .logo span { color: #06b6d4; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f1f5f9; padding: 10px 8px; text-align: left; }
          .total-box { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">D-<span>TEL</span> CELLULAR</div>
            <p style="margin:4px 0; font-size:12px; color:#64748b;">2nd Road, Piliyandala, Sri Lanka • 070 194 8371</p>
          </div>
          <div style="text-align:right;">
            <h2 style="margin:0; color:#0f172a;">ORDER INVOICE</h2>
            <p style="margin:4px 0; font-size:14px;"><strong>#${order.id || order.order_id}</strong></p>
            <p style="margin:4px 0; font-size:12px; color:#64748b;">Date: ${new Date(order.date || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
          <div>
            <strong style="font-size:13px; color:#64748b; text-transform:uppercase;">Customer Details:</strong>
            <div style="font-size:15px; font-weight:bold; margin-top:4px;">${order.customerName || 'Customer'}</div>
            <div style="font-size:13px; color:#475569;">Phone: ${order.phone || 'N/A'}</div>
            <div style="font-size:13px; color:#475569;">Email: ${order.customerEmail || order.email || 'N/A'}</div>
          </div>
          <div style="text-align:right; max-width:300px;">
            <strong style="font-size:13px; color:#64748b; text-transform:uppercase;">Delivery Address:</strong>
            <div style="font-size:13px; color:#475569; margin-top:4px;">${order.delivery_address || order.address || 'Sri Lanka'}</div>
            <div style="font-size:13px; color:#475569; margin-top:4px;">Payment: <strong>${order.paymentMethod || 'COD'}</strong> (${order.paymentStatus || 'Pending'})</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Unit Price</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding:8px; text-align:right; border-top:1px solid #ddd;">Items Subtotal:</td>
              <td style="padding:8px; text-align:right; border-top:1px solid #ddd; font-weight:bold;">LKR ${amounts.subtotal.toLocaleString()}</td>
            </tr>
            ${amounts.discount > 0 ? `
              <tr>
                <td colspan="3" style="padding:4px 8px; text-align:right; color:#ef4444;">Promo Discount:</td>
                <td style="padding:4px 8px; text-align:right; color:#ef4444; font-weight:bold;">- LKR ${amounts.discount.toLocaleString()}</td>
              </tr>
            ` : ''}
            <tr>
              <td colspan="3" style="padding:4px 8px; text-align:right;">Delivery Fee:</td>
              <td style="padding:4px 8px; text-align:right;">${amounts.deliveryFee === 0 ? 'FREE' : 'LKR ' + amounts.deliveryFee.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <div class="total-box">
          Grand Total: LKR ${amounts.total.toLocaleString()}
        </div>

        <div style="margin-top:40px; text-align:center; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:15px;">
          Thank you for choosing D-TEL Cellular! For inquiries call 070 194 8371 or WhatsApp us.
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  // Stock Toggle Action
  window.toggleStockStatus = async function(productId) {
    const products = StorageDB.getProducts();
    const prod = products.find(p => p.id === productId);
    if (prod) {
      prod.stock = prod.stock > 0 ? 0 : 15;
      StorageDB.saveProducts(products);

      // Attempt MySQL update
      if (typeof ApiClient !== "undefined" && prod.numericId) {
        try {
          await ApiClient.updateProduct({
            product_id: prod.numericId,
            category_id: prod.category_id || CATEGORY_MAP[prod.category] || 1,
            product_name: prod.name,
            brand: prod.brand,
            model: prod.model,
            price: prod.price,
            stock: prod.stock,
            description: prod.description,
            specs: prod.specs,
            image: prod.image,
            image_2: prod.image_2 || prod.image2 || null,
            image_3: prod.image_3 || prod.image3 || null,
            status: prod.stock > 0 ? 'active' : 'out_of_stock'
          });
        } catch (e) {
          console.warn("MySQL stock update skipped:", e);
        }
      }

      renderAdminProducts();
      renderStockAlerts();
      updateDashboardMetrics();
    }
  };

  // Delete Product Action
  window.handleDeleteProduct = async function(productId) {
    if (confirm("Are you sure you want to permanently delete this product listing from both database & store?")) {
      const products = StorageDB.getProducts();
      const prod = products.find(p => p.id === productId);

      if (prod && typeof ApiClient !== "undefined" && prod.numericId) {
        try {
          await ApiClient.deleteProduct(prod.numericId);
        } catch (e) {
          console.warn("MySQL delete skipped:", e);
        }
      }

      StorageDB.deleteProduct(productId);
      renderAdminProducts();
      renderStockAlerts();
      updateDashboardMetrics();
    }
  };

  // Update Order Status
  window.updateOrderStatus = async function(orderId, newStatus) {
    const allOrders = (typeof StorageDB.getAllOrders === 'function')
      ? StorageDB.getAllOrders()
      : (JSON.parse(localStorage.getItem("tz_orders")) || []);

    const order = allOrders.find(o => o.id === orderId || o.order_id == orderId || String(o.id) === String(orderId));
    if (order) {
      order.status = newStatus;
      StorageDB.saveOrders(allOrders);

      if (typeof ApiClient !== "undefined" && (order.order_id || order.db_id)) {
        try {
          const dbId = order.order_id || order.db_id || parseInt(String(order.id).replace(/[^0-9]/g, ''));
          await ApiClient.updateOrderStatus(dbId, newStatus, order.paymentStatus || order.payment_status || null);
        } catch (e) {
          console.warn("MySQL order status update skipped:", e);
        }
      }

      renderAdminOrders();
      updateDashboardMetrics();
    }
  };

  // Open Add Product Modal
  window.openAddProductModal = function() {
    openProductFormModal(null);
  };

  // Open Edit Product Modal
  window.openEditProductModal = function(productId) {
    const prod = StorageDB.getProductById(productId);
    if (prod) openProductFormModal(prod);
  };

  // Helper for Uploading image file
  async function uploadImageFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('./api/upload.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success' && data.url) {
        return data.url;
      }
    } catch (err) {
      console.warn("File upload to server failed, using base64 preview:", err);
    }
    // Fallback to Data URL for instant standalone preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  // Product Add / Edit Modal Engine with 3 Image Views
  function openProductFormModal(product = null) {
    if (!productModalOverlay) return;

    const isEdit = !!product;
    const initialCat = product ? product.category : "Smartphones";
    const img1 = product ? (product.image || "images/cat-chargers.svg") : "images/iphone_15_pro.png";
    const img2 = product ? (product.image_2 || product.image2 || "") : "";
    const img3 = product ? (product.image_3 || product.image3 || "") : "";

    const hasOffer = product ? (product.is_offer == 1 || product.is_offer === true || (product.oldPrice && product.oldPrice > product.price)) : false;
    const origPriceVal = product ? (product.original_price || product.oldPrice || (hasOffer ? product.price : '')) : '';
    const offerPriceVal = product ? (product.offer_price || (hasOffer ? product.price : '')) : '';

    productModalOverlay.querySelector(".modal-card").innerHTML = `
      <button class="modal-close-btn" onclick="window.closeProductModal()" title="Close">&times;</button>
      
      <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border-color); padding-bottom:1rem;">
        <div style="width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg, var(--accent-cyan), var(--accent-blue)); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.2rem;">
          <i class="fas ${isEdit ? 'fa-edit' : 'fa-plus-circle'}"></i>
        </div>
        <div>
          <h2 style="font-size:1.35rem; margin-bottom:2px;">${isEdit ? 'Edit Mobile Product Listing' : 'Add New Product (3-Image Views & Database Sync)'}</h2>
          <p style="font-size:0.8rem; color:var(--text-muted);">Configure item details, 3 visual perspectives, and assign to appropriate category</p>
        </div>
      </div>

      <form id="productForm">
        <!-- 1. PRODUCT GENERAL INFO -->
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:1rem; margin-bottom:1rem;">
          <div>
            <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#fff;">
              Product Name <span style="color:var(--accent-rose);">*</span>
            </label>
            <input type="text" id="pName" required value="${isEdit ? (product.name || '') : ''}" placeholder="e.g. iPhone 15 Pro Max (256GB Natural Titanium)">
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#fff;">
              Store Category <span style="color:var(--accent-rose);">*</span>
            </label>
            <select id="pCategory" required style="font-weight:600; color:var(--accent-cyan);">
              <option value="Smartphones" ${initialCat === 'Smartphones' ? 'selected' : ''}>1. Smartphones (5G Flagships)</option>
              <option value="Chargers" ${initialCat === 'Chargers' ? 'selected' : ''}>2. Chargers & GaN Adapters</option>
              <option value="Covers" ${initialCat === 'Covers' ? 'selected' : ''}>3. Covers & 9H Glass</option>
              <option value="Audio" ${initialCat === 'Audio' ? 'selected' : ''}>4. Audio, ANC & Earbuds</option>
              <option value="Power" ${initialCat === 'Power' ? 'selected' : ''}>5. Power Banks (10k-24k mAh)</option>
              <option value="Accessories" ${initialCat === 'Accessories' ? 'selected' : ''}>6. Essential Accessories</option>
            </select>
          </div>
        </div>

        <!-- 2. BRAND, PRICING & STOCK ROW -->
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; margin-bottom:1rem;">
          <div>
            <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#fff;">
              Brand Name <span style="color:var(--accent-rose);">*</span>
            </label>
            <input type="text" id="pBrand" required value="${isEdit ? (product.brand || '') : ''}" placeholder="e.g. Apple / Samsung / Anker / Baseus">
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#fff;">
              Price (LKR) <span style="color:var(--accent-rose);">*</span>
            </label>
            <input type="number" id="pPrice" step="any" required value="${isEdit ? (product.original_price || product.oldPrice || product.price) : ''}" placeholder="420000">
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#fff;">
              Initial Stock Count <span style="color:var(--accent-rose);">*</span>
            </label>
            <input type="number" id="pStock" required min="0" value="${isEdit ? (product.stock !== undefined ? product.stock : 10) : 15}" placeholder="15">
          </div>
        </div>

        <!-- SPECIAL OFFER & DISCOUNT PROMOTION SECTION -->
        <div style="background:linear-gradient(135deg, rgba(244,63,94,0.09), rgba(239,68,68,0.03)); border:1.5px solid rgba(244,63,94,0.32); border-radius:var(--radius-md); padding:1rem 1.25rem; margin-bottom:1.25rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
            <label style="display:flex; align-items:center; gap:0.65rem; cursor:pointer; font-size:0.92rem; font-weight:800; color:#ffffff; margin:0;">
              <input type="checkbox" id="pIsOffer" style="width:19px; height:19px; accent-color:#f43f5e; cursor:pointer;" ${hasOffer ? 'checked' : ''} onchange="window.toggleOfferInputs(this.checked)">
              <span><i class="fas fa-tags" style="color:var(--accent-rose);"></i> Set as Special Offer / Flash Deal Item</span>
            </label>
            <span style="font-size:0.75rem; background:rgba(244,63,94,0.2); color:#fb7185; border:1px solid rgba(244,63,94,0.4); padding:0.2rem 0.65rem; border-radius:var(--radius-full); font-weight:700;">
              SALE % PROMOTION
            </span>
          </div>

          <div id="offerInputsRow" style="display:${hasOffer ? 'grid' : 'none'}; grid-template-columns:1fr 1fr 1.2fr; gap:1rem; margin-top:1rem; padding-top:1rem; border-top:1px dashed rgba(244,63,94,0.25);">
            <div>
              <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#fca5a5;">
                Regular / Original Price (LKR) <span style="color:var(--accent-rose);">*</span>
              </label>
              <input type="number" id="pOriginalPrice" step="any" value="${origPriceVal}" placeholder="e.g. 420000" oninput="window.calcOfferPreview()">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#67e8f9;">
                Special Offer Price (LKR) <span style="color:var(--accent-cyan);">*</span>
              </label>
              <input type="number" id="pOfferPrice" step="any" value="${offerPriceVal}" placeholder="e.g. 385000" oninput="window.calcOfferPreview()">
            </div>
            <div>
              <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#a7f3d0;">
                Calculated Deal Discount
              </label>
              <div id="offerPreviewText" style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.08); border-radius:6px; padding:0.45rem 0.75rem; font-size:0.85rem; font-weight:800; color:#34d399; height:42px; display:flex; align-items:center;">
                ${hasOffer && origPriceVal && offerPriceVal ? `🔥 ${Math.round(((origPriceVal - offerPriceVal)/origPriceVal)*100)}% OFF (Save LKR ${(origPriceVal - offerPriceVal).toLocaleString()})` : 'Enter prices to preview discount'}
              </div>
            </div>
          </div>
        </div>

        <!-- 3. MODEL, CONNECTOR & QUALITY TIER -->
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; margin-bottom:1.25rem;">
          <div>
            <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#fff;">Target Model Compatibility</label>
            <input type="text" id="pModel" value="${isEdit ? (product.model || '') : ''}" placeholder="e.g. iPhone 15 / Universal Fit">
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#fff;">Connector / Interface</label>
            <input type="text" id="pConnector" value="${isEdit ? (product.connector || 'USB-C') : 'USB-C'}" placeholder="USB-C / MagSafe / Lightning / Wireless">
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#fff;">Quality Tier / Badge</label>
            <input type="text" id="pBadge" value="${isEdit ? (product.qualityTier || product.badge || '') : 'New Arrival'}" placeholder="Super D / Official Warranty / Flagship">
          </div>
        </div>

        <!-- 4. PRODUCT 3-IMAGE VIEWS SECTION -->
        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem;">
            <div>
              <span style="font-size:0.95rem; font-weight:800; color:#fff; display:inline-flex; align-items:center; gap:0.5rem;">
                <i class="fas fa-images" style="color:var(--accent-cyan);"></i> Product Gallery Images (3 Views)
              </span>
              <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Upload image files or paste asset/web URLs for all 3 viewing angles</p>
            </div>
            <span style="font-size:0.75rem; background:rgba(6,182,212,0.15); color:var(--accent-cyan); padding:0.25rem 0.6rem; border-radius:var(--radius-full); font-weight:700;">
              3 Image Slots
            </span>
          </div>

          <div class="image-slots-grid">
            
            <!-- IMAGE VIEW 1: MAIN PRODUCT IMAGE -->
            <div class="image-slot-card ${img1 ? 'has-image' : ''}" id="slot1Card">
              <button type="button" class="image-clear-btn" onclick="window.clearImageSlot(1)" title="Remove Image">&times;</button>
              <div class="image-slot-badge">
                <i class="fas fa-star" style="color:var(--accent-amber);"></i> View 1 (Main View) *
              </div>
              <div class="image-slot-preview" id="slot1Preview">
                ${img1 
                  ? `<img src="${img1}" id="slot1Img" alt="View 1 Preview" onerror="this.onerror=null; this.src='images/cat-chargers.svg';">` 
                  : `<div class="empty-placeholder"><i class="fas fa-camera"></i><span>Main Photo</span></div>`
                }
              </div>
              <div class="image-slot-actions">
                <input type="file" accept="image/*" class="image-file-input" id="slot1FileInput" onchange="window.handleSlotFileChange(1, this)">
                <button type="button" class="image-upload-btn" onclick="document.getElementById('slot1FileInput').click()">
                  <i class="fas fa-upload"></i> Choose File
                </button>
                <input type="text" id="slot1Url" class="image-url-input" required value="${img1}" placeholder="images/photo.png or URL" oninput="window.updateSlotPreview(1, this.value)">
              </div>
            </div>

            <!-- IMAGE VIEW 2: DETAIL / SIDE VIEW -->
            <div class="image-slot-card ${img2 ? 'has-image' : ''}" id="slot2Card">
              <button type="button" class="image-clear-btn" onclick="window.clearImageSlot(2)" title="Remove Image">&times;</button>
              <div class="image-slot-badge" style="background:rgba(59,130,246,0.15); color:var(--accent-blue);">
                <i class="fas fa-search-plus"></i> View 2 (Detail View)
              </div>
              <div class="image-slot-preview" id="slot2Preview">
                ${img2 
                  ? `<img src="${img2}" id="slot2Img" alt="View 2 Preview" onerror="this.onerror=null; this.src='images/cat-chargers.svg';">` 
                  : `<div class="empty-placeholder"><i class="fas fa-image"></i><span>Detail / Side</span></div>`
                }
              </div>
              <div class="image-slot-actions">
                <input type="file" accept="image/*" class="image-file-input" id="slot2FileInput" onchange="window.handleSlotFileChange(2, this)">
                <button type="button" class="image-upload-btn" onclick="document.getElementById('slot2FileInput').click()">
                  <i class="fas fa-upload"></i> Choose File
                </button>
                <input type="text" id="slot2Url" class="image-url-input" value="${img2}" placeholder="Detail image URL / Path" oninput="window.updateSlotPreview(2, this.value)">
              </div>
            </div>

            <!-- IMAGE VIEW 3: ANGLE / PACKAGING VIEW -->
            <div class="image-slot-card ${img3 ? 'has-image' : ''}" id="slot3Card">
              <button type="button" class="image-clear-btn" onclick="window.clearImageSlot(3)" title="Remove Image">&times;</button>
              <div class="image-slot-badge" style="background:rgba(168,85,247,0.15); color:#c084fc;">
                <i class="fas fa-cube"></i> View 3 (Angle View)
              </div>
              <div class="image-slot-preview" id="slot3Preview">
                ${img3 
                  ? `<img src="${img3}" id="slot3Img" alt="View 3 Preview" onerror="this.onerror=null; this.src='images/cat-chargers.svg';">` 
                  : `<div class="empty-placeholder"><i class="fas fa-box-open"></i><span>Angle / Box</span></div>`
                }
              </div>
              <div class="image-slot-actions">
                <input type="file" accept="image/*" class="image-file-input" id="slot3FileInput" onchange="window.handleSlotFileChange(3, this)">
                <button type="button" class="image-upload-btn" onclick="document.getElementById('slot3FileInput').click()">
                  <i class="fas fa-upload"></i> Choose File
                </button>
                <input type="text" id="slot3Url" class="image-url-input" value="${img3}" placeholder="Angle image URL / Path" oninput="window.updateSlotPreview(3, this.value)">
              </div>
            </div>

          </div>
        </div>

        <!-- 5. TECHNICAL SPECS & DESCRIPTION -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
          <div>
            <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#fff;">Technical Specifications (Highlights)</label>
            <textarea id="pSpecs" rows="2" placeholder="e.g. 65W GaN III Fast Tech, Dual USB-C + USB-A Ports, ActiveShield 2.0">${isEdit ? (product.specs || '') : ''}</textarea>
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:0.35rem; color:#fff;">Full Product Description</label>
            <textarea id="pDesc" rows="2" placeholder="e.g. Original D-TEL hardware guaranteed with 6-12 months warranty...">${isEdit ? (product.description || '') : ''}</textarea>
          </div>
        </div>

        <!-- SUBMIT BUTTON -->
        <button type="submit" id="saveProductBtn" class="btn-primary" style="width:100%; padding:0.95rem; font-size:1rem; display:flex; align-items:center; justify-content:center; gap:0.6rem;">
          <i class="fas fa-save"></i> ${isEdit ? 'Save & Sync Changes to Database' : 'Publish Product to Store & Database'}
        </button>
      </form>
    `;

    productModalOverlay.classList.add("active");

    window.toggleOfferInputs = function(checked) {
      const row = document.getElementById("offerInputsRow");
      if (row) row.style.display = checked ? "grid" : "none";
      if (checked) {
        const pPriceEl = document.getElementById("pPrice");
        const pOrigEl = document.getElementById("pOriginalPrice");
        if (pPriceEl && pOrigEl && !pOrigEl.value && pPriceEl.value) {
          pOrigEl.value = pPriceEl.value;
        }
        window.calcOfferPreview();
      }
    };

    window.calcOfferPreview = function() {
      const orig = parseFloat(document.getElementById("pOriginalPrice")?.value || 0);
      const offer = parseFloat(document.getElementById("pOfferPrice")?.value || 0);
      const preview = document.getElementById("offerPreviewText");
      if (!preview) return;
      if (orig > 0 && offer > 0 && orig > offer) {
        const pct = Math.round(((orig - offer) / orig) * 100);
        const diff = orig - offer;
        preview.style.color = "#34d399";
        preview.innerHTML = `<i class="fas fa-fire" style="color:#f43f5e; margin-right:4px;"></i> <strong>-${pct}% OFF</strong> <span style="font-size:0.75rem; color:#94a3b8; margin-left:6px;">(Save Rs. ${diff.toLocaleString()})</span>`;
      } else if (orig > 0 && offer >= orig) {
        preview.style.color = "#f87171";
        preview.innerHTML = `<i class="fas fa-exclamation-circle"></i> Offer price must be less than regular price`;
      } else {
        preview.style.color = "#94a3b8";
        preview.textContent = "Enter original & offer prices";
      }
    };

    function resolveImagePath(val) {
      if (!val) return '';
      val = val.trim();
      if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:') || val.startsWith('images/') || val.startsWith('/') || val.startsWith('./')) {
        return val;
      }
      return 'images/' + val;
    }

    window.updateSlotPreview = function(slotNum, rawUrl) {
      const card = document.getElementById(`slot${slotNum}Card`);
      const preview = document.getElementById(`slot${slotNum}Preview`);
      const cleaned = (rawUrl || '').trim();

      if (cleaned) {
        const resolved = resolveImagePath(cleaned);
        card.classList.add("has-image");
        preview.innerHTML = `<img src="${resolved}" id="slot${slotNum}Img" alt="View ${slotNum} Preview" onerror="this.onerror=null; this.src='images/cat-chargers.svg';">`;
      } else {
        card.classList.remove("has-image");
        const placeholderText = slotNum === 1 ? "Main Photo" : slotNum === 2 ? "Detail / Side" : "Angle / Box";
        const placeholderIcon = slotNum === 1 ? "fa-camera" : slotNum === 2 ? "fa-image" : "fa-box-open";
        preview.innerHTML = `<div class="empty-placeholder"><i class="fas ${placeholderIcon}"></i><span>${placeholderText}</span></div>`;
      }
    };

    window.clearImageSlot = function(slotNum) {
      const urlInput = document.getElementById(`slot${slotNum}Url`);
      const fileInput = document.getElementById(`slot${slotNum}FileInput`);
      if (urlInput) urlInput.value = "";
      if (fileInput) fileInput.value = "";
      window.updateSlotPreview(slotNum, "");
    };

    window.handleSlotFileChange = async function(slotNum, inputEl) {
      if (inputEl.files && inputEl.files[0]) {
        const file = inputEl.files[0];
        const preview = document.getElementById(`slot${slotNum}Preview`);
        const urlInput = document.getElementById(`slot${slotNum}Url`);

        preview.innerHTML = `<div class="empty-placeholder"><i class="fas fa-spinner fa-spin" style="color:var(--accent-cyan);"></i><span>Loading ${file.name}...</span></div>`;

        try {
          const uploadedUrl = await uploadImageFile(file);
          if (urlInput) urlInput.value = uploadedUrl;
          window.updateSlotPreview(slotNum, uploadedUrl);
        } catch (err) {
          alert("Could not process image file. Please paste a valid URL or path instead.");
          window.updateSlotPreview(slotNum, "");
        }
      }
    };

    [1, 2, 3].forEach(slotNum => {
      const card = document.getElementById(`slot${slotNum}Card`);
      if (card) {
        card.addEventListener('dragover', (e) => {
          e.preventDefault();
          card.style.borderColor = 'var(--accent-cyan)';
          card.style.background = 'rgba(6, 182, 212, 0.15)';
        });
        card.addEventListener('dragleave', (e) => {
          e.preventDefault();
          card.style.borderColor = '';
          card.style.background = '';
        });
        card.addEventListener('drop', async (e) => {
          e.preventDefault();
          card.style.borderColor = '';
          card.style.background = '';
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const fileInput = document.getElementById(`slot${slotNum}FileInput`);
            fileInput.files = e.dataTransfer.files;
            window.handleSlotFileChange(slotNum, fileInput);
          }
        });
      }
    });

    const form = document.getElementById("productForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("saveProductBtn");
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Saving to Database...`;

      const chosenCategory = document.getElementById("pCategory").value;
      const categoryId = CATEGORY_MAP[chosenCategory] || 1;
      const rawSlot1 = document.getElementById("slot1Url").value.trim();
      const rawSlot2 = document.getElementById("slot2Url").value.trim();
      const rawSlot3 = document.getElementById("slot3Url").value.trim();

      const view1Image = rawSlot1 ? resolveImagePath(rawSlot1) : 'images/cat-chargers.svg';
      const view2Image = rawSlot2 ? resolveImagePath(rawSlot2) : null;
      const view3Image = rawSlot3 ? resolveImagePath(rawSlot3) : null;

      const isOffer = document.getElementById("pIsOffer") ? document.getElementById("pIsOffer").checked : false;
      const rawOrig = document.getElementById("pOriginalPrice") ? parseFloat(document.getElementById("pOriginalPrice").value) : null;
      const rawOffer = document.getElementById("pOfferPrice") ? parseFloat(document.getElementById("pOfferPrice").value) : null;

      let finalPrice = parseFloat(document.getElementById("pPrice").value);
      let originalPrice = null;
      let offerPrice = null;

      if (isOffer) {
        if (!rawOffer || rawOffer <= 0) {
          alert("Please enter a valid Special Offer Price.");
          saveBtn.disabled = false;
          saveBtn.innerHTML = isEdit ? 'Save & Sync Changes to Database' : 'Publish Product to Store & Database';
          return;
        }
        originalPrice = (rawOrig && rawOrig > 0) ? rawOrig : finalPrice;
        if (rawOffer >= originalPrice) {
          alert("Special Offer Price must be lower than the Regular / Original Price.");
          saveBtn.disabled = false;
          saveBtn.innerHTML = isEdit ? 'Save & Sync Changes to Database' : 'Publish Product to Store & Database';
          return;
        }
        offerPrice = rawOffer;
        finalPrice = rawOffer; // selling price
      }

      const productPayload = {
        id: isEdit ? product.id : `prod_${Date.now()}`,
        numericId: isEdit ? (product.numericId || (String(product.id).replace('prod_', ''))) : null,
        product_id: isEdit ? (product.numericId || parseInt(String(product.id).replace('prod_', '')) || undefined) : undefined,
        category_id: categoryId,
        category: chosenCategory,
        name: document.getElementById("pName").value.trim(),
        product_name: document.getElementById("pName").value.trim(),
        brand: (typeof normalizeBrand === 'function') ? normalizeBrand(document.getElementById("pBrand").value.trim()) : (document.getElementById("pBrand").value.trim() || 'Generic'),
        model: document.getElementById("pModel").value.trim() || '',
        price: finalPrice,
        oldPrice: isOffer ? originalPrice : null,
        original_price: isOffer ? originalPrice : null,
        offer_price: isOffer ? offerPrice : null,
        is_offer: isOffer ? 1 : 0,
        stock: parseInt(document.getElementById("pStock").value),
        connector: document.getElementById("pConnector").value.trim() || 'USB-C',
        badge: isOffer ? (document.getElementById("pBadge").value.trim() || '🔥 SPECIAL OFFER') : (document.getElementById("pBadge").value.trim() || 'New Arrival'),
        qualityTier: (chosenCategory === 'Covers' && document.getElementById("pBadge").value.trim()) ? document.getElementById("pBadge").value.trim() : (isEdit ? product.qualityTier : null),
        specs: document.getElementById("pSpecs").value.trim(),
        description: document.getElementById("pDesc").value.trim() || "High quality guaranteed mobile hardware from D-TEL.",
        image: view1Image,
        image_2: view2Image,
        image_3: view3Image,
        image2: view2Image,
        image3: view3Image,
        screenSize: isEdit ? product.screenSize : "Universal Fit",
        rating: isEdit ? (product.rating || 4.9) : 4.9,
        reviewsCount: isEdit ? (product.reviewsCount || 12) : 12,
        status: parseInt(document.getElementById("pStock").value) > 0 ? 'active' : 'out_of_stock'
      };

      if (typeof ApiClient !== "undefined") {
        try {
          if (isEdit && productPayload.product_id) {
            await ApiClient.updateProduct(productPayload);
          } else {
            const apiRes = await ApiClient.createProduct(productPayload);
            if (apiRes && apiRes.product_id) {
              productPayload.numericId = apiRes.product_id;
              productPayload.id = `prod_${apiRes.product_id}`;
            }
          }
        } catch (dbErr) {
          console.warn("MySQL Database sync had an error:", dbErr);
        }
      }

      StorageDB.saveProduct(productPayload);

      window.closeProductModal();
      renderAdminProducts();
      renderStockAlerts();
      updateDashboardMetrics();

      alert(`Product "${productPayload.name}" saved successfully!`);
    });
  }

  window.closeProductModal = function() {
    if (productModalOverlay) productModalOverlay.classList.remove("active");
  };

  if (productModalOverlay) {
    productModalOverlay.addEventListener("click", (e) => {
      if (e.target === productModalOverlay) {
        window.closeProductModal();
      }
    });
  }

  // =========================================================================
  // STORE & LOCATION MANAGEMENT CONTROLLER
  // =========================================================================
  function renderAdminStoreSettings() {
    if (typeof StorageDB === 'undefined' || !StorageDB.getStoreSettings) return;
    const s = StorageDB.getStoreSettings();

    const nameEl = document.getElementById("settingStoreName");
    const phoneEl = document.getElementById("settingPhone");
    const waEl = document.getElementById("settingWhatsapp");
    const emailEl = document.getElementById("settingEmail");
    const addrEl = document.getElementById("settingAddress");
    const hoursEl = document.getElementById("settingHours");
    const cityEl = document.getElementById("settingCity");

    if (nameEl) nameEl.value = s.name || "D-TEL Cellular";
    if (phoneEl) phoneEl.value = s.phone || "070 194 8371";
    if (waEl) waEl.value = s.whatsapp || "0701948371";
    if (emailEl) emailEl.value = s.email || "dtel@gmail.com";
    if (addrEl) addrEl.value = s.address || "2nd Road, Piliyandala, Sri Lanka";
    if (hoursEl) hoursEl.value = s.hours || "Mon - Sat: 9:00 AM - 8:30 PM | Sunday: 10:00 AM - 6:00 PM";
    if (cityEl) cityEl.value = s.city || "Piliyandala";

    updateMapIframe(s.address || s.city || "Piliyandala, Sri Lanka");
  }

  function updateMapIframe(query) {
    const iframe = document.getElementById("settingMapIframe");
    const link = document.getElementById("settingLiveMapLink");
    const encoded = encodeURIComponent(query.trim() || "Piliyandala, Sri Lanka");
    if (iframe) {
      iframe.src = `https://maps.google.com/maps?q=${encoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    if (link) {
      link.href = `https://maps.google.com/?q=${encoded}`;
    }
  }

  let mapDebounceTimer = null;
  window.updateAdminMapPreviewFromInput = function() {
    clearTimeout(mapDebounceTimer);
    mapDebounceTimer = setTimeout(() => {
      const addrEl = document.getElementById("settingAddress");
      const cityEl = document.getElementById("settingCity");
      const query = (addrEl ? addrEl.value : "") + (cityEl ? ", " + cityEl.value : "");
      updateMapIframe(query);
    }, 600);
  };

  window.refreshAdminMapPreview = function() {
    const addrEl = document.getElementById("settingAddress");
    const cityEl = document.getElementById("settingCity");
    const query = (addrEl ? addrEl.value : "") + (cityEl ? ", " + cityEl.value : "");
    updateMapIframe(query);
  };

  window.handleSaveStoreSettings = function(e) {
    e.preventDefault();
    const name = document.getElementById("settingStoreName").value.trim();
    const phone = document.getElementById("settingPhone").value.trim();
    const whatsapp = document.getElementById("settingWhatsapp").value.trim();
    const email = document.getElementById("settingEmail").value.trim();
    const address = document.getElementById("settingAddress").value.trim();
    const hours = document.getElementById("settingHours").value.trim();
    const city = document.getElementById("settingCity").value.trim();

    const payload = {
      name,
      phone,
      whatsapp,
      email,
      address,
      hours,
      city,
      mapQuery: address || city
    };

    StorageDB.saveStoreSettings(payload);

    const alertEl = document.getElementById("saveStoreSettingsAlert");
    if (alertEl) {
      alertEl.style.display = "inline-flex";
      alertEl.innerHTML = `<i class="fas fa-check-circle"></i> Store settings & location updated live across website!`;
      setTimeout(() => { alertEl.style.display = "none"; }, 4000);
    }
    alert("✅ D-TEL Store details & Google Maps location updated successfully across all customer pages!");
  };

  // =========================================================================
  // CUSTOMER ACCOUNTS - READ ONLY ADMIN DIRECTORY
  // =========================================================================
  let adminCustomers = [];

  function escapeCustomerHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
    }[ch]));
  }

  function renderAdminCustomers(list = adminCustomers) {
    const tbody = document.getElementById('adminCustomersTable');
    const countEl = document.getElementById('adminCustomerCount');
    if (countEl) countEl.textContent = `${adminCustomers.length} Customer${adminCustomers.length === 1 ? '' : 's'}`;
    if (!tbody) return;

    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:2rem;">No registered customers found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(c => {
      const registered = c.created_at ? new Date(c.created_at).toLocaleString() : 'N/A';
      const orders = Number(c.order_count || 0);
      return `
        <tr>
          <td><strong>#${escapeCustomerHtml(c.user_id)}</strong></td>
          <td>
            <div style="display:flex; align-items:center; gap:.55rem;">
              <span style="width:34px;height:34px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:rgba(59,130,246,.12);color:var(--accent-blue);"><i class="fas fa-user"></i></span>
              <strong style="color:#fff;">${escapeCustomerHtml(c.name || 'Customer')}</strong>
            </div>
          </td>
          <td>${escapeCustomerHtml(c.email || 'N/A')}</td>
          <td>${escapeCustomerHtml(c.phone || 'N/A')}</td>
          <td style="max-width:240px; white-space:normal;">${escapeCustomerHtml(c.address || 'N/A')}</td>
          <td style="white-space:nowrap;">${escapeCustomerHtml(registered)}</td>
          <td><span style="background:rgba(16,185,129,.12); color:var(--accent-green); padding:.25rem .55rem; border-radius:999px; font-weight:700;">${orders}</span></td>
          <td><button type="button" class="btn-secondary" style="font-size:.78rem; padding:.45rem .7rem;" onclick='window.viewAdminCustomer(${JSON.stringify(c.user_id)})'><i class="fas fa-eye"></i> View</button></td>
        </tr>`;
    }).join('');
  }

  window.refreshAdminCustomers = async function() {
    const tbody = document.getElementById('adminCustomersTable');
    if (tbody) tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:2rem;"><i class="fas fa-spinner fa-spin"></i> Loading customer accounts...</td></tr>`;
    try {
      const res = await ApiClient.getAdminCustomers();
      if (res && res.status === 'success' && Array.isArray(res.data)) {
        adminCustomers = res.data;
        renderAdminCustomers();
      } else {
        throw new Error(res?.message || 'Could not load customer accounts');
      }
    } catch (err) {
      console.warn('Customer directory load failed:', err);
      if (tbody) tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--accent-rose); padding:2rem;">Could not load customer accounts. Check MySQL connection.</td></tr>`;
    }
  };

  window.filterAdminCustomers = function() {
    const q = (document.getElementById('customerSearchInput')?.value || '').trim().toLowerCase();
    if (!q) return renderAdminCustomers();
    const filtered = adminCustomers.filter(c => [c.user_id, c.name, c.email, c.phone, c.address].some(v => String(v ?? '').toLowerCase().includes(q)));
    renderAdminCustomers(filtered);
  };

  window.viewAdminCustomer = function(userId) {
    const customer = adminCustomers.find(c => String(c.user_id) === String(userId));
    const overlay = document.getElementById('customerDetailsModalOverlay');
    if (!customer || !overlay) return;
    const card = overlay.querySelector('.modal-card');
    if (!card) return;
    const registered = customer.created_at ? new Date(customer.created_at).toLocaleString() : 'N/A';
    const totalSpent = Number(customer.total_spent || 0).toLocaleString('en-LK', {minimumFractionDigits:2, maximumFractionDigits:2});
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1.25rem;">
        <div><h2 style="margin:0;color:#fff;"><i class="fas fa-user-circle" style="color:var(--accent-blue);"></i> Customer Details</h2><p style="margin:.25rem 0 0;color:var(--text-muted);font-size:.82rem;">Read-only customer information</p></div>
        <button type="button" class="btn-secondary" onclick="window.closeAdminCustomerDetails()"><i class="fas fa-times"></i> Close</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">
        <div class="customer-readonly-field"><small>Customer ID</small><strong>#${escapeCustomerHtml(customer.user_id)}</strong></div>
        <div class="customer-readonly-field"><small>Full Name</small><strong>${escapeCustomerHtml(customer.name)}</strong></div>
        <div class="customer-readonly-field"><small>Email</small><strong>${escapeCustomerHtml(customer.email)}</strong></div>
        <div class="customer-readonly-field"><small>Phone</small><strong>${escapeCustomerHtml(customer.phone)}</strong></div>
        <div class="customer-readonly-field" style="grid-column:1/-1;"><small>Address</small><strong>${escapeCustomerHtml(customer.address || 'N/A')}</strong></div>
        <div class="customer-readonly-field"><small>Registered Date</small><strong>${escapeCustomerHtml(registered)}</strong></div>
        <div class="customer-readonly-field"><small>Total Orders</small><strong>${escapeCustomerHtml(customer.order_count || 0)}</strong></div>
        <div class="customer-readonly-field"><small>Total Non-Cancelled Spend</small><strong>LKR ${escapeCustomerHtml(totalSpent)}</strong></div>
      </div>
      <div style="margin-top:1.25rem;padding:.8rem 1rem;border-radius:10px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);color:var(--text-muted);font-size:.8rem;"><i class="fas fa-lock" style="color:var(--accent-amber);"></i> Customer information is display-only. No edit, password view, or delete controls are provided in the Admin Panel.</div>
    `;
    overlay.classList.add('active');
  };

  window.closeAdminCustomerDetails = function() {
    const overlay = document.getElementById('customerDetailsModalOverlay');
    if (overlay) overlay.classList.remove('active');
  };

  const customerModalOverlay = document.getElementById('customerDetailsModalOverlay');
  if (customerModalOverlay) customerModalOverlay.addEventListener('click', e => {
    if (e.target === customerModalOverlay) window.closeAdminCustomerDetails();
  });

  // Initial renders
  updateDashboardMetrics();
  renderAdminProducts();
  renderAdminOrders();
  renderAdminStoreSettings();
  await window.refreshAdminCustomers();
});
