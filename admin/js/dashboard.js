import { subscribeProducts, subscribeAllOrders, fetchAllUsers } from "../firebase/firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  const prodVal = document.getElementById('stat-products');
  const ordVal = document.getElementById('stat-orders');
  const userVal = document.getElementById('stat-users');
  const revVal = document.getElementById('stat-revenue');
  const recentTable = document.getElementById('recent-orders-body');

  // Realtime Products Count Stream
  subscribeProducts((products) => {
    if (prodVal) prodVal.textContent = products.length;
  });

  // Realtime Orders & Revenue Stream
  subscribeAllOrders((orders) => {
    if (ordVal) ordVal.textContent = orders.length;

    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
    if (revVal) revVal.textContent = `$${totalRevenue.toFixed(2)}`;

    if (recentTable) {
      if (orders.length === 0) {
        recentTable.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No orders found.</td></tr>`;
        return;
      }

      recentTable.innerHTML = orders.slice(0, 5).map(ord => `
        <tr>
          <td>#${ord.id.substring(0, 6)}</td>
          <td>${ord.customerName || 'N/A'}</td>
          <td>$${Number(ord.totalAmount || 0).toFixed(2)}</td>
          <td><span class="badge badge-${(ord.status || 'pending').toLowerCase()}">${ord.status || 'Pending'}</span></td>
        </tr>
      `).join('');
    }
  });

  // Users Aggregate Fetch
  fetchAllUsers().then(users => {
    if (userVal) userVal.textContent = users.length;
  });
});
