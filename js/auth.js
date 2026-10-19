/**
 * D-TEL Cellular E-Business System - Premium Veloce-Inspired Split Auth Engine
 * ICT2142 E-Business Systems Project
 * Supports 2-Column Split Layout, MySQL Database Registration & Authentication,
 * Admin Routing (dtel@gmail.com / Dtel@123), and Seamless View Flipping.
 */

const Auth = {
  // Current logged in user session
  getUser() {
    try {
      return JSON.parse(localStorage.getItem("tz_user"));
    } catch (e) {
      return null;
    }
  },

  // Save logged-in user
  setUser(user) {
    if (typeof StorageDB !== 'undefined' && StorageDB.setUser) {
      StorageDB.setUser(user);
    } else {
      localStorage.setItem("tz_user", JSON.stringify(user));
      window.dispatchEvent(new CustomEvent("userUpdated", { detail: user }));
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      window.dispatchEvent(new CustomEvent("wishlistUpdated"));
    }
    if (typeof window.updateHeaderCounters === 'function') {
      window.updateHeaderCounters();
    }
    this.updateHeaderAuthUI();
  },

  // Logout current user
  logout() {
    localStorage.removeItem("tz_user");
    try {
      localStorage.removeItem("tz_cart_guest");
      localStorage.removeItem("tz_wishlist_guest");
      localStorage.removeItem("tz_cart");
    } catch(e) {}
    window.dispatchEvent(new CustomEvent("userUpdated", { detail: null }));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    window.dispatchEvent(new CustomEvent("wishlistUpdated"));
    if (typeof window.updateHeaderCounters === 'function') {
      window.updateHeaderCounters();
    }
    this.updateHeaderAuthUI();
    // Redirect immediately to live website (index.html)
    window.location.href = "index.html";
  },

  // Check if logged in as admin
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  // Check if logged in as customer
  isCustomer() {
    const user = this.getUser();
    return user && (user.role === 'customer' || !user.role);
  },

  // Unified Login (Customer & Admin) — authenticated against MySQL
  async login(usernameOrEmail, password) {
    try {
      if (typeof ApiClient === 'undefined' || !ApiClient.login) {
        return { success: false, message: 'Database API client is not loaded. Please open the project through XAMPP/Apache.' };
      }

      const res = await ApiClient.login(usernameOrEmail, password);
      if (res && res.status === 'success' && res.user) {
        const userObj = res.user;
        userObj.role = res.role || userObj.role || 'customer';
        this.setUser(userObj);
        return { success: true, user: userObj, role: userObj.role };
      }
      return { success: false, message: res?.message || 'Invalid email or password.' };
    } catch (e) {
      console.error('Database login failed:', e);
      return {
        success: false,
        message: e.message || 'Cannot connect to the database. Start Apache/MySQL and import database.sql.'
      };
    }
  },

  // Customer Registration — saved to MySQL
  async registerCustomer(userData) {
    try {
      if (typeof ApiClient === 'undefined' || !ApiClient.register) {
        return { success: false, message: 'Database API client is not loaded. Please open the project through XAMPP/Apache.' };
      }
      const res = await ApiClient.register(userData);
      if (res && res.status === 'success' && res.user) {
        const userObj = res.user;
        userObj.role = 'customer';
        this.setUser(userObj);
        return { success: true, user: userObj };
      }
      return { success: false, message: res?.message || 'Registration failed.' };
    } catch (e) {
      console.error('Database registration failed:', e);
      return { success: false, message: e.message || 'Cannot connect to the database.' };
    }
  },

  // Update header navbar auth UI across all pages
  updateHeaderAuthUI() {
    const user = this.getUser();
    const signinLinks = document.querySelectorAll('a[title*="Sign In"], button[title*="Sign In"], .nav-auth-btn');

    signinLinks.forEach(link => {
      if (user) {
        if (user.role === 'admin') {
          link.innerHTML = `<i class="fas fa-shield-alt" style="color:var(--accent-amber);"></i> <span>Admin Portal</span>`;
          link.setAttribute('href', 'admin.html');
          link.onclick = null;
          link.title = `Logged in as Admin (${user.email || 'dtel@gmail.com'})`;
        } else {
          const shortName = (user.name || 'User').split(' ')[0];
          link.innerHTML = `<i class="fas fa-user-circle" style="color:var(--accent-cyan);"></i> <span>${shortName}</span>`;
          link.setAttribute('href', 'account.html');
          link.style.cursor = 'pointer';
          link.onclick = null;
          link.title = `My Account (${user.name}) - View Orders & Profile`;
        }
      } else {
        link.innerHTML = `<i class="fas fa-user-circle"></i> <span>Sign In</span>`;
        link.removeAttribute('href');
        link.style.cursor = 'pointer';
        link.onclick = (e) => {
          e.preventDefault();
          Auth.openModal('login');
        };
        link.title = `Sign In / Register`;
      }
    });
  },

  // Ensure modal container exists in DOM
  ensureModalContainer() {
    let modal = document.getElementById("globalAuthModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "globalAuthModal";
      modal.className = "modal-overlay";
      modal.innerHTML = `
        <div class="modal-card auth-split-modal-card">
          <button class="modal-close-btn" onclick="Auth.closeModal()" title="Close" style="z-index:10; color:#cbd5e1; background:rgba(0,0,0,0.5); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; top:16px; right:16px;">&times;</button>
          
          <div id="veloceAuthContainer" class="auth-split-wrapper">
            <!-- Dynamically rendered via renderVeloceModal() -->
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close on clicking outside
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          Auth.closeModal();
        }
      });
    }
  },

  // Current active mode: 'login' | 'register'
  _currentMode: 'login',
  _onSuccessCallback: null,

  // Toggle Password visibility
  togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      btnEl.innerHTML = `<i class="far fa-eye-slash" style="color:var(--accent-cyan);"></i>`;
    } else {
      input.type = 'password';
      btnEl.innerHTML = `<i class="far fa-eye"></i>`;
    }
  },

  // ─── Real-time field validation helpers ───────────────────────────
  _setFieldState(inputEl, valid) {
    if (!inputEl) return;
    const wrap = inputEl.closest('.auth-input-wrap') || inputEl.closest('.auth-field-box');
    inputEl.style.borderColor = valid ? '#22c55e' : '#ef4444';
    inputEl.style.boxShadow   = valid
      ? '0 0 0 2px rgba(34,197,94,0.18)'
      : '0 0 0 2px rgba(239,68,68,0.18)';
    if (wrap) {
      wrap.style.borderColor = valid ? '#22c55e' : '#ef4444';
      wrap.style.boxShadow   = valid
        ? '0 0 0 2px rgba(34,197,94,0.18)'
        : '0 0 0 2px rgba(239,68,68,0.18)';
    }
  },

  _clearFieldState(inputEl) {
    if (!inputEl) return;
    const wrap = inputEl.closest('.auth-input-wrap') || inputEl.closest('.auth-field-box');
    inputEl.style.borderColor = '';
    inputEl.style.boxShadow   = '';
    if (wrap) { wrap.style.borderColor = ''; wrap.style.boxShadow = ''; }
  },

  // Attach live validation listeners to register form fields
  attachRegisterValidation(prefix) {
    const $ = id => document.getElementById(id);
    const emailInput   = $(prefix + 'Email');
    const phoneInput   = $(prefix + 'Phone');
    const passInput    = $(prefix + 'Pass');
    const confirmInput = $(prefix + 'ConfirmPass');
    const nameInput    = $(prefix + 'Name');
    const slPhoneRx    = /^07[0-9]{8}$/;
    const pwRx         = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"|,.<>\/?\\]).{8,}$/;

    // ── Name → dynamic email placeholder ───────────────────────────
    if (nameInput && emailInput) {
      nameInput.addEventListener('input', () => {
        const firstName = nameInput.value.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        if (firstName.length > 0) {
          emailInput.placeholder = firstName + '@gmail.com';
        } else {
          emailInput.placeholder = 'your@gmail.com';
        }
      });
    }

    // ── Email: autocomplete @gmail.com suggestion ──────────────────
    if (emailInput) {
      // Create suggestion tooltip
      let suggBox = document.getElementById(prefix + 'EmailSugg');
      if (!suggBox) {
        suggBox = document.createElement('div');
        suggBox.id = prefix + 'EmailSugg';
        suggBox.style.cssText = `
          position:absolute; top:100%; left:0; right:0; z-index:99;
          background:#1e2535; border:1px solid rgba(99,179,237,0.35);
          border-radius:8px; padding:8px 14px; cursor:pointer;
          font-size:0.85rem; color:#94a3b8; display:none;
          box-shadow:0 8px 24px rgba(0,0,0,0.5);
        `;
        const wrap = emailInput.parentElement;
        if (wrap) { wrap.style.position = 'relative'; wrap.appendChild(suggBox); }
      }

      emailInput.addEventListener('input', () => {
        const val = emailInput.value;
        const atIdx = val.indexOf('@');
        const domains = ['@gmail.com','@yahoo.com','@hotmail.com','@outlook.com','@dtel.lk'];

        if (atIdx === -1 && val.length > 2) {
          // Show @gmail.com suggestion
          const suggested = val + '@gmail.com';
          suggBox.innerHTML = `<i class="far fa-envelope" style="margin-right:6px;color:#38bdf8;"></i>${suggested}`;
          suggBox.style.display = 'block';
          suggBox.onclick = () => {
            emailInput.value = suggested;
            suggBox.style.display = 'none';
            emailInput.dispatchEvent(new Event('input'));
          };
        } else if (atIdx !== -1) {
          const typed  = val.slice(atIdx);
          const match  = domains.find(d => d.startsWith(typed) && d !== typed);
          if (match) {
            const full = val.slice(0, atIdx) + match;
            suggBox.innerHTML = `<i class="far fa-envelope" style="margin-right:6px;color:#38bdf8;"></i>${full}`;
            suggBox.style.display = 'block';
            suggBox.onclick = () => {
              emailInput.value = full;
              suggBox.style.display = 'none';
              emailInput.dispatchEvent(new Event('input'));
            };
          } else {
            suggBox.style.display = 'none';
          }
        } else {
          suggBox.style.display = 'none';
        }
      });
      emailInput.addEventListener('blur', () => setTimeout(() => { suggBox.style.display = 'none'; }, 200));
    }

    // ── Phone: live red/green ────────────────────────────────────────
    if (phoneInput) {
      // Allow only digits
      phoneInput.addEventListener('keypress', e => {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
      });
      phoneInput.addEventListener('input', () => {
        const val = phoneInput.value.replace(/\D/g,'');
        phoneInput.value = val.slice(0, 10);
        if (val.length === 0) { this._clearFieldState(phoneInput); return; }
        this._setFieldState(phoneInput, slPhoneRx.test(val));
      });
    }

    // ── Password: live strength ──────────────────────────────────────
    if (passInput) {
      passInput.addEventListener('input', () => {
        const val = passInput.value;
        if (val.length === 0) { this._clearFieldState(passInput); return; }
        this._setFieldState(passInput, pwRx.test(val));
        // Also re-check confirm
        if (confirmInput && confirmInput.value.length > 0) {
          this._setFieldState(confirmInput, confirmInput.value === val);
        }
      });
    }

    // ── Confirm password: live match ────────────────────────────────
    if (confirmInput) {
      confirmInput.addEventListener('input', () => {
        const val = confirmInput.value;
        if (val.length === 0) { this._clearFieldState(confirmInput); return; }
        this._setFieldState(confirmInput, passInput && val === passInput.value);
      });
    }
  },

  // Render the Two-Column Split Layout based on mode
  renderVeloceModal(mode = 'login') {
    this._currentMode = mode;
    const container = document.getElementById("veloceAuthContainer");
    if (!container) return;

    if (mode === 'login') {
      // -------------------------------------------------------------
      // MODE 1: SIGN IN VIEW (Image 1)
      // Left: Dark Form | Right: Vibrant Orange Hero Panel
      // -------------------------------------------------------------
      container.innerHTML = `
        <!-- LEFT COLUMN: Dark Sign In Form -->
        <div class="auth-split-col auth-form-side">
          <div>
            <h2 class="auth-veloce-title">Welcome back</h2>
            <p class="auth-veloce-sub">Sign in to the fleet console to manage orders, cart and accessories</p>

            <!-- Social Login Buttons -->
            <div class="auth-social-row">
              <button type="button" class="auth-social-btn" onclick="Auth.quickGoogleLogin()" style="width:100%; display:flex; justify-content:center; align-items:center; gap:0.75rem; padding:0.75rem 1rem;">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div class="auth-or-line">
              <span>or continue with email</span>
            </div>

            <!-- Live Alert Box -->
            <div class="auth-alert" id="veloceAuthAlert"></div>

            <!-- Email & Password Form -->
            <form onsubmit="Auth.handleVeloceLogin(event)">
              <div class="auth-input-group">
                <label class="auth-input-label">Email / Username</label>
                <div class="auth-input-wrap">
                  <i class="far fa-envelope auth-input-icon"></i>
                  <input type="text" id="veloceLoginUser" class="auth-input-field" placeholder="Enter your email or username" required>
                </div>
              </div>

              <div class="auth-input-group">
                <label class="auth-input-label">Password</label>
                <div class="auth-input-wrap">
                  <i class="fas fa-lock auth-input-icon"></i>
                  <input type="password" id="veloceLoginPass" class="auth-input-field" placeholder="Enter your password" required>
                  <button type="button" class="auth-eye-btn" onclick="Auth.togglePasswordVisibility('veloceLoginPass', this)">
                    <i class="far fa-eye"></i>
                  </button>
                </div>
              </div>

              <div class="auth-options-row">
                <label class="auth-checkbox-label">
                  <input type="checkbox" id="veloceRememberMe" checked>
                  <span>Remember me</span>
                </label>
                <a href="javascript:void(0)" onclick="alert('Password reset link has been dispatched to your email address.')" class="auth-forgot-link">Forgot password?</a>
              </div>

              <button type="submit" id="veloceLoginSubmitBtn" class="auth-veloce-submit-btn">
                Sign in
              </button>
            </form>
          </div>

          <div class="auth-bottom-switch">
            New team member? <a href="javascript:void(0)" onclick="Auth.switchVeloceMode('register')" class="auth-orange-link">Create an account</a>
          </div>
        </div>

        <!-- RIGHT COLUMN: Vibrant Orange / Coral Hero Panel -->
        <div class="auth-split-col auth-hero-side">
          <div>
            <!-- 5-Dash Indicator -->
            <div class="auth-dash-indicator">
              <span class="active"></span>
              <span class="active"></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <!-- Pill Tag -->
            <div class="auth-pill-tag">
              <i class="fas fa-mobile-alt"></i> D-TEL CELLULAR
            </div>

            <h2 class="auth-hero-heading">New to the crew?</h2>
            <p class="auth-hero-desc">Create your operator account and put the fleet to work in minutes.</p>

            <button type="button" class="auth-outline-btn" onclick="Auth.switchVeloceMode('register')">
              Create account
            </button>
          </div>

          <div class="auth-hero-quote">
            "Life is too short to drive boring cars & slow tech."
          </div>
        </div>
      `;
    } else {
      // -------------------------------------------------------------
      // MODE 2: CREATE ACCOUNT VIEW (Image 2)
      // Left: Vibrant Orange Hero Panel | Right: Dark Form
      // -------------------------------------------------------------
      container.innerHTML = `
        <!-- LEFT COLUMN: Vibrant Orange / Coral Hero Panel -->
        <div class="auth-split-col auth-hero-side">
          <div>
            <!-- 5-Dash Indicator -->
            <div class="auth-dash-indicator">
              <span></span>
              <span></span>
              <span class="active"></span>
              <span class="active"></span>
              <span class="active"></span>
            </div>

            <!-- Pill Tag -->
            <div class="auth-pill-tag">
              <i class="fas fa-crown"></i> WELCOME BACK
            </div>

            <h2 class="auth-hero-heading">Back in the driver’s seat</h2>
            <p class="auth-hero-desc">Sign in to keep the fleet moving — rentals, returns and accessories await.</p>

            <button type="button" class="auth-outline-btn" onclick="Auth.switchVeloceMode('login')">
              Sign in
            </button>
          </div>

          <div class="auth-hero-quote">
            "The journey, not the destination, matters."
          </div>
        </div>

        <!-- RIGHT COLUMN: Dark Register Form -->
        <div class="auth-split-col auth-form-side">
          <div>
            <h2 class="auth-veloce-title">Join the crew</h2>
            <p class="auth-veloce-sub">Register an operator account for your rental desk & orders</p>

            <!-- Live Alert Box -->
            <div class="auth-alert" id="veloceAuthAlert"></div>

            <form onsubmit="Auth.handleVeloceRegister(event)">
              <div class="auth-input-group">
                <label class="auth-input-label">Full name</label>
                <div class="auth-input-wrap">
                  <i class="far fa-user auth-input-icon"></i>
                  <input type="text" id="veloceRegName" class="auth-input-field" placeholder="Your full name" required>
                </div>
              </div>

              <div class="auth-input-group">
                <label class="auth-input-label">Email</label>
                <div class="auth-input-wrap">
                  <i class="far fa-envelope auth-input-icon"></i>
                  <input type="email" id="veloceRegEmail" class="auth-input-field" placeholder="your@gmail.com" required>
                </div>
              </div>

              <div class="auth-input-group">
                <label class="auth-input-label">Phone Number <span style="font-size:0.72rem;color:var(--text-muted);font-weight:400;">(Sri Lankan: 07X XXXXXXX)</span></label>
                <div class="auth-input-wrap">
                  <i class="fas fa-phone auth-input-icon"></i>
                  <input type="tel" id="veloceRegPhone" class="auth-input-field" placeholder="0771234567" maxlength="10" required>
                </div>
              </div>

              <div class="auth-input-group">
                <label class="auth-input-label">Address</label>
                <div class="auth-input-wrap">
                  <i class="fas fa-map-marker-alt auth-input-icon"></i>
                  <input type="text" id="veloceRegAddress" class="auth-input-field" placeholder="No 12, Temple Road, Colombo 03" required>
                </div>
              </div>

              <div class="auth-input-group">
                <label class="auth-input-label">Password <span style="font-size:0.72rem;color:var(--text-muted);font-weight:400;">(8+ chars, A-Z, a-z, 0-9, symbol)</span></label>
                <div class="auth-input-wrap">
                  <i class="fas fa-lock auth-input-icon"></i>
                  <input type="password" id="veloceRegPass" class="auth-input-field" placeholder="Min 8 chars" required minlength="8">
                  <button type="button" class="auth-eye-btn" onclick="Auth.togglePasswordVisibility('veloceRegPass', this)">
                    <i class="far fa-eye"></i>
                  </button>
                </div>
              </div>

              <div class="auth-input-group" style="margin-bottom:1.25rem;">
                <label class="auth-input-label">Confirm password</label>
                <div class="auth-input-wrap">
                  <i class="fas fa-shield-alt auth-input-icon"></i>
                  <input type="password" id="veloceRegConfirmPass" class="auth-input-field" placeholder="Repeat your password" required minlength="8">
                  <button type="button" class="auth-eye-btn" onclick="Auth.togglePasswordVisibility('veloceRegConfirmPass', this)">
                    <i class="far fa-eye"></i>
                  </button>
                </div>
              </div>

              <button type="submit" id="veloceRegSubmitBtn" class="auth-veloce-submit-btn">
                Create account
              </button>
            </form>
          </div>

          <div class="auth-bottom-switch">
            Already registered? <a href="javascript:void(0)" onclick="Auth.switchVeloceMode('login')" class="auth-orange-link">Sign in</a>
          </div>
        </div>
      `;
    }
    // Attach live validation for register mode
    if (mode === 'register') {
      setTimeout(() => Auth.attachRegisterValidation('veloceReg'), 50);
    }
  },

  // Switch between 'login' and 'register' modes
  switchVeloceMode(mode) {
    this.renderVeloceModal(mode);
  },

  // Open Auth Modal
  openModal(tab = 'login', callback = null, customPrompt = '') {
    this.ensureModalContainer();
    this._onSuccessCallback = callback;

    const modal = document.getElementById("globalAuthModal");
    const mode = (tab === 'register' || tab === 'signup') ? 'register' : 'login';
    this.renderVeloceModal(mode);

    if (customPrompt) {
      setTimeout(() => {
        const alertBox = document.getElementById("veloceAuthAlert");
        if (alertBox) {
          alertBox.className = "auth-alert success";
          alertBox.style.background = "rgba(6, 182, 212, 0.15)";
          alertBox.style.borderColor = "rgba(6, 182, 212, 0.4)";
          alertBox.style.color = "#38bdf8";
          alertBox.textContent = customPrompt;
        }
      }, 50);
    }

    modal.classList.add("active");
  },

  // Close Auth Modal
  closeModal() {
    const modal = document.getElementById("globalAuthModal");
    if (modal) modal.classList.remove("active");
    this._onSuccessCallback = null;
  },

  // Handle Login submission (Supports both Customer & Admin credentials)
  async handleVeloceLogin(e) {
    e.preventDefault();
    const userOrEmail = document.getElementById("veloceLoginUser").value.trim();
    const pass = document.getElementById("veloceLoginPass").value;
    const alertEl = document.getElementById("veloceAuthAlert");
    const btn = document.getElementById("veloceLoginSubmitBtn");

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Authenticating...`;

    const res = await this.login(userOrEmail, pass);
    btn.disabled = false;
    btn.innerHTML = `Sign in`;

    if (res.success) {
      if (alertEl) {
        alertEl.className = "auth-alert success";
        alertEl.innerHTML = `<i class="fas fa-check-circle"></i> ${res.role === 'admin' ? 'Admin Access Granted! Entering Admin Dashboard...' : 'Login Successful! Welcome, ' + res.user.name + '.'}`;
      }

      setTimeout(() => {
        const cb = this._onSuccessCallback;
        this.closeModal();

        // If Admin, redirect directly to admin.html
        if (res.role === 'admin' || (res.user && res.user.role === 'admin')) {
          window.location.href = 'admin.html';
          return;
        }

        if (typeof cb === 'function') {
          cb(res.user);
        } else {
          if (typeof renderCheckoutUserDetails === 'function') {
            renderCheckoutUserDetails();
          } else if (window.location.pathname.endsWith('account.html')) {
            window.location.reload();
          }
        }
      }, 500);
    } else {
      if (alertEl) {
        alertEl.className = "auth-alert error";
        alertEl.textContent = res.message || "Invalid email or password.";
      }
      // Highlight password field red on wrong password
      const passEl = document.getElementById("veloceLoginPass");
      if (passEl) Auth._setFieldState(passEl, false);

    }
  },

  // Handle Registration submission (Saves into MySQL DB)
  async handleVeloceRegister(e) {
    e.preventDefault();
    const name = document.getElementById("veloceRegName").value.trim();
    const email = document.getElementById("veloceRegEmail").value.trim();
    const phone = document.getElementById("veloceRegPhone").value.trim();
    const address = document.getElementById("veloceRegAddress").value.trim();
    const pass = document.getElementById("veloceRegPass").value;
    const confirmPass = document.getElementById("veloceRegConfirmPass").value;
    const alertEl = document.getElementById("veloceAuthAlert");
    const btn = document.getElementById("veloceRegSubmitBtn");

    // Sri Lankan phone validation: 07X XXXXXXX (10 digits starting with 07)
    const slPhoneRegex = /^(07[0-9]{8})$/;
    if (!slPhoneRegex.test(phone)) {
      if (alertEl) {
        alertEl.className = "auth-alert error";
        alertEl.textContent = "Invalid phone number. Please enter a valid Sri Lankan number (e.g. 0771234567).";
      }
      return;
    }

    // Password strength: 8+ chars, uppercase, lowercase, number, special char
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!pwRegex.test(pass)) {
      if (alertEl) {
        alertEl.className = "auth-alert error";
        alertEl.textContent = "Password must be 8+ characters and include uppercase, lowercase, a number, and a special character (e.g. Abc@1234).";
      }
      return;
    }

    if (pass !== confirmPass) {
      if (alertEl) {
        alertEl.className = "auth-alert error";
        alertEl.textContent = "Passwords do not match. Please verify and repeat.";
      }
      return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Creating Account & Saving to Database...`;

    const res = await this.registerCustomer({
      name,
      email,
      password: pass,
      phone,
      address
    });

    btn.disabled = false;
    btn.innerHTML = `Create account`;

    if (res.success) {
      if (alertEl) {
        alertEl.className = "auth-alert success";
        alertEl.innerHTML = `<i class="fas fa-check-circle"></i> Account created & saved to database! Welcome, <strong>${res.user.name}</strong>.`;
      }

      setTimeout(() => {
        const cb = this._onSuccessCallback;
        this.closeModal();
        if (typeof cb === 'function') {
          cb(res.user);
        } else {
          if (typeof renderCheckoutUserDetails === 'function') {
            renderCheckoutUserDetails();
          } else if (window.location.pathname.endsWith('account.html')) {
            window.location.reload();
          }
        }
      }, 600);
    } else {
      if (alertEl) {
        alertEl.className = "auth-alert error";
        alertEl.textContent = res.message || "Registration failed. This email might already exist.";
      }
    }
  },

  // 1-Click Social Logins
  quickGoogleLogin() {
    const googleUser = {
      user_id: 1,
      name: "Kasun Perera (Google)",
      email: "kasun.p@gmail.com",
      phone: "0771234567",
      address: "Colombo 03, Sri Lanka",
      role: "customer"
    };
    this.setUser(googleUser);
    alert("Signed in successfully with Google account: kasun.p@gmail.com");
    const cb = this._onSuccessCallback;
    this.closeModal();
    if (typeof cb === 'function') cb(googleUser);
  },

  quickGithubLogin() {
    const gitUser = {
      user_id: 2,
      name: "Dominic Reyes (GitHub)",
      email: "dominic@github.com",
      phone: "0779876543",
      address: "Colombo, Sri Lanka",
      role: "customer"
    };
    this.setUser(gitUser);
    alert("Signed in successfully with GitHub account: dominic@github.com");
    const cb = this._onSuccessCallback;
    this.closeModal();
    if (typeof cb === 'function') cb(gitUser);
  }
};

// Expose globally
window.Auth = Auth;

// Run initial header sync on DOM load
document.addEventListener("DOMContentLoaded", () => {
  Auth.updateHeaderAuthUI();
});
