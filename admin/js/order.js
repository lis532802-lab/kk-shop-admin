import { subscribeAllOrders, updateOrderStatusInDB } from "../firebase/firestore.js";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('admin-orders-body');
  if (!container) return;

  subscribeAllOrders((orders) => {
    if (orders.length === 0) {
      container.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No orders placed yet.</td></tr>`;
      return;
    }

    container.innerHTML = orders.map(ord => `
      <tr>
        <td>
          <div style="font-weight: 700;">#${ord.id}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${ord.customerName || 'Guest'}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${ord.phone || ''}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${ord.address || ''}, ${ord.district || ''}</div>
        </td>
        <td>
          ${(ord.items || []).map(item => `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
              <img src="${item.imageUrl || 'assets/placeholder.webp'}" style="width: 28px; height: 28px; object-fit: cover; border-radius: 4px;">
              <span style="font-size: 0.85rem;">${item.name} (x${item.quantity})</span>
            </div>
          `).join('')}
        </td>
        <td style="font-weight: 800; color: var(--primary);">$${Number(ord.totalAmount || 0).toFixed(2)}</td>
        <td>
          <select class="status-select form-control" data-id="${ord.id}" style="padding: 0.3rem 0.5rem; font-size: 0.8rem; background: #0F172A;">
            ${STATUS_OPTIONS.map(opt => `<option value="${opt}" ${ord.status === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </td>
        <td>
          <span class="badge badge-${(ord.status || 'pending').toLowerCase()}">${ord.status || 'Pending'}</span>
        </td>
      </tr>
    `).join('');

    // Status Change Handler
    container.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const orderId = e.currentTarget.dataset.id;
        const newStatus = e.currentTarget.value;
        await updateOrderStatusInDB(orderId, newStatus);
        window.showToast(`Order status updated to ${newStatus}`);
      });
    });
  });
});
