function generateReceiptHTML(order) {
  const itemsTableRows = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productId.title}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.variant.size || ''} ${item.variant.color || ''} ${item.variant.material || ''}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Receipt - Lush Lilac</title>
      <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { color: #6B4E71; }
        .section { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
        .section h2 { color: #6B4E71; font-size: 18px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .total-row { font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LUSH LILAC</h1>
          <h2>Order Receipt</h2>
        </div>

        <div class="section">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Payment Status:</strong> ${order.paymentInfo.paid ? 'Paid ✅' : 'Unpaid ❌'}</p>
          <p><strong>Payment Method:</strong> ${order.paymentInfo.method || 'N/A'}</p>
        </div>

         <div class="section">
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> ${order.user.name}</p>
          <p><strong>Email:</strong> ${order.user.email}</p>
        </div>

        <div class="section">
          <h2>Shipping Address</h2>
          <p>${order.shippingAddress}</p>
        </div>

        <div class="section">
          <h2>Items</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsTableRows}
            </tbody>
          </table>
        </div>

        <div class="section" style="border-bottom: none; padding-bottom: 0;">
          <table>
             <tr>
              <td colspan="4" style="text-align: right; border-bottom: none;"><strong>Total Amount:</strong></td>
              <td style="text-align: right; border-bottom: none;"><strong>₹${order.totalAmount.toFixed(2)}</strong></td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for shopping with Lush Lilac!</p>
          <p>&copy; ${new Date().getFullYear()} Lush Lilac. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = generateReceiptHTML; 