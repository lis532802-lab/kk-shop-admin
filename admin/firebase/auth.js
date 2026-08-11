// Session Admin Check Utility
export const verifyAdminLogin = (username, password) => {
  if (username === "KK" && password === "1212") {
    sessionStorage.setItem("kk_admin_authenticated", "true");
    sessionStorage.setItem("kk_admin_user", username);
    return true;
  }
  return false;
};

export const isAdminAuthenticated = () => {
  return sessionStorage.getItem("kk_admin_authenticated") === "true";
};

export const logoutAdmin = () => {
  sessionStorage.removeItem("kk_admin_authenticated");
  sessionStorage.removeItem("kk_admin_user");
  window.location.href = "index.html";
};
