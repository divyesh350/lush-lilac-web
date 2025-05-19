function generateReceipt(order) {
  return `
      🧾 LUSH LILAC - Order Receipt
  
      Order ID: ${order._id}
      Customer: ${order.user.name} (${order.user.email})
      Date: ${new Date(order.createdAt).toLocaleString()}
      
      Shipping Address:
      ${order.shippingAddress}
      
      Items:
      ${order.items
        .map(
          (item) => `
        - ${item.productId.name} (${item.variant.size || ""} ${
            item.variant.color || ""
          } ${item.variant.material || ""})
          Qty: ${item.quantity} x ₹${item.price}
      `
        )
        .join("\n")}
      
      Total: ₹${order.totalAmount}
  
      Payment Status: ${order.paymentInfo.paid ? "Paid ✅" : "Unpaid ❌"}
      Payment Method: ${order.paymentInfo.method || "N/A"}
  
      Thank you for shopping with Lush Lilac!
    `;
}

module.exports = generateReceipt;
