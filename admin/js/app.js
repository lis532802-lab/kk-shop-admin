import { isAdminAuthenticated, logoutAdmin } from "../firebase/auth.js";

// Global Admin Authentication Guard
const enforceAdminProtection = () => {
  const isLoginPage = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/admin/");
  const authenticated = isAdminAuthenticated();

  if (!authenticated && !isLoginPage) {
    window.location.href = "index.html";
  } else if (authenticated && isLoginPage) {
    window.location.href = "dashboard.html";
  }
};

// Global Toast System
window.showToast = (message, type = 'success') => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

document.addEventListener('DOMContentLoaded', () => {
  enforceAdminProtection();

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutAdmin);
  }
});
