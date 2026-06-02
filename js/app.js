// app.js

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // ── Dummy-page redirect: unbuilt links → 404.html ───────────────────────
  // Only these pages navigate correctly:
  const REAL_PAGES = new Set([
    'index.html', 'dashboard.html', '404.html',
    '', '#'
  ]);

  document.body.addEventListener('click', function (e) {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href') || '';

    // Allow: real pages, anchors, mailto, tel
    if (
      href.startsWith('#')          ||
      href.startsWith('mailto:')    ||
      href.startsWith('tel:')       ||
      href.startsWith('javascript') ||
      REAL_PAGES.has(href)
    ) return;

    // Everything else → 404
    e.preventDefault();
    e.stopPropagation();
    window.location.href = '404.html';
  });

  // Mock Authentication Flow
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = document.getElementById('roleSelect').value;
      
      // Save role in session storage to use in dashboard
      sessionStorage.setItem('banking_role', role);
      
      // Redirect to dashboard
      window.location.href = 'dashboard.html';
    });
  }

  // Dashboard Role Filtering
  const dashboardContainer = document.getElementById('dashboard-dynamic-content');
  if (dashboardContainer) {
    const role = sessionStorage.getItem('banking_role') || 'customer';
    
    // Update user info
    document.getElementById('userName').textContent = role === 'admin' ? 'System Admin' : 'John Doe';
    document.getElementById('userRole').textContent = role === 'admin' ? 'Administrator' : 'Premium Customer';
    
    if (role === 'admin') {
      dashboardContainer.innerHTML = `
        <h2 style="margin-bottom: 2rem;">System Overview</h2>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-title">Total Users</div>
            <div class="stat-value">124,592</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Daily Transactions</div>
            <div class="stat-value">$14.2M</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">System Health</div>
            <div class="stat-value" style="color: #10B981;">99.99%</div>
          </div>
        </div>
        <div class="card">
          <div class="card-content">
            <h3>Recent Admin Alerts</h3>
            <p>No critical issues detected across the infrastructure.</p>
          </div>
        </div>
      `;
    } else {
      dashboardContainer.innerHTML = `
        <h2 style="margin-bottom: 2rem;">Accounts Summary</h2>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-title">Checking Account</div>
            <div class="stat-value">$4,250.00</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Savings Account</div>
            <div class="stat-value">$12,800.50</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Credit Card Balance</div>
            <div class="stat-value">$340.20</div>
          </div>
        </div>
        <div class="card">
          <div class="card-content">
            <h3>Recent Transactions</h3>
            <p>Amazon.com - $45.99</p>
            <p>Starbucks - $4.50</p>
            <p>Salary Deposit - $3,200.00</p>
          </div>
        </div>
      `;
    }
  }

  // Animated Stat Counters (Stats Bar)
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 1800;
      const start = performance.now();
      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current >= 1000000
          ? (current / 1000000).toFixed(1) + 'M'
          : current.toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target >= 1000000
          ? (target / 1000000).toFixed(1) + 'M'
          : target.toLocaleString();
      };
      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
  }
});

// ── Preloader Logic ─────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 500); // minimum 0.5s display for smooth transition
    }
});
