import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { generateOrderNumber, getCustomComboDiscount } from '@/lib/utils';

export async function POST(request) {
  const db = getDB();
  const body = await request.json();

  const { customer_name, customer_phone, shipping_address, city, district, customer_email, payment_method, items } = body;

  if (!customer_name || !customer_phone || !shipping_address || !city || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Validate phone (Nepal format)
  const phoneRegex = /^(\+977)?[9][6-9]\d{8}$/;
  if (!phoneRegex.test(customer_phone.replace(/[\s-]/g, ''))) {
    return NextResponse.json({ error: 'Invalid Nepal phone number' }, { status: 400 });
  }

  let totalAmount = 0;
  let discountAmount = 0;

  // Compute totals
  for (const item of items) {
    if (item.type === 'product') {
      const prod = db.prepare('SELECT price FROM products WHERE id = ?').get(item.id);
      if (!prod) return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 400 });
      totalAmount += prod.price * item.quantity;
    } else if (item.type === 'combo') {
      const combo = db.prepare('SELECT * FROM combos WHERE id = ?').get(item.id);
      if (!combo) return NextResponse.json({ error: `Combo ${item.id} not found` }, { status: 400 });
      const comboItems = db.prepare(`
        SELECT ci.quantity, p.price FROM combo_items ci
        JOIN products p ON ci.product_id = p.id WHERE ci.combo_id = ?
      `).all(combo.id);
      const originalPrice = comboItems.reduce((s, i) => s + i.price * i.quantity, 0);
      const comboPrice = Math.round(originalPrice * (1 - combo.discount_percent / 100));
      totalAmount += comboPrice * item.quantity;
      discountAmount += (originalPrice - comboPrice) * item.quantity;
    } else if (item.type === 'custom_combo') {
      if (!item.productIds?.length || item.productIds.length < 2) {
        return NextResponse.json({ error: 'Custom combo must have at least 2 products' }, { status: 400 });
      }
      let originalPrice = 0;
      for (const pid of item.productIds) {
        const prod = db.prepare('SELECT price FROM products WHERE id = ?').get(pid);
        if (!prod) return NextResponse.json({ error: `Product ${pid} not found` }, { status: 400 });
        originalPrice += prod.price;
      }
      const discountPercent = getCustomComboDiscount(item.productIds.length);
      const comboPrice = Math.round(originalPrice * (1 - discountPercent / 100));
      totalAmount += comboPrice * item.quantity;
      discountAmount += (originalPrice - comboPrice) * item.quantity;
    }
  }

  const orderNumber = generateOrderNumber();

  const insertOrder = db.prepare(`
    INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, city, district, total_amount, discount_amount, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, combo_id, quantity, unit_price)
    VALUES (?, ?, ?, ?, ?)
  `);

  const txn = db.transaction(() => {
    const result = insertOrder.run(orderNumber, customer_name, customer_email || null, customer_phone, shipping_address, city, district || null, totalAmount, discountAmount, payment_method || 'cod');
    const orderId = result.lastInsertRowid;

    for (const item of items) {
      if (item.type === 'product') {
        const prod = db.prepare('SELECT price FROM products WHERE id = ?').get(item.id);
        insertItem.run(orderId, item.id, null, item.quantity, prod.price);
      } else if (item.type === 'combo') {
        const combo = db.prepare('SELECT * FROM combos WHERE id = ?').get(item.id);
        const comboItems = db.prepare('SELECT ci.quantity, p.price FROM combo_items ci JOIN products p ON ci.product_id = p.id WHERE ci.combo_id = ?').all(combo.id);
        const originalPrice = comboItems.reduce((s, i) => s + i.price * i.quantity, 0);
        const comboPrice = Math.round(originalPrice * (1 - combo.discount_percent / 100));
        insertItem.run(orderId, null, item.id, item.quantity, comboPrice);
      } else if (item.type === 'custom_combo') {
        let originalPrice = 0;
        for (const pid of item.productIds) {
          const prod = db.prepare('SELECT price FROM products WHERE id = ?').get(pid);
          originalPrice += prod.price;
        }
        const discountPercent = getCustomComboDiscount(item.productIds.length);
        const comboPrice = Math.round(originalPrice * (1 - discountPercent / 100));
        // Store each product in the custom combo as an order item
        for (const pid of item.productIds) {
          const prod = db.prepare('SELECT price FROM products WHERE id = ?').get(pid);
          const discountedPrice = Math.round(prod.price * (1 - discountPercent / 100));
          insertItem.run(orderId, pid, null, item.quantity, discountedPrice);
        }
      }
    }

    return { orderId, orderNumber };
  });

  const order = txn();

  return NextResponse.json({
    success: true,
    order_number: order.orderNumber,
    total_amount: totalAmount,
    discount_amount: discountAmount,
  }, { status: 201 });
}
