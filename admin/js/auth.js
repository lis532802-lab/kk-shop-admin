import { verifyAdminLogin } from "../firebase/auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  const errorMsg = document.getElementById('auth-error');

  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('admin-username').value.trim();
    const pass = document.getElementById('admin-password').value.trim();

    if (verifyAdminLogin(user, pass)) {
      window.location.href = "dashboard.html";
    } else {
      errorMsg.textContent = "Invalid Username or Password.";
      errorMsg.style.display = "block";
    }
  });
});
