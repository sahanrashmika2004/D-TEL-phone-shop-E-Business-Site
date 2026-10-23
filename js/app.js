/**
 * D-TEL Mobile & Accessories Hub - Main Storefront Application Engine
 * Faculty of Technology, University of Ruhuna - ICT2142 E-Business Project
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const productsGrid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortSelect");
  const priceRange = document.getElementById("priceRange");
  const priceRangeValue = document.getElementById("priceRangeValue");
  const brandCheckboxes = document.querySelectorAll(".brand-checkbox");
  const connectorCheckboxes = document.querySelectorAll(".connector-checkbox");
  const productCountEl = document.getElementById("productCount");

  // Cart Drawer Elements
  const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
  const cartDrawerClose = document.getElementById("cartDrawerClose");
  const cartTriggerBtns = document.querySelectorAll(".cart-trigger");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartDeliveryEl = document.getElementById("cartDelivery");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartBadgeCounters = document.querySelectorAll(".cart-badge-count");
  const clearCartBtn = document.getElementById("clearCartBtn");

  // Wishlist Counters
  const wishlistBadgeCounters = document.querySelectorAll(".wishlist-badge-count");
  const wishlistTriggerBtns = document.querySelectorAll(".wishlist-trigger");

  // Modals
  const detailModalOverlay = document.getElementById("detailModalOverlay");
  const whatsappModalOverlay = document.getElementById("whatsappModalOverlay");
  const codModalOverlay = document.getElementById("codModalOverlay");
  const authModalOverlay = document.getElementById("authModalOverlay");
  const ordersModalOverlay = document.getElementById("ordersModalOverlay");

  // State
  let currentProducts = StorageDB.getProducts();

  // Global Header Counter Update
  window.updateHeaderCounters = function() {
    const cart = StorageDB.getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll(".cart-count-num").forEach(el => el.textContent = totalCount);
    document.querySelectorAll(".cart-badge-count").forEach(el => {
      el.textContent = totalCount;
      el.style.display = totalCount > 0 ? "inline-flex" : "none";
    });
  };

  // Global search input enter key navigation across all pages
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          if (!window.location.pathname.endsWith('shop.html')) {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
          }
        }
      }
    });
  }

  // View Switcher (Grid vs List) for shop.html
  const gridViewBtn = document.getElementById("gridViewBtn");
  const listViewBtn = document.getElementById("listViewBtn");
  const targetGrid = document.getElementById("catalogProductsGrid") || productsGrid;

  if (gridViewBtn && listViewBtn && targetGrid) {
    gridViewBtn.addEventListener("click", () => {
      targetGrid.classList.remove("list-view");
      gridViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");
    });
    listViewBtn.addEventListener("click", () => {
      targetGrid.classList.add("list-view");
      listViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");
    });
  }

  // ==========================================
  // DYNAMIC CATEGORY, BRAND & TIER ENGINE
  // ==========================================
  // DYNAMIC CATEGORY, BRAND & TIER ENGINE
  // ==========================================
  const dynamicBrandListEl = document.getElementById("dynamicBrandList");
  const activeCatLabel = document.getElementById("activeCatLabel");
  const glassTierSection = document.getElementById("glassTierSection");
  const wattageSection = document.getElementById("wattageSection");
  const connectorSection = document.getElementById("connectorSection");
  const categoryDetailBannerEl = document.getElementById("categoryDetailBanner");

  // Dynamic Category Details Banner Renderer
  function renderCategoryBanner(category = "All") {
    if (!categoryDetailBannerEl) return;

    const detail = (typeof CATEGORY_DETAILS !== "undefined" && CATEGORY_DETAILS[category]) 
      ? CATEGORY_DETAILS[category] 
      : (CATEGORY_DETAILS ? CATEGORY_DETAILS["All"] : {
          name: category,
          badge: "Featured Collection",
          icon: "fas fa-mobile-alt",
          tagline: "Explore our collection of authentic products.",
          highlight: "100% Genuine Guaranteed • Official Warranty",
          stats: { items: "5+ Products", warranty: "Official Warranty", delivery: "Express Islandwide", rating: "4.9 ★ Rating" },
          gradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(59, 130, 246, 0.15))",
          border: "rgba(6, 182, 212, 0.35)"
        });

    const allProds = StorageDB.getProducts();
    const catProds = category === "All" ? allProds : allProds.filter(p => (p.category || p.category_name || "").toLowerCase() === category.toLowerCase());
    const minPrice = catProds.length > 0 ? Math.min(...catProds.map(p => p.price)) : 0;
    
    let availableBrands = [];
    if (category !== "All" && typeof CATEGORY_BRANDS !== "undefined" && CATEGORY_BRANDS[category]) {
      availableBrands = CATEGORY_BRANDS[category];
    } else {
      const brandSet = new Set();
      catProds.forEach(p => {
        const nb = typeof normalizeBrand === "function" ? normalizeBrand(p.brand) : p.brand;
        if (nb) brandSet.add(nb);
      });
      availableBrands = Array.from(brandSet);
    }

    categoryDetailBannerEl.innerHTML = `
      <div style="background:${detail.gradient}; border:1px solid ${detail.border}; border-radius:var(--radius-lg); padding:1.5rem 1.75rem; position:relative; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.35); margin-bottom:1.5rem;">
        
        <!-- Decorative Ambient Glow Background -->
        <div style="position:absolute; top:-40px; right:-40px; width:180px; height:180px; background:radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(0,0,0,0) 70%); pointer-events:none;"></div>

        <!-- Top Row: Icon, Category Name, Badge & Starting Price -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:0.85rem; position:relative; z-index:1;">
          <div style="display:flex; align-items:center; gap:0.9rem;">
            <div style="width:48px; height:48px; border-radius:14px; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; font-size:1.4rem; color:var(--accent-cyan); border:1px solid rgba(255,255,255,0.15); box-shadow:0 0 15px rgba(6,182,212,0.3);">
              <i class="${detail.icon}"></i>
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:0.65rem; flex-wrap:wrap;">
                <h2 style="font-size:1.45rem; font-weight:800; color:#ffffff; margin:0; line-height:1.2;">${detail.name}</h2>
                <span style="background:rgba(6, 182, 212, 0.2); color:var(--accent-cyan); border:1px solid var(--accent-cyan); padding:0.2rem 0.65rem; border-radius:var(--radius-full); font-size:0.75rem; font-weight:800; letter-spacing:0.5px;">${detail.badge}</span>
              </div>
              <p style="color:var(--text-muted); font-size:0.88rem; margin-top:0.35rem; max-width:820px; line-height:1.45;">${detail.tagline}</p>
            </div>
          </div>

          <!-- Starting Price Tag -->
          <div style="background:rgba(0,0,0,0.5); border:1px solid var(--border-color); padding:0.6rem 1.1rem; border-radius:var(--radius-md); text-align:right;">
            <span style="font-size:0.72rem; color:var(--text-dim); text-transform:uppercase; font-weight:700; display:block; letter-spacing:0.5px;">Starting From</span>
            <span style="font-size:1.2rem; font-weight:800; color:var(--accent-cyan);">Rs. ${minPrice.toLocaleString()}</span>
          </div>
        </div>

        <!-- Highlights Banner Bar -->
        <div style="background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.06); border-radius:var(--radius-sm); padding:0.55rem 0.95rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.6rem; font-size:0.84rem; color:#f3f4f6; position:relative; z-index:1;">
          <i class="fas fa-certificate" style="color:var(--accent-green);"></i>
          <span>${detail.highlight}</span>
        </div>

        <!-- 4 Quick Stats / Metrics Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:0.75rem; margin-bottom:1.1rem; position:relative; z-index:1;">
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); padding:0.65rem 0.85rem; border-radius:var(--radius-sm); display:flex; align-items:center; gap:0.65rem;">
            <i class="fas fa-layer-group" style="color:var(--accent-cyan); font-size:1.15rem;"></i>
            <div>
              <span style="font-size:0.7rem; color:var(--text-dim); display:block; text-transform:uppercase; font-weight:600;">Category Models</span>
              <span style="font-weight:700; font-size:0.85rem; color:#ffffff;">${catProds.length} Products</span>
            </div>
          </div>

          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); padding:0.65rem 0.85rem; border-radius:var(--radius-sm); display:flex; align-items:center; gap:0.65rem;">
            <i class="fas fa-shield-alt" style="color:var(--accent-green); font-size:1.15rem;"></i>
            <div>
              <span style="font-size:0.7rem; color:var(--text-dim); display:block; text-transform:uppercase; font-weight:600;">Warranty</span>
              <span style="font-weight:700; font-size:0.85rem; color:#ffffff;">${detail.stats.warranty}</span>
            </div>
          </div>

          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); padding:0.65rem 0.85rem; border-radius:var(--radius-sm); display:flex; align-items:center; gap:0.65rem;">
            <i class="fas fa-truck-fast" style="color:var(--accent-blue); font-size:1.15rem;"></i>
            <div>
              <span style="font-size:0.7rem; color:var(--text-dim); display:block; text-transform:uppercase; font-weight:600;">Dispatch</span>
              <span style="font-weight:700; font-size:0.85rem; color:#ffffff;">${detail.stats.delivery}</span>
            </div>
          </div>

          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); padding:0.65rem 0.85rem; border-radius:var(--radius-sm); display:flex; align-items:center; gap:0.65rem;">
            <i class="fas fa-star" style="color:var(--accent-amber); font-size:1.15rem;"></i>
            <div>
              <span style="font-size:0.7rem; color:var(--text-dim); display:block; text-transform:uppercase; font-weight:600;">Rating</span>
              <span style="font-weight:700; font-size:0.85rem; color:#ffffff;">${detail.stats.rating}</span>
            </div>
          </div>
        </div>

        <!-- Quick Brand Filter Shortcuts Bar -->
        <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-md); padding:0.65rem 1rem; display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; position:relative; z-index:1;">
          <span style="color:var(--accent-cyan); font-weight:800; text-transform:uppercase; font-size:0.78rem; display:inline-flex; align-items:center; gap:0.35rem; margin-right:0.3rem;">
            <i class="fas fa-layer-group"></i> Brands in ${category === 'All' ? 'Catalog' : category}:
          </span>
          <button onclick="window.filterByBrandShortcut('All')" class="brand-shortcut-btn active" data-brand="all" style="background:linear-gradient(135deg, var(--accent-cyan), var(--accent-blue)); color:#ffffff; padding:0.35rem 0.85rem; border-radius:var(--radius-full); font-size:0.8rem; font-weight:700; border:1px solid var(--accent-cyan); cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; box-shadow:0 0 12px rgba(6,182,212,0.35);">
            <i class="fas fa-border-all"></i> All Brands (${catProds.length})
          </button>
          ${availableBrands.map(b => {
            const bMeta = (typeof getBrandMeta === "function") ? getBrandMeta(b) : ((typeof BRAND_META !== "undefined" && BRAND_META[b]) ? BRAND_META[b] : { icon: "fas fa-tag", color: "#38bdf8", bg: "rgba(56,189,248,0.15)" });
            const bCount = catProds.filter(p => (p.brand || "").toLowerCase() === b.toLowerCase()).length;
            return `
              <button onclick="window.filterByBrandShortcut('${b}')" class="brand-shortcut-btn" data-brand="${b.toLowerCase()}" style="background:rgba(255,255,255,0.06); color:#ffffff; padding:0.35rem 0.85rem; border-radius:var(--radius-full); font-size:0.8rem; font-weight:600; border:1px solid rgba(255,255,255,0.12); cursor:pointer; display:inline-flex; align-items:center; gap:0.4rem; transition:all 0.2s ease;">
                <span class="brand-logo-badge" style="width:16px; height:16px; font-size:0.65rem; background:${bMeta.bg}; color:${bMeta.color}; border-radius:3px;">
                  <i class="${bMeta.icon}"></i>
                </span>
                <span>${bMeta.name || b}</span>
                <span style="font-size:0.72rem; color:var(--text-muted); background:rgba(0,0,0,0.3); padding:0.05rem 0.4rem; border-radius:8px;">${bCount}</span>
              </button>
            `;
          }).join("")}
        </div>

      </div>
    `;
  }

  // Quick Brand Filter Shortcut click handler
  window.filterByBrandShortcut = function(brandName) {
    // 1. Sync sidebar checkboxes
    document.querySelectorAll(".brand-checkbox").forEach(cb => {
      if (brandName === "All") {
        cb.checked = false;
      } else {
        cb.checked = (cb.value.toLowerCase() === brandName.toLowerCase());
      }
    });

    // 2. Update active style on the brand buttons in the banner
    document.querySelectorAll(".brand-shortcut-btn").forEach(btn => {
      const btnBrand = btn.getAttribute("data-brand") || "";
      if ((brandName === "All" && btnBrand === "all") || (brandName !== "All" && btnBrand === brandName.toLowerCase())) {
        btn.classList.add("active");
        btn.style.background = "linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))";
        btn.style.borderColor = "var(--accent-cyan)";
        btn.style.color = "#ffffff";
        btn.style.boxShadow = "0 0 12px rgba(6,182,212,0.35)";
      } else {
        btn.classList.remove("active");
        btn.style.background = "rgba(255,255,255,0.06)";
        btn.style.borderColor = "rgba(255,255,255,0.12)";
        btn.style.color = "#ffffff";
        btn.style.boxShadow = "none";
      }
    });

    renderProducts();
  };

  // Dynamic Brand Filter Population with Logos & Strict Category Isolation
  function populateBrandFilters(category = "All") {
    if (!dynamicBrandListEl) return;

    // Get currently checked brands to preserve them across re-population
    const previouslyChecked = Array.from(document.querySelectorAll(".brand-checkbox:checked")).map(cb => cb.value.toLowerCase());

    const allProds = StorageDB.getProducts();
    const catProds = (category === "All") 
      ? allProds 
      : allProds.filter(p => (p.category || p.category_name || "").toLowerCase() === category.toLowerCase());

    const brandSet = new Set();
    catProds.forEach(p => {
      const nb = typeof normalizeBrand === "function" ? normalizeBrand(p.brand) : p.brand;
      if (nb) brandSet.add(nb);
    });

    if (category !== "All" && typeof CATEGORY_BRANDS !== "undefined" && CATEGORY_BRANDS[category]) {
      CATEGORY_BRANDS[category].forEach(b => {
        const nb = typeof normalizeBrand === "function" ? normalizeBrand(b) : b;
        if (nb) brandSet.add(nb);
      });
    }

    let availableBrands = Array.from(brandSet);
    availableBrands = [...new Set(availableBrands.map(b => typeof normalizeBrand === "function" ? normalizeBrand(b) : b))];

    if (activeCatLabel) {
      activeCatLabel.textContent = category === "All" ? "All" : category;
    }

    // Strict Category Section Visibility
    if (glassTierSection) {
      // Screen Protector Quality Tiers (Super D, HD+, MTB) shown ONLY for Covers / Screen Protectors!
      glassTierSection.style.display = (category === "Covers") ? "block" : "none";
    }

    if (wattageSection) {
      // Wattage (20W, 25W, 30W, 45W, 65W) shown ONLY for Chargers!
      wattageSection.style.display = (category === "Chargers") ? "block" : "none";
    }

    if (connectorSection) {
      // Connector (USB-C, Lightning, Micro USB) shown for Chargers or Accessories
      connectorSection.style.display = (category === "Chargers" || category === "Accessories") ? "block" : "none";
    }

    // Render Brand Checkboxes with Icons
    dynamicBrandListEl.innerHTML = availableBrands.map(rawBrand => {
      const brandKey = (typeof normalizeBrand === "function") ? normalizeBrand(rawBrand) : rawBrand;
      const meta = (typeof getBrandMeta === "function") ? getBrandMeta(brandKey) : ((typeof BRAND_META !== "undefined" && BRAND_META[brandKey]) ? BRAND_META[brandKey] : { name: brandKey, icon: "fas fa-tag", color: "#38bdf8", bg: "rgba(56,189,248,0.15)" });
      const prodCount = allProds.filter(p => {
        const matchCat = (category === "All" || (p.category || "").toLowerCase() === (category || "").toLowerCase());
        const matchBrand = (p.brand || "").toLowerCase() === brandKey.toLowerCase();
        return matchCat && matchBrand;
      }).length;

      const brandNameVal = meta.name || brandKey;
      const isChecked = previouslyChecked.includes(brandNameVal.toLowerCase()) || previouslyChecked.includes(rawBrand.toLowerCase());

      return `
        <label class="brand-filter-item">
          <div style="display:flex; align-items:center;">
            <input type="checkbox" class="brand-checkbox" value="${brandNameVal}" ${isChecked ? 'checked' : ''} style="margin-right:0.5rem; accent-color:var(--accent-cyan);">
            <span class="brand-logo-badge" style="background:${meta.bg}; color:${meta.color};">
              <i class="${meta.icon}"></i>
            </span>
            <span style="font-weight:600; color:#ffffff;">${meta.name || brandKey}</span>
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted); background:rgba(255,255,255,0.05); padding:0.1rem 0.4rem; border-radius:10px;">${prodCount}</span>
        </label>
      `;
    }).join("");

    // Re-attach listeners to dynamic brand checkboxes
    document.querySelectorAll(".brand-checkbox").forEach(cb => {
      cb.addEventListener("change", renderProducts);
    });

    // Render Category Banner Details
    renderCategoryBanner(category);
  }

  // Persistent active category state
  window._activeCategory = "All";

  // Category Pill Selection Handler
  window.selectCategoryPill = function(catName) {
    window._activeCategory = catName || "All";
    if (categoryFilter) {
      categoryFilter.value = window._activeCategory;
    }
    window._activeSaleFilter = false;
    const saleBtn = document.getElementById("saleFilterPill");
    if (saleBtn) saleBtn.classList.remove("active");

    document.querySelectorAll(".category-pill-btn").forEach(btn => {
      const isAll = (window._activeCategory === "All" && btn.textContent.includes("All Products"));
      const isMatch = (window._activeCategory !== "All" && btn.textContent.toLowerCase().includes(window._activeCategory.toLowerCase()));
      btn.classList.toggle("active", isAll || isMatch);
    });

    populateBrandFilters(window._activeCategory);
    renderProducts();
  };

  // URL Parameter Handling for Filter Pre-selection
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  const brandParam = urlParams.get('brand');
  const gradeParam = urlParams.get('grade');
  const tierParam = urlParams.get('tier');
  const subParam = urlParams.get('sub');
  const wattageParam = urlParams.get('wattage');
  const searchParam = urlParams.get('search');
  const saleParam = urlParams.get('sale') || urlParams.get('offer');
  window._activeSaleFilter = (saleParam === 'true');

  window._activeCategory = catParam || (categoryFilter ? categoryFilter.value : "All");
  populateBrandFilters(window._activeCategory);

  if (categoryFilter && catParam) {
    categoryFilter.value = catParam;
  }
  document.querySelectorAll(".category-pill-btn").forEach(btn => {
    const isAll = (window._activeCategory === "All" && btn.textContent.includes("All Products"));
    const isMatch = (window._activeCategory !== "All" && btn.textContent.toLowerCase().includes(window._activeCategory.toLowerCase()));
    btn.classList.toggle("active", isAll || isMatch);
  });

  if (gradeParam) {
    setTimeout(() => {
      document.querySelectorAll(".grade-checkbox").forEach(cb => {
        if (cb.value.toLowerCase().includes(gradeParam.toLowerCase())) {
          cb.checked = true;
        }
      });
      renderProducts();
    }, 50);
  }

  if (subParam) {
    if (subParam.toLowerCase() === 'gan') {
      if (searchInput) searchInput.value = 'GaN';
    } else if (subParam.toLowerCase() === 'cable') {
      if (searchInput) searchInput.value = 'Cable';
    } else if (subParam.toLowerCase() === 'earbuds') {
      if (searchInput) searchInput.value = 'Earbuds';
    } else if (subParam.toLowerCase() === 'bluetooth') {
      if (searchInput) searchInput.value = 'Bluetooth';
    } else if (subParam.toLowerCase() === 'magsafe') {
      if (searchInput) searchInput.value = 'MagSafe';
    }
  }

  if (brandParam) {
    setTimeout(() => {
      document.querySelectorAll(".brand-checkbox").forEach(cb => {
        if (cb.value.toLowerCase() === brandParam.toLowerCase()) {
          cb.checked = true;
        }
      });
      renderProducts();
    }, 50);
  }

  if (tierParam) {
    setTimeout(() => {
      document.querySelectorAll(".tier-checkbox").forEach(cb => {
        if (cb.value.toLowerCase().includes(tierParam.toLowerCase())) {
          cb.checked = true;
        }
      });
      renderProducts();
    }, 50);
  }

  if (wattageParam) {
    setTimeout(() => {
      document.querySelectorAll(".wattage-checkbox").forEach(cb => {
        if (cb.value.toLowerCase() === wattageParam.toLowerCase()) {
          cb.checked = true;
        }
      });
      renderProducts();
    }, 50);
  }

  const connectorParam = urlParams.get('connector');
  if (connectorParam) {
    setTimeout(() => {
      document.querySelectorAll(".connector-checkbox").forEach(cb => {
        if (cb.value.toLowerCase().includes(connectorParam.toLowerCase())) {
          cb.checked = true;
        }
      });
      renderProducts();
    }, 50);
  }

  if (searchParam && searchInput) {
    searchInput.value = searchParam;
  }

  // ==========================================
  // RENDER & FILTER ENGINE
  // ==========================================
  function createProductCardHtml(p) {
    const isOutOfStock = (p.stock !== undefined && p.stock !== null && parseInt(p.stock) <= 0) || p.status === 'out_of_stock' || (typeof p.status === 'string' && p.status.toLowerCase().includes('out'));
    const wishlist = (typeof StorageDB !== 'undefined' && StorageDB.getWishlist) ? StorageDB.getWishlist() : [];
    const brandMeta = (typeof getBrandMeta === "function") ? getBrandMeta(p.brand) : ((typeof BRAND_META !== "undefined" && BRAND_META[p.brand]) ? BRAND_META[p.brand] : { icon: "fas fa-tag", color: "#38bdf8", bg: "rgba(56,189,248,0.15)" });
    const isWishlisted = wishlist.includes(p.id);
    
    const discountPercent = (p.oldPrice && parseFloat(p.oldPrice) > parseFloat(p.price)) 
      ? Math.round(((parseFloat(p.oldPrice) - parseFloat(p.price)) / parseFloat(p.oldPrice)) * 100) 
      : 0;

    const isOffer = p.is_offer == 1 || p.is_offer === true || p.is_offer === '1' || discountPercent > 0 || (p.badge && (p.badge.includes('OFFER') || p.badge.includes('SPECIAL') || p.badge.includes('🔥')));

    // Dynamic Quality Grade Badges (Top Highlight)
    let qualityBadgeHtml = "";
    if (isOffer) {
      qualityBadgeHtml = `<span style="background:linear-gradient(135deg, #ef4444, #dc2626); color:#ffffff; font-size:0.68rem; font-weight:900; padding:0.26rem 0.6rem; border-radius:5px; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 2px 8px rgba(220,38,38,0.5); display:inline-flex; align-items:center; gap:0.35rem;"><i class="fas fa-fire" style="color:#fef08a;"></i> SPECIAL OFFER ${discountPercent > 0 ? `(-${discountPercent}%)` : ''}</span>`;
    } else if (p.qualityGrade === "Original") {
      qualityBadgeHtml = `<span style="background:linear-gradient(135deg, #0284c7, #2563eb); color:#ffffff; font-size:0.68rem; font-weight:800; padding:0.25rem 0.55rem; border-radius:4px; text-transform:uppercase; box-shadow:0 2px 6px rgba(2,132,199,0.4); display:inline-flex; align-items:center; gap:0.3rem;"><i class="fas fa-crown"></i> 100% Original</span>`;
    } else if (p.qualityGrade === "High Grade") {
      qualityBadgeHtml = `<span style="background:linear-gradient(135deg, #7c3aed, #4f46e5); color:#ffffff; font-size:0.68rem; font-weight:800; padding:0.25rem 0.55rem; border-radius:4px; text-transform:uppercase; box-shadow:0 2px 6px rgba(124,58,237,0.4); display:inline-flex; align-items:center; gap:0.3rem;"><i class="fas fa-star"></i> High Grade</span>`;
    } else if (p.qualityGrade === "Budget") {
      qualityBadgeHtml = `<span style="background:linear-gradient(135deg, #059669, #10b981); color:#ffffff; font-size:0.68rem; font-weight:800; padding:0.25rem 0.55rem; border-radius:4px; text-transform:uppercase; box-shadow:0 2px 6px rgba(5,150,105,0.4); display:inline-flex; align-items:center; gap:0.3rem;"><i class="fas fa-tag"></i> Budget / Low-Cost</span>`;
    }

    const cardBg = isOffer ? 'linear-gradient(180deg, rgba(244,63,94,0.06) 0%, var(--bg-secondary) 100%)' : 'var(--bg-secondary)';
    const cardBorder = isOutOfStock ? 'rgba(239,68,68,0.45)' : (isOffer ? 'rgba(244,63,94,0.55)' : 'var(--border-color)');
    const cardShadow = isOffer ? 'box-shadow: 0 4px 20px rgba(244,63,94,0.14);' : '';

    return `
      <div class="product-card" data-id="${p.id}" style="background:${cardBg}; border:1.5px solid ${cardBorder}; border-radius:var(--radius-lg); padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between; position:relative; transition:all 0.3s ease; ${cardShadow} ${isOutOfStock ? 'opacity:0.88;' : ''}">
        
        <!-- Badges & Wishlist Overlay (Prominent Quality Badge On Top) -->
        <div style="position:absolute; top:12px; left:12px; z-index:3; display:flex; gap:0.35rem; flex-wrap:wrap; max-width:75%;">
          ${isOutOfStock ? `<span style="background:linear-gradient(135deg,#dc2626,#991b1b); color:#ffffff; font-size:0.68rem; font-weight:900; padding:0.28rem 0.6rem; border-radius:5px; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 2px 8px rgba(220,38,38,0.5); display:inline-flex; align-items:center; gap:0.3rem;"><i class="fas fa-ban"></i> Out of Stock</span>` : qualityBadgeHtml}
          ${!isOutOfStock && !isOffer && discountPercent > 0 ? `<span style="background:var(--accent-rose); color:#ffffff; font-size:0.68rem; font-weight:800; padding:0.2rem 0.45rem; border-radius:4px;">-${discountPercent}%</span>` : ""}
        </div>

        <button onclick="window.handleWishlistToggle('${p.id}')" title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}" style="position:absolute; top:12px; right:12px; z-index:3; width:32px; height:32px; border-radius:50%; background:rgba(0,0,0,0.5); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:center; color:${isWishlisted ? '#f43f5e' : 'var(--text-muted)'}; font-size:0.9rem; cursor:pointer; transition:all 0.2s ease;">
          <i class="${isWishlisted ? 'fas fa-heart' : 'far fa-heart'}"></i>
        </button>
        
        <!-- Thumbnail Image (dimmed if out of stock) -->
        <a href="product-detail.html?id=${p.id}" class="card-thumb" style="display:block; text-align:center; margin-bottom:0.75rem; cursor:pointer; text-decoration:none; height:160px; background:transparent; padding:0.5rem 0; position:relative;">
          <img src="${p.image}" alt="${p.name}" loading="lazy" style="max-width:100%; height:150px; object-fit:contain; transition:transform 0.3s ease; ${isOutOfStock ? 'filter:grayscale(65%) brightness(0.65);' : ''}" onerror="this.src='images/cat-chargers.svg'">
          ${isOutOfStock ? `
          <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none;">
            <div style="background:rgba(15,23,42,0.85); border:1.5px solid rgba(239,68,68,0.7); border-radius:8px; padding:0.4rem 0.9rem; font-size:0.78rem; font-weight:900; color:#fca5a5; letter-spacing:1px; text-transform:uppercase; backdrop-filter:blur(3px); box-shadow:0 4px 12px rgba(0,0,0,0.5);">
              <i class="fas fa-times-circle" style="color:#ef4444; margin-right:5px;"></i>SOLD OUT
            </div>
          </div>` : ''}
        </a>

        <!-- Card Body -->
        <div class="card-body" style="display:flex; flex-direction:column; gap:0.45rem;">
          
          <!-- Brand & Category Row -->
          <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.75rem;">
            <div style="display:flex; align-items:center; gap:0.35rem; font-weight:700; color:var(--accent-cyan);">
              <span class="brand-logo-badge" style="width:18px; height:18px; font-size:0.65rem; background:${brandMeta.bg}; color:${brandMeta.color}; border-radius:4px;">
                <i class="${brandMeta.icon}"></i>
              </span>
              <span>${p.brand}</span>
            </div>
            <span style="color:var(--text-dim); background:rgba(255,255,255,0.04); padding:0.1rem 0.45rem; border-radius:4px; font-size:0.72rem;">${p.category}</span>
          </div>
          
          <!-- Title -->
          <h3 style="font-size:0.95rem; font-weight:700; color:${isOutOfStock ? '#94a3b8' : '#ffffff'}; height:42px; overflow:hidden; line-height:1.35; margin:0.15rem 0;">
            <a href="product-detail.html?id=${p.id}" style="color:${isOutOfStock ? '#94a3b8' : '#ffffff'}; text-decoration:none; transition:color 0.2s ease;">${p.name}</a>
          </h3>

          <!-- Specs Snippet Chip -->
          <div style="font-size:0.73rem; color:var(--text-muted); background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.05); padding:0.3rem 0.5rem; border-radius:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${p.specs || ''}">
            <i class="fas fa-microchip" style="color:var(--accent-cyan); font-size:0.7rem; margin-right:3px;"></i>
            ${p.specs || (p.qualityGrade === 'Budget' ? 'Budget Friendly Replacement' : 'Genuine Original Warranty')}
          </div>
          
          <!-- Rating -->
          <div style="display:flex; justify-content:flex-start; align-items:center; margin-top:0.15rem;">
            <span style="color:var(--accent-amber); font-size:0.82rem; font-weight:700;">
              <i class="fas fa-star"></i> ${p.rating || 4.8} <span style="font-size:0.72rem; color:var(--text-dim); font-weight:400;">(${p.reviewsCount || 10})</span>
            </span>
          </div>

          <!-- Price Row with Highly Visible Red Strikethrough & Savings Chip -->
          <div style="display:flex; flex-direction:column; gap:0.25rem; margin:0.35rem 0 0.55rem;">
            <div style="display:flex; align-items:baseline; gap:0.6rem; flex-wrap:wrap;">
              <span style="font-size:1.22rem; font-weight:900; color:${isOutOfStock ? '#94a3b8' : (isOffer ? '#f43f5e' : 'var(--accent-cyan)')};">
                Rs. ${(p.price || 0).toLocaleString()}
              </span>
              ${p.oldPrice ? `
                <span style="font-size:0.85rem; color:#94a3b8; text-decoration:line-through; text-decoration-color:#ef4444; text-decoration-thickness:2.5px; font-weight:700;">
                  Rs. ${(p.oldPrice).toLocaleString()}
                </span>
              ` : ""}
            </div>
            ${(isOffer && p.oldPrice && parseFloat(p.oldPrice) > parseFloat(p.price)) ? `
              <div style="display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap;">
                <span style="background:rgba(239,68,68,0.15); color:#fca5a5; border:1px solid rgba(239,68,68,0.35); font-size:0.7rem; font-weight:800; padding:0.16rem 0.45rem; border-radius:4px; display:inline-flex; align-items:center; gap:0.25rem;">
                  <i class="fas fa-arrow-down" style="color:#ef4444;"></i> SAVE Rs. ${(parseFloat(p.oldPrice) - parseFloat(p.price)).toLocaleString()}
                </span>
                ${discountPercent > 0 ? `
                  <span style="background:linear-gradient(135deg, #ef4444, #dc2626); color:#fff; font-size:0.68rem; font-weight:900; padding:0.14rem 0.45rem; border-radius:4px;">
                    -${discountPercent}%
                  </span>
                ` : ''}
              </div>
            ` : ""}
          </div>

          <!-- Action Buttons -->
          <div style="display:grid; grid-template-columns:1fr auto; gap:0.4rem;">
            ${isOutOfStock 
              ? `<button disabled style="padding:0.6rem 0.8rem; font-size:0.82rem; background:rgba(107,114,128,0.25); border:1.5px solid rgba(239,68,68,0.4); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; gap:0.35rem; font-weight:800; cursor:not-allowed; color:#f87171;">
                  <i class="fas fa-ban"></i> OUT OF STOCK
                </button>`
              : (isOffer 
                  ? `<button class="btn-primary" onclick="window.handleAddToCart('${p.id}')" style="padding:0.6rem 0.8rem; font-size:0.82rem; background:linear-gradient(135deg, #f43f5e, #dc2626); border:none; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; gap:0.35rem; font-weight:800; cursor:pointer; box-shadow:0 2px 10px rgba(244,63,94,0.35); color:#ffffff;">
                      <i class="fas fa-cart-plus"></i> ADD TO CART
                    </button>`
                  : `<button class="btn-primary" onclick="window.handleAddToCart('${p.id}')" style="padding:0.6rem 0.8rem; font-size:0.82rem; background:linear-gradient(135deg, var(--accent-cyan), var(--accent-blue)); border:none; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; gap:0.35rem; font-weight:700; cursor:pointer; color:#090d16;">
                      <i class="fas fa-cart-plus"></i> ADD TO CART
                    </button>`
                )}
            <a href="product-detail.html?id=${p.id}" class="icon-btn" title="View Specifications" style="width:38px; height:38px; border-radius:var(--radius-md); background:rgba(255,255,255,0.06); border:1px solid var(--border-color); display:inline-flex; align-items:center; justify-content:center; color:#ffffff;">
              <i class="fas fa-arrow-right" style="font-size:0.85rem;"></i>
            </a>
          </div>

        </div>
      </div>
    `;
  }
  window.createProductCardHtml = createProductCardHtml;

  function renderProducts() {
    const displayContainer = document.getElementById("catalogProductsGrid") || productsGrid;
    const newArrivalsGrid = document.getElementById("newArrivalsGrid");
    const specialOffersGrid = document.getElementById("specialOffersGrid");

    const allProducts = StorageDB.getProducts();

    if (displayContainer) {
      let filtered = [...allProducts];

      // 0. Special Offer / Sale Filter (e.g. ?sale=true or SALE % pill)
      if (window._activeSaleFilter) {
        filtered = filtered.filter(p => (
          p.is_offer == 1 || p.is_offer === true || p.is_offer === '1' ||
          (p.oldPrice && parseFloat(p.oldPrice) > parseFloat(p.price)) ||
          (p.original_price && parseFloat(p.original_price) > parseFloat(p.price)) ||
          (p.badge && (p.badge.includes('OFFER') || p.badge.includes('SPECIAL') || p.badge.includes('🔥')))
        ));
      }

      // 1. Search Query
      const query = searchInput ? (searchInput.value || "").toLowerCase().trim() : "";
      if (query) {
        filtered = filtered.filter(p =>
          (p.name || "").toLowerCase().includes(query) ||
          (p.brand || "").toLowerCase().includes(query) ||
          (p.category || "").toLowerCase().includes(query) ||
          (p.specs && (p.specs || "").toLowerCase().includes(query)) ||
          (p.description && (p.description || "").toLowerCase().includes(query))
        );
      }

      // 2. Category Filter
      const activeCategory = window._activeCategory || (categoryFilter ? categoryFilter.value : "All");
      if (activeCategory && activeCategory !== "All") {
        filtered = filtered.filter(p => {
          const cat = (p.category || p.category_name || "").toLowerCase();
          return cat === activeCategory.toLowerCase();
        });
      }

      // 3. Brand Filter
      const checkedBrandBoxes = document.querySelectorAll(".brand-checkbox:checked");
      const selectedBrands = Array.from(checkedBrandBoxes).map(cb => cb.value.toLowerCase().trim());
      if (selectedBrands.length > 0) {
        filtered = filtered.filter(p => {
          const pb = (typeof normalizeBrand === 'function' ? normalizeBrand(p.brand) : (p.brand || '')).toLowerCase().trim();
          return selectedBrands.some(b => pb === b || pb.includes(b) || b.includes(pb));
        });
      }

      // 3.5 Quality Tier / Grade Filter (Original, High Grade, Budget)
      const checkedGradeBoxes = document.querySelectorAll(".grade-checkbox:checked");
      const selectedGrades = Array.from(checkedGradeBoxes).map(cb => cb.value.toLowerCase().trim());
      if (selectedGrades.length > 0) {
        filtered = filtered.filter(p => {
          const qg = String(p.qualityGrade || p.quality_grade || (p.badge && p.badge.includes('Original') ? 'Original' : (p.badge && p.badge.includes('Budget') ? 'Budget' : 'High Grade'))).toLowerCase();
          return selectedGrades.some(g => qg.includes(g) || g.includes(qg));
        });
      }

      // 4. Charger Wattage Filter (20W, 25W, 30W, 45W, 65W)
      const checkedWattageBoxes = document.querySelectorAll(".wattage-checkbox:checked");
      const selectedWattages = Array.from(checkedWattageBoxes).map(cb => cb.value.toLowerCase().trim());
      if (selectedWattages.length > 0) {
        filtered = filtered.filter(p => {
          let w = String(p.wattage || "").toLowerCase().trim();
          if (!w) {
            const match = (p.name + " " + (p.specs || "")).match(/(20W|25W|30W|45W|65W|100W)/i);
            if (match) w = match[1].toLowerCase();
          }
          return selectedWattages.includes(w);
        });
      }

      // 5. Cable & Connector Filter (USB-C, Lightning, Micro USB)
      const checkedConnectorBoxes = document.querySelectorAll(".connector-checkbox:checked");
      const selectedConnectors = Array.from(checkedConnectorBoxes).map(cb => cb.value.toLowerCase().trim());
      if (selectedConnectors.length > 0) {
        filtered = filtered.filter(p => {
          let conn = String(p.connector || "").toLowerCase().trim();
          if (!conn) {
            const str = (p.name + " " + (p.specs || "")).toLowerCase();
            if (str.includes("lightning")) conn = "lightning";
            else if (str.includes("micro")) conn = "micro usb";
            else conn = "usb-c";
          }
          return selectedConnectors.some(c => conn.includes(c));
        });
      }

      // 6. Glass Quality Tier Filter (Super D, HD+, MTB - ONLY for Screen Protectors)
      const checkedTierBoxes = document.querySelectorAll(".tier-checkbox:checked");
      const selectedTiers = Array.from(checkedTierBoxes).map(cb => cb.value.toLowerCase().trim());
      if (selectedTiers.length > 0) {
        filtered = filtered.filter(p => {
          let tier = String(p.qualityTier || p.quality_tier || "").toLowerCase().trim();
          if (!tier) {
            const name = String(p.name || "").toLowerCase();
            if (name.includes("super d")) tier = "super d";
            else if (name.includes("hd+")) tier = "hd+";
            else if (name.includes("mtb")) tier = "mtb";
          }
          return selectedTiers.includes(tier);
        });
      }

      // 7. Price Range
      if (priceRange) {
        const maxPrice = parseFloat(priceRange.value) || 500000;
        filtered = filtered.filter(p => (parseFloat(p.price) || 0) <= maxPrice);
      }

      // 8. Availability Stock Filter
      const stockInOnlyRadio = document.getElementById("stockInOnly");
      const stockOutOnlyRadio = document.getElementById("stockOutOnly");
      if (stockInOnlyRadio && stockInOnlyRadio.checked) {
        filtered = filtered.filter(p => (parseInt(p.stock) > 0 && p.status !== 'out_of_stock'));
      } else if (stockOutOnlyRadio && stockOutOnlyRadio.checked) {
        filtered = filtered.filter(p => (parseInt(p.stock) <= 0 || p.status === 'out_of_stock'));
      }

      // 9. Rating Filter
      const rating4PlusCb = document.getElementById("rating4Plus");
      if (rating4PlusCb && rating4PlusCb.checked) {
        filtered = filtered.filter(p => (parseFloat(p.rating) || 4.8) >= 4.0);
      }

      // 10. Sorting (including Tier Rank: Best to Standard)
      if (sortSelect) {
        const sortVal = sortSelect.value;
        if (sortVal === "tier-best") {
          filtered.sort((a, b) => {
            const getRank = (p) => {
              if (p.tierRank) return parseInt(p.tierRank);
              if (p.tier_rank) return parseInt(p.tier_rank);
              const t = String(p.qualityTier || p.quality_tier || p.name || "").toLowerCase();
              if (t.includes("super d")) return 1;
              if (t.includes("hd+")) return 2;
              if (t.includes("mtb")) return 3;
              return 99;
            };
            return getRank(a) - getRank(b);
          });
        } else if (sortVal === "price-low") {
          filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        } else if (sortVal === "price-high") {
          filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        } else if (sortVal === "rating") {
          filtered.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
        }
      }

      // Update Counter
      const showingCountNum = document.getElementById("showingCountNum");
      if (showingCountNum) {
        showingCountNum.textContent = filtered.length;
      }
      if (productCountEl) {
        productCountEl.textContent = `Showing ${filtered.length} Products`;
      }

      // Render Grid HTML
      if (filtered.length === 0) {
        displayContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted); background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--radius-lg);">
            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: var(--border-glow);"></i>
            <h3 style="font-size:1.3rem; color:#ffffff; margin-bottom:0.5rem;">No Matching Mobile Products Found</h3>
            <p style="margin-bottom:1.5rem;">Try adjusting your brand, wattage, or price criteria or resetting filters.</p>
            <button onclick="window.resetFilters()" class="btn-primary" style="padding:0.6rem 1.5rem;"><i class="fas fa-undo-alt"></i> Reset All Filters</button>
          </div>
        `;
      } else {
        displayContainer.innerHTML = filtered.map(p => createProductCardHtml(p)).join("");
      }
    }

    // Always populate homepage grids if present
    if (newArrivalsGrid) {
      const smartphones = allProducts.filter(p => (p.category || p.category_name || "").toLowerCase() === "smartphones");
      const others = allProducts.filter(p => (p.category || p.category_name || "").toLowerCase() !== "smartphones");
      const arrivalsList = [...smartphones, ...others].slice(0, 8);
      newArrivalsGrid.innerHTML = arrivalsList.map(p => createProductCardHtml(p)).join("");
    }

    if (specialOffersGrid) {
      const offers = allProducts.filter(p => (
        p.is_offer == 1 || p.is_offer === true || p.is_offer === '1' ||
        (p.oldPrice && parseFloat(p.oldPrice) > parseFloat(p.price)) ||
        (p.original_price && parseFloat(p.original_price) > parseFloat(p.price)) ||
        (p.badge && (p.badge.includes('OFFER') || p.badge.includes('SPECIAL') || p.badge.includes('🔥')))
      ));
      const displayOffers = offers.length > 0 ? offers.slice(0, 4) : allProducts.slice(0, 4);
      specialOffersGrid.innerHTML = displayOffers.map(p => createProductCardHtml(p)).join("");
    }
  }
  window.renderProducts = renderProducts;

  // Initial immediate synchronous render
  renderProducts();

  // Event Listeners for Filters
  if (searchInput) searchInput.addEventListener("input", renderProducts);
  if (categoryFilter) {
    categoryFilter.addEventListener("change", (e) => {
      const selected = e.target.value;
      window._activeCategory = selected;
      populateBrandFilters(selected);
      document.querySelectorAll(".category-pill-btn").forEach(btn => {
        btn.classList.toggle("active", btn.textContent.includes(selected) || (selected === "All" && btn.textContent.includes("All Products")));
      });
      renderProducts();
    });
  }
  if (sortSelect) sortSelect.addEventListener("change", renderProducts);
  if (priceRange) {
    priceRange.addEventListener("input", (e) => {
      if (priceRangeValue) priceRangeValue.textContent = `Rs. ${parseInt(e.target.value).toLocaleString()}`;
      renderProducts();
    });
    priceRange.addEventListener("change", renderProducts);
  }
  document.querySelectorAll(".grade-checkbox").forEach(cb => {
    cb.addEventListener("change", renderProducts);
  });
  document.querySelectorAll(".tier-checkbox").forEach(cb => {
    cb.addEventListener("change", renderProducts);
  });
  document.querySelectorAll(".wattage-checkbox").forEach(cb => {
    cb.addEventListener("change", renderProducts);
  });
  document.querySelectorAll(".connector-checkbox").forEach(cb => {
    cb.addEventListener("change", renderProducts);
  });
  document.querySelectorAll('input[name="availabilityFilter"]').forEach(radio => {
    radio.addEventListener("change", renderProducts);
  });
  const rating4PlusCb = document.getElementById("rating4Plus");
  if (rating4PlusCb) {
    rating4PlusCb.addEventListener("change", renderProducts);
  }

  // Global Filter Reset
  window.resetFilters = function() {
    if (searchInput) searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "All";
    window._activeCategory = "All";
    window._activeSaleFilter = false;
    const salePill = document.getElementById("saleFilterPill");
    if (salePill) salePill.classList.remove("active");

    if (sortSelect) sortSelect.value = "featured";
    if (priceRange) {
      priceRange.value = 500000;
      if (priceRangeValue) priceRangeValue.textContent = "Rs. 500,000";
    }
    document.querySelectorAll(".grade-checkbox").forEach(cb => cb.checked = false);
    document.querySelectorAll(".tier-checkbox").forEach(cb => cb.checked = false);
    document.querySelectorAll(".wattage-checkbox").forEach(cb => cb.checked = false);
    document.querySelectorAll(".connector-checkbox").forEach(cb => cb.checked = false);
    document.querySelectorAll(".brand-checkbox").forEach(cb => cb.checked = false);
    if (rating4PlusCb) rating4PlusCb.checked = false;

    const stockAllRadio = document.getElementById("stockAllRadio");
    if (stockAllRadio) stockAllRadio.checked = true;

    document.querySelectorAll(".category-pill-btn").forEach(btn => {
      btn.classList.toggle("active", btn.textContent.includes("All Products"));
    });
    populateBrandFilters("All");
    renderProducts();
  };

  // ─── Live Product Sync: fetch fresh items directly from MySQL API ─────
  async function syncStockFromDB() {
    try {
      if (typeof ApiClient === 'undefined' || !ApiClient.getProducts) {
        renderProducts();
        return;
      }

      const liveProducts = await ApiClient.getProducts();
      if (!liveProducts || liveProducts.length === 0) {
        renderProducts();
        return;
      }

      const CATEGORY_NAMES = {
        1: "Smartphones",
        2: "Chargers",
        3: "Covers",
        4: "Audio",
        5: "Power",
        6: "Accessories"
      };

      const formatted = liveProducts.map(dbp => {
        const catName = dbp.category_name || CATEGORY_NAMES[dbp.category_id] || "Smartphones";
        const origPrice = (dbp.original_price && parseFloat(dbp.original_price) > 0) ? parseFloat(dbp.original_price) : (dbp.old_price ? parseFloat(dbp.old_price) : (dbp.oldPrice ? parseFloat(dbp.oldPrice) : null));
        const curPrice = parseFloat(dbp.price) || 0;
        const offerPrice = (dbp.offer_price && parseFloat(dbp.offer_price) > 0) ? parseFloat(dbp.offer_price) : null;
        const isOffer = (dbp.is_offer == 1 || dbp.is_offer === true || dbp.is_offer === '1' || (origPrice && origPrice > curPrice)) ? 1 : 0;
        const stockVal = parseInt(dbp.stock ?? 0);
        const qg = dbp.quality_grade || dbp.qualityGrade || (parseInt(dbp.category_id) === 1 ? "Original" : (catName === 'Covers' ? "High Grade" : "Original"));
        const qt = dbp.quality_tier || dbp.qualityTier || null;
        const tr = parseInt(dbp.tier_rank || dbp.tierRank || 99);
        const wt = dbp.wattage || null;
        const cn = dbp.connector || "USB-C";
        const pid = dbp.product_id || (dbp.id ? parseInt(String(dbp.id).replace(/[^0-9]/g, '')) : Date.now());
        const pName = dbp.product_name || dbp.name || "Mobile Product";

        return {
          id: `prod_${pid}`,
          numericId: pid,
          product_id: pid,
          category_id: parseInt(dbp.category_id) || 1,
          name: pName,
          product_name: pName,
          category: catName,
          category_name: catName,
          brand: (typeof normalizeBrand === 'function') ? normalizeBrand(dbp.brand) : (dbp.brand || "Generic"),
          model: dbp.model || "",
          price: curPrice,
          oldPrice: origPrice,
          original_price: origPrice,
          offer_price: offerPrice,
          is_offer: isOffer,
          stock: stockVal,
          status: (stockVal <= 0 || dbp.status === 'out_of_stock') ? 'out_of_stock' : 'active',
          description: dbp.description || "",
          specs: dbp.specs || "",
          image: dbp.image || "images/cat-chargers.svg",
          image_2: dbp.image_2 || null,
          image_3: dbp.image_3 || null,
          image2: dbp.image_2 || null,
          image3: dbp.image_3 || null,
          connector: cn,
          rating: parseFloat(dbp.rating) || 4.8,
          reviewsCount: parseInt(dbp.reviews_count || dbp.reviewsCount) || 25,
          qualityGrade: qg,
          quality_grade: qg,
          qualityTier: qt,
          quality_tier: qt,
          tierRank: tr,
          tier_rank: tr,
          wattage: wt,
          badge: isOffer ? '🔥 SPECIAL OFFER' : (qt ? `👑 ${qt}` : (qg ? `👑 ${qg}` : 'Featured'))
        };
      });

      StorageDB.saveProducts(formatted);
      console.log(`[D-TEL] ✅ Live stock synced: ${formatted.length} products from DB`);
      populateBrandFilters(window._activeCategory);
      renderProducts();
      window.dispatchEvent(new CustomEvent("productsUpdated", { detail: formatted }));

    } catch (err) {
      console.warn('[D-TEL] ⚠️ Live stock sync failed, using cached data:', err.message);
      renderProducts();
    }
  }

  syncStockFromDB();

  // ==========================================
  // CART SYSTEM & DRAWER MANAGEMENT
  // ==========================================
  function updateCartUI() {
    const cart = StorageDB.getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

    cartBadgeCounters.forEach(el => {
      el.textContent = totalCount;
      el.style.display = totalCount > 0 ? "flex" : "none";
    });

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color: var(--text-muted);">
          <i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 1rem; color: var(--border-glow);"></i>
          <p>Your shopping cart is empty.</p>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = "LKR 0";
      if (cartDeliveryEl) cartDeliveryEl.textContent = "LKR 0";
      if (cartTotalEl) cartTotalEl.textContent = "LKR 0";
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = subtotal > 20000 ? 0 : 450;
    const grandTotal = subtotal + delivery;

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">LKR ${item.price.toLocaleString()}</div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="window.updateCartQty('${item.productId}', ${item.qty - 1})">-</button>
            <span style="font-weight:700; font-size:0.9rem;">${item.qty}</span>
            <button class="qty-btn" onclick="window.updateCartQty('${item.productId}', ${item.qty + 1})">+</button>
          </div>
        </div>
        <button onclick="window.removeFromCart('${item.productId}')" style="background:none; border:none; color:var(--accent-rose); font-size:1.1rem; padding:0.5rem;">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join("");

    if (cartSubtotalEl) cartSubtotalEl.textContent = `LKR ${subtotal.toLocaleString()}`;
    if (cartDeliveryEl) cartDeliveryEl.textContent = delivery === 0 ? "FREE" : `LKR ${delivery.toLocaleString()}`;
    if (cartTotalEl) cartTotalEl.textContent = `LKR ${grandTotal.toLocaleString()}`;
  }

  window.handleAddToCart = function(productId) {
    const product = (typeof StorageDB !== 'undefined' && StorageDB.getProductById) ? StorageDB.getProductById(productId) : null;
    if (product && ((product.stock !== undefined && parseInt(product.stock) <= 0) || product.status === 'out_of_stock' || (typeof product.status === 'string' && product.status.toLowerCase().includes('out')))) {
      alert(`⚠️ Sorry, "${product.name || 'This product'}" is currently OUT OF STOCK and cannot be added to cart.`);
      return;
    }

    if (typeof Auth !== 'undefined') {
      const user = Auth.getUser();
      if (!user) {
        Auth.openModal('customer', () => {
          StorageDB.addToCart(productId, 1);
          updateCartUI();
          if (typeof window.updateHeaderCounters === 'function') window.updateHeaderCounters();
          openCartDrawer();
        }, '⚠️ Please Sign In or Register to add products to your cart and proceed with shopping.');
        return;
      }
    }
    StorageDB.addToCart(productId, 1);
    updateCartUI();
    if (typeof window.updateHeaderCounters === 'function') window.updateHeaderCounters();
    openCartDrawer();
  };

  window.updateCartQty = function(productId, newQty) {
    StorageDB.updateCartQty(productId, newQty);
    updateCartUI();
    if (typeof window.updateHeaderCounters === 'function') window.updateHeaderCounters();
  };

  window.removeFromCart = function(productId) {
    StorageDB.removeFromCart(productId);
    updateCartUI();
    if (typeof window.updateHeaderCounters === 'function') window.updateHeaderCounters();
  };

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        StorageDB.clearCart();
        updateCartUI();
      }
    });
  }

  function openCartDrawer() {
    updateCartUI();
    if (cartDrawerOverlay) cartDrawerOverlay.classList.add("open");
  }

  function closeCartDrawer() {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.remove("open");
  }

  cartTriggerBtns.forEach(btn => btn.addEventListener("click", openCartDrawer));
  if (cartDrawerClose) cartDrawerClose.addEventListener("click", closeCartDrawer);
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener("click", (e) => {
      if (e.target === cartDrawerOverlay) closeCartDrawer();
    });
  }

  // ==========================================
  // WISHLIST CONTROLLER
  // ==========================================
  function updateWishlistUI() {
    const wishlist = StorageDB.getWishlist();
    wishlistBadgeCounters.forEach(el => {
      el.textContent = wishlist.length;
      el.style.display = wishlist.length > 0 ? "flex" : "none";
    });
  }

  window.handleWishlistToggle = function(productId) {
    StorageDB.toggleWishlist(productId);
    updateWishlistUI();
    renderProducts();
  };

  // Sync Cart & Wishlist when storage or user session changes
  window.addEventListener("cartUpdated", updateCartUI);
  window.addEventListener("wishlistUpdated", updateWishlistUI);
  window.addEventListener("userUpdated", () => {
    updateCartUI();
    updateWishlistUI();
    if (typeof window.updateHeaderCounters === 'function') window.updateHeaderCounters();
  });

  wishlistTriggerBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const wishlist = StorageDB.getWishlist();
      if (wishlist.length === 0) {
        alert("Your wishlist is currently empty! Click the heart icon on any product to save it.");
        return;
      }
      // Set search filter to show wishlisted items
      alert(`Showing ${wishlist.length} item(s) from your wishlist!`);
    });
  });

  // ==========================================
  // DETAIL MODAL ENGINE
  // ==========================================
  window.openDetailModal = function(productId) {
    const product = StorageDB.getProductById(productId);
    if (!product || !detailModalOverlay) return;

    const isOutOfStock = product.stock <= 0;

    detailModalOverlay.querySelector(".modal-card").innerHTML = `
      <button class="modal-close-btn" onclick="window.closeDetailModal()">&times;</button>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem; align-items:center;">
        <div style="background:#000; border-radius:var(--radius-md); overflow:hidden; height:280px; display:flex; align-items:center; justify-content:center;">
          <img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div>
          <div style="color:var(--accent-cyan); font-weight:700; text-transform:uppercase; font-size:0.8rem; margin-bottom:0.25rem;">
            ${product.category} • ${product.brand}
          </div>
          <h2 style="font-size:1.5rem; margin-bottom:0.5rem;">${product.name}</h2>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">${product.description}</p>
          
          <div style="background:var(--bg-primary); padding:0.75rem; border-radius:var(--radius-md); font-size:0.85rem; margin-bottom:1rem; border:1px solid var(--border-color);">
            <div><strong>Compatible Model:</strong> ${product.model}</div>
            <div><strong>Connector Type:</strong> ${product.connector}</div>
            <div><strong>Screen / Fit:</strong> ${product.screenSize}</div>
            <div><strong>Key Features:</strong> ${product.specs}</div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem;">
            <div>
              <div style="font-size:1.5rem; font-weight:800; color:#fff;">LKR ${product.price.toLocaleString()}</div>
              ${product.oldPrice ? `<div style="font-size:0.85rem; color:var(--text-dim); text-decoration:line-through;">LKR ${product.oldPrice.toLocaleString()}</div>` : ''}
            </div>
            <!-- Stock quantity/status is intentionally hidden from customers. -->
          </div>

          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button class="btn-primary" ${isOutOfStock ? 'disabled style="opacity:0.5;"' : ''} onclick="window.handleAddToCart('${product.id}'); window.closeDetailModal();" style="flex:1;">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
            <button class="btn-whatsapp" ${isOutOfStock ? 'disabled style="opacity:0.5;"' : ''} onclick="window.openQuickWhatsAppModal('${product.id}')" style="flex:1;">
              <i class="fab fa-whatsapp"></i> Quick Order
            </button>
          </div>
        </div>
      </div>
    `;

    detailModalOverlay.classList.add("active");
  };

  window.closeDetailModal = function() {
    if (detailModalOverlay) detailModalOverlay.classList.remove("active");
  };

  // ==========================================
  // DUAL CHECKOUT: WHATSAPP QUICK ORDER MODAL
  // ==========================================
  window.openQuickWhatsAppModal = function(productId = null) {
    if (!whatsappModalOverlay) return;

    let items = [];
    if (productId) {
      const prod = StorageDB.getProductById(productId);
      if (prod) items = [{ id: prod.id, name: prod.name, price: prod.price, qty: 1 }];
    } else {
      const cart = StorageDB.getCart();
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      items = cart.map(c => ({ id: c.productId, name: c.name, price: c.price, qty: c.qty }));
    }

    const subtotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const grandTotal = subtotal > 20000 ? subtotal : subtotal + 450;

    whatsappModalOverlay.querySelector(".modal-card").innerHTML = `
      <button class="modal-close-btn" onclick="window.closeWhatsAppModal()">&times;</button>
      <div style="text-align:center; margin-bottom:1.5rem;">
        <i class="fab fa-whatsapp" style="font-size:3rem; color:#25D366; margin-bottom:0.5rem;"></i>
        <h2>Direct WhatsApp Quick-Order</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Submit your contact details to generate instant pre-formatted WhatsApp order message to D-TEL support.</p>
      </div>

      <div style="background:var(--bg-primary); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:1.25rem;">
        <h4 style="margin-bottom:0.5rem; font-size:0.9rem; text-transform:uppercase; color:var(--accent-cyan);">Order Items Summary</h4>
        ${items.map(item => `
          <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:0.25rem;">
            <span>${item.name} (x${item.qty})</span>
            <span style="font-weight:700;">LKR ${(item.price * item.qty).toLocaleString()}</span>
          </div>
        `).join("")}
        <div style="border-top:1px solid var(--border-color); margin-top:0.5rem; padding-top:0.5rem; display:flex; justify-content:space-between; font-weight:800;">
          <span>Total (incl. Delivery):</span>
          <span style="color:#25D366;">LKR ${grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <form id="whatsappForm">
        <div style="margin-bottom:1rem;">
          <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.4rem;">Your Name *</label>
          <input type="text" id="waName" required placeholder="e.g. Kasun Perera">
        </div>
        <div style="margin-bottom:1rem;">
          <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.4rem;">Phone Number / WhatsApp *</label>
          <input type="tel" id="waPhone" required placeholder="e.g. 077 123 4567">
        </div>
        <div style="margin-bottom:1.5rem;">
          <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.4rem;">Delivery Address *</label>
          <input type="text" id="waAddress" required placeholder="e.g. No 12, Main Street, Matara">
        </div>

        <button type="submit" class="btn-whatsapp" style="width:100%; padding:0.85rem;">
          <i class="fab fa-whatsapp"></i> Send Order via WhatsApp
        </button>
      </form>
    `;

    whatsappModalOverlay.classList.add("active");

    const form = document.getElementById("whatsappForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("waName").value.trim();
      const phone = document.getElementById("waPhone").value.trim();
      const address = document.getElementById("waAddress").value.trim();

      // Record Order in Local Storage
      const order = StorageDB.addOrder({
        customerName: name,
        phone: phone,
        address: address,
        items: items,
        total: grandTotal,
        paymentMethod: "WhatsApp Quick-Order",
        status: "Pending"
      });

      if (!productId) StorageDB.clearCart();

      // Build WhatsApp Encoded URL
      let message = `*D-TEL Mobile Hub - New Quick Order*\n`;
      message += `*Order ID:* ${order.id}\n`;
      message += `*Customer:* ${name}\n`;
      message += `*Phone:* ${phone}\n`;
      message += `*Address:* ${address}\n\n`;
      message += `*Order Items:*\n`;
      items.forEach((item, idx) => {
        message += `${idx + 1}. ${item.name} (x${item.qty}) - LKR ${(item.price * item.qty).toLocaleString()}\n`;
      });
      message += `\n*Total Payable:* LKR ${grandTotal.toLocaleString()} (Cash on Delivery)\n`;
      message += `\nPlease confirm order processing and delivery time!`;

      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/94771234567?text=${encodedMsg}`;

      window.open(waUrl, "_blank");
      window.closeWhatsAppModal();
      closeCartDrawer();
      alert("Order placed successfully! WhatsApp launcher opened.");
      renderProducts();
    });
  };

  window.closeWhatsAppModal = function() {
    if (whatsappModalOverlay) whatsappModalOverlay.classList.remove("active");
  };

  // ==========================================
  // DUAL CHECKOUT: COD CHECKOUT MODAL
  // ==========================================
  window.openCODCheckoutModal = function() {
    const cart = StorageDB.getCart();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!codModalOverlay) return;

    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const delivery = subtotal > 20000 ? 0 : 450;
    const grandTotal = subtotal + delivery;

    codModalOverlay.querySelector(".modal-card").innerHTML = `
      <button class="modal-close-btn" onclick="window.closeCODModal()">&times;</button>
      <h2 style="margin-bottom:0.5rem;"><i class="fas fa-truck" style="color:var(--accent-cyan);"></i> Cash on Delivery Checkout</h2>
      <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">Pay safely in cash when your mobile device or accessories are delivered to your doorstep.</p>

      <form id="codForm">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
          <div>
            <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.4rem;">Full Name *</label>
            <input type="text" id="codName" required placeholder="Kasun Perera">
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.4rem;">Mobile Phone *</label>
            <input type="tel" id="codPhone" required placeholder="077 123 4567">
          </div>
        </div>

        <div style="margin-bottom:1rem;">
          <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.4rem;">Delivery Address *</label>
          <textarea id="codAddress" required rows="2" placeholder="Street Address, City, District"></textarea>
        </div>

        <div style="background:var(--bg-primary); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.9rem;">
            <span>Cart Items (${cart.length}):</span>
            <span>LKR ${subtotal.toLocaleString()}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.9rem;">
            <span>Islandwide Express Delivery:</span>
            <span>${delivery === 0 ? 'FREE' : `LKR ${delivery.toLocaleString()}`}</span>
          </div>
          <div style="border-top:1px solid var(--border-color); padding-top:0.5rem; display:flex; justify-content:space-between; font-weight:800; font-size:1.1rem;">
            <span>Total Payable:</span>
            <span style="color:var(--accent-cyan);">LKR ${grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <button type="submit" class="btn-primary" style="width:100%; padding:0.85rem;">
          <i class="fas fa-check-circle"></i> Confirm Cash on Delivery Order
        </button>
      </form>
    `;

    codModalOverlay.classList.add("active");

    const form = document.getElementById("codForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("codName").value.trim();
      const phone = document.getElementById("codPhone").value.trim();
      const address = document.getElementById("codAddress").value.trim();

      const items = cart.map(c => ({ id: c.productId, name: c.name, price: c.price, qty: c.qty }));

      const order = StorageDB.addOrder({
        customerName: name,
        phone: phone,
        address: address,
        items: items,
        total: grandTotal,
        paymentMethod: "Cash on Delivery",
        status: "Pending"
      });

      StorageDB.clearCart();
      window.closeCODModal();
      closeCartDrawer();
      alert(`Order ${order.id} placed successfully! Thank you for shopping with D-TEL.`);
      renderProducts();
    });
  };

  window.closeCODModal = function() {
    if (codModalOverlay) codModalOverlay.classList.remove("active");
  };

  const codCheckoutBtn = document.getElementById("codCheckoutBtn");
  if (codCheckoutBtn) codCheckoutBtn.addEventListener("click", window.openCODCheckoutModal);

  const whatsappCheckoutBtn = document.getElementById("whatsappCheckoutBtn");
  if (whatsappCheckoutBtn) whatsappCheckoutBtn.addEventListener("click", () => window.openQuickWhatsAppModal());

  // Live Store Settings Synchronizer
  window.applyStoreSettingsToDOM = function() {
    if (typeof StorageDB === 'undefined' || !StorageDB.getStoreSettings) return;
    const s = StorageDB.getStoreSettings();

    // 1. Update live addresses
    document.querySelectorAll(".store-live-address").forEach(el => {
      el.innerHTML = `<i class="fas fa-map-marker-alt" style="color:#ef4444;"></i> ${s.address || '2nd Road, Piliyandala, Sri Lanka'}`;
    });

    // 2. Update live phone numbers
    document.querySelectorAll(".store-live-phone").forEach(el => {
      el.innerHTML = `<i class="fas fa-phone-alt" style="color:var(--accent-cyan);"></i> Phone: <a href="tel:${(s.phone || '').replace(/\s+/g, '')}" style="color:inherit; text-decoration:none;">${s.phone || '070 194 8371'}</a>`;
    });

    // 3. Update live emails
    document.querySelectorAll(".store-live-email").forEach(el => {
      el.innerHTML = `<i class="fas fa-envelope" style="color:var(--accent-blue);"></i> Email: <a href="mailto:${s.email || 'dtel@gmail.com'}" style="color:inherit; text-decoration:none;">${s.email || 'dtel@gmail.com'}</a>`;
    });

    // 4. Update live opening hours
    document.querySelectorAll(".store-live-hours").forEach(el => {
      el.innerHTML = `<i class="fas fa-clock" style="color:var(--accent-amber);"></i> Hours: ${s.hours || 'Mon - Sat: 9:00 AM - 8:30 PM'}`;
    });

    // 5. Update WhatsApp buttons and social links
    const cleanWa = (s.whatsapp || s.phone || "0701948371").replace(/[^0-9]/g, '');
    const waNum = cleanWa.startsWith('0') ? '94' + cleanWa.substring(1) : (cleanWa.startsWith('94') ? cleanWa : '94' + cleanWa);
    document.querySelectorAll(".store-live-whatsapp-link").forEach(el => {
      el.href = `https://wa.me/${waNum}?text=Hi%20D-TEL%20Cellular!%20I%20have%20an%20inquiry.`;
    });

    // 6. Update Google Maps Embed Iframe
    const mapIframe = document.getElementById("storeLocationMapIframe");
    const mapDirectLink = document.getElementById("storeDirectMapLink");
    const mapText = document.getElementById("storeLocationMapText");
    const query = encodeURIComponent(s.address || s.city || "2nd Road, Piliyandala, Sri Lanka");
    if (mapIframe) {
      mapIframe.src = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    if (mapDirectLink) {
      mapDirectLink.href = `https://maps.google.com/?q=${query}`;
    }
    if (mapText) {
      mapText.textContent = s.address || "2nd Road, Piliyandala, Sri Lanka";
    }
  };

  // Listeners for storage updates across tabs
  window.addEventListener("cartUpdated", updateCartUI);
  window.addEventListener("wishlistUpdated", updateWishlistUI);
  window.addEventListener("storeSettingsUpdated", window.applyStoreSettingsToDOM);

  // Initial Execution
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  window.applyStoreSettingsToDOM();
});
