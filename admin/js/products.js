import { subscribeProducts, toggleProductStatusInDB, deleteProductFromDB } from "../firebase/firestore.js";

let productList = [];

const renderTable = (items) => {
  const container = document.getElementById('products-table-body');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No products available. Add one using the button above.</td></tr>`;
    return;
  }

  container.innerHTML = items.map(p => `
    <tr>
      <td>
        <img src="${p.imageUrl || 'assets/placeholder.webp'}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 8px;">
      </td>
      <td style="font-weight: 600;">${p.name}</td>
      <td>${p.category || 'General'}</td>
      <td style="color: var(--primary); font-weight: 700;">$${Number(p.price).toFixed(2)}</td>
      <td>${p.stock || 0}</td>
      <td>
        <span class="badge ${p.status === 'Active' ? 'badge-active' : 'badge-hidden'}">${p.status || 'Active'}</span>
      </td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="toggle-status-btn btn" data-id="${p.id}" data-status="${p.status || 'Active'}" style="padding: 0.4rem 0.7rem; font-size: 0.75rem; background: rgba(255,255,255,0.08); color: white;">
            ${p.status === 'Active' ? 'Hide' : 'Show'}
          </button>
          <a href="edit-product.html?id=${p.id}" class="btn" style="padding: 0.4rem 0.7rem; font-size: 0.75rem; background: rgba(59, 130, 246, 0.2); color: #60A5FA;">Edit</a>
          <button class="delete-btn btn" data-id="${p.id}" style="padding: 0.4rem 0.7rem; font-size: 0.75rem; background: rgba(239, 68, 68, 0.2); color: #F87171;">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Event Handlers
  container.querySelectorAll('.toggle-status-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      const status = e.currentTarget.dataset.status;
      await toggleProductStatusInDB(id, status);
      window.showToast("Product status updated!");
    });
  });

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      if (confirm("Are you sure you want to delete this product? It will immediately disappear from the User Website.")) {
        const id = e.currentTarget.dataset.id;
        await deleteProductFromDB(id);
        window.showToast("Product deleted successfully!");
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  subscribeProducts((products) => {
    productList = products;
    renderTable(productList);
  });

  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = productList.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.category && p.category.toLowerCase().includes(q))
      );
      renderTable(filtered);
    });
  }
});
