/* Combo Builder JavaScript */

document.addEventListener('DOMContentLoaded', function () {
  const selectedProducts = new Map(); // id -> {name, price}

  const totalItemsEl = document.getElementById('combo-total-items');
  const subtotalEl = document.getElementById('combo-subtotal');
  const discountEl = document.getElementById('combo-discount');
  const discountRowEl = document.getElementById('combo-discount-row');
  const totalEl = document.getElementById('combo-total');
  const discountTiers = document.querySelectorAll('.discount-tier');
  const addAllBtn = document.getElementById('combo-add-all-btn');
  const comboMsg = document.getElementById('combo-message');

  // Parse discount tiers from data attributes
  const tiers = [];
  document.querySelectorAll('[data-discount-tier]').forEach(el => {
    tiers.push({
      minItems: parseInt(el.dataset.minItems, 10),
      percent: parseFloat(el.dataset.discountPercent),
      el: el,
    });
  });

  function getBestDiscount(count) {
    let best = null;
    for (const tier of tiers) {
      if (count >= tier.minItems) {
        if (!best || tier.percent > best.percent) best = tier;
      }
    }
    return best;
  }

  function formatCurrency(val) {
    return '£' + val.toFixed(2);
  }

  function updateSummary() {
    const count = Array.from(selectedProducts.values()).reduce((s, p) => s + p.qty, 0);
    let subtotal = 0;
    selectedProducts.forEach(p => { subtotal += p.price * p.qty; });

    const best = getBestDiscount(count);
    const discountAmount = best ? subtotal * best.percent / 100 : 0;
    const total = subtotal - discountAmount;

    if (totalItemsEl) totalItemsEl.textContent = count;
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (totalEl) totalEl.textContent = formatCurrency(total);

    if (discountEl && discountRowEl) {
      if (best) {
        discountEl.textContent = `-${formatCurrency(discountAmount)} (${best.percent}% off)`;
        discountRowEl.style.display = '';
      } else {
        discountRowEl.style.display = 'none';
      }
    }

    // Highlight tiers
    discountTiers.forEach(t => {
      const min = parseInt(t.dataset.minItems, 10);
      t.classList.remove('active', 'achieved');
      if (count >= min) {
        t.classList.add('achieved');
      } else if (best && count < min) {
        // next tier to achieve
        const nextBetter = tiers.find(ti => ti.minItems > count);
        if (nextBetter && nextBetter.minItems === min) {
          t.classList.add('active');
        }
      }
    });

    // Show next milestone message
    if (comboMsg) {
      const nextTier = tiers.find(t => t.minItems > count);
      if (nextTier) {
        const needed = nextTier.minItems - count;
        comboMsg.textContent = `Add ${needed} more item${needed > 1 ? 's' : ''} to unlock ${nextTier.percent}% discount!`;
        comboMsg.classList.remove('d-none');
      } else if (count > 0) {
        comboMsg.textContent = `🎉 Maximum combo discount applied!`;
        comboMsg.classList.remove('d-none');
      } else {
        comboMsg.classList.add('d-none');
      }
    }

    // Enable/disable add-all button
    if (addAllBtn) {
      addAllBtn.disabled = selectedProducts.size === 0;
    }
  }

  // Handle checkbox/card clicks
  document.querySelectorAll('.combo-item-check').forEach(card => {
    card.addEventListener('click', function (e) {
      // Don't interfere with quantity inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
      const id = this.dataset.productId;
      const name = this.dataset.productName;
      const price = parseFloat(this.dataset.productPrice);
      const checkbox = this.querySelector('.combo-checkbox');

      if (selectedProducts.has(id)) {
        selectedProducts.delete(id);
        this.classList.remove('selected');
        if (checkbox) checkbox.checked = false;
      } else {
        selectedProducts.set(id, { name, price, qty: 1 });
        this.classList.add('selected');
        if (checkbox) checkbox.checked = true;
      }
      updateSummary();
    });
  });

  // Add-all-to-cart button submits a form with all selected product IDs
  if (addAllBtn) {
    addAllBtn.addEventListener('click', function () {
      if (selectedProducts.size === 0) return;
      const form = document.getElementById('combo-add-form');
      // Remove old hidden inputs
      form.querySelectorAll('input[name="product_id"]').forEach(i => i.remove());
      selectedProducts.forEach((_, id) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'product_id';
        input.value = id;
        form.appendChild(input);
      });
      form.submit();
    });
  }

  updateSummary();
});
