const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateReceiptPDF(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50 // Add some margin
      });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Helper to draw a line
      const drawLine = (y) => {
        doc
          .strokeColor('#eee') // Light grey line
          .lineWidth(1)
          .moveTo(doc.page.margins.left, y)
          .lineTo(doc.page.width - doc.page.margins.right, y)
          .stroke();
      };

      // --- Header ---
      doc
        .fontSize(22) // Slightly reduced header font size
        .fillColor('#6B4E71') // Use a color similar to your theme
        .text('LUSH LILAC', { align: 'center' })
        .moveDown(0.3); // Reduced spacing

      doc
        .fontSize(16) // Slightly reduced header font size
        .fillColor('#333')
        .text('Order Receipt', { align: 'center' })
        .moveDown(1); // Reduced spacing

      drawLine(doc.y);
      doc.moveDown(0.4); // Reduced spacing

      // --- Order Details ---
      doc
        .fontSize(13) // Slightly reduced section title font size
        .fillColor('#6B4E71')
        .text('Order Details')
        .moveDown(0.4); // Reduced spacing

      doc
        .fontSize(11) // Slightly reduced text font size
        .fillColor('#333')
        .text(`Order ID: ${order._id}`)
        .text(`Date: ${new Date(order.createdAt).toLocaleString()}`)
        .text(`Payment Status: ${order.paymentInfo.paid ? 'Paid ✅' : 'Unpaid ❌'}`)
        .text(`Payment Method: ${order.paymentInfo.method || 'N/A'}`)
        .moveDown(1.2); // Reduced spacing

      drawLine(doc.y);
      doc.moveDown(0.4); // Reduced spacing

       // --- Customer Information ---
       doc
        .fontSize(13) // Slightly reduced section title font size
        .fillColor('#6B4E71')
        .text('Customer Information')
        .moveDown(0.4); // Reduced spacing

       doc
         .fontSize(11) // Slightly reduced text font size
         .fillColor('#333')
         .text(`Name: ${order.user.name}`)
         .text(`Email: ${order.user.email}`)
         .moveDown(1.2); // Reduced spacing

      drawLine(doc.y);
      doc.moveDown(0.4); // Reduced spacing

      // --- Shipping Address ---
      doc
        .fontSize(13) // Slightly reduced section title font size
        .fillColor('#6B4E71')
        .text('Shipping Address')
        .moveDown(0.4); // Reduced spacing

      doc
        .fontSize(11) // Slightly reduced text font size
        .fillColor('#333')
        .text(order.shippingAddress)
        .moveDown(1.2); // Reduced spacing

      drawLine(doc.y);
      doc.moveDown(0.4); // Reduced spacing

      // --- Items Table ---
      doc
        .fontSize(13) // Slightly reduced section title font size
        .fillColor('#6B4E71')
        .text('Items')
        .moveDown(0.4); // Reduced spacing

      const itemTableY = doc.y;
      const colPadding = 4; // Slightly reduced column padding

      // Column Widths (adjust as needed)
      const productColWidth = 180;
      const variantColWidth = 110;
      const qtyColWidth = 40; // Slightly reduced qty column width
      const priceColWidth = 60; // Slightly reduced price column width
      const subtotalColWidth = 70; // Slightly reduced subtotal column width
      const totalTableWidth = productColWidth + variantColWidth + qtyColWidth + priceColWidth + subtotalColWidth + colPadding * 4; // Sum of widths + padding between columns
      const startX = doc.page.width / 2 - totalTableWidth / 2; // Center the table


      // Draw Table Headers
      const headerY = itemTableY + 5;
      doc.font('Helvetica-Bold')
         .fontSize(9) // Slightly reduced header font size
         .fillColor('#333');

      let currentX = startX;
      doc.text('Product', currentX, headerY, { width: productColWidth, continued: true });
      currentX += productColWidth + colPadding;
      doc.text('Variant', currentX, headerY, { width: variantColWidth, continued: true });
      currentX += variantColWidth + colPadding;
      doc.text('Qty', currentX, headerY, { width: qtyColWidth, align: 'center', continued: true });
      currentX += qtyColWidth + colPadding;
      doc.text('Price', currentX, headerY, { width: priceColWidth, align: 'right', continued: true });
      currentX += priceColWidth + colPadding;
      doc.text('Subtotal', currentX, headerY, { width: subtotalColWidth, align: 'right' });

      // Draw header bottom border
      drawLine(headerY + 15);
      doc.moveDown(0.4); // Reduced spacing

      // Draw Table Rows
      doc.font('Helvetica').fontSize(8); // Further reduced item font size
      let rowY = doc.y;

      order.items.forEach((item) => {
        currentX = startX;
        const itemSubtotal = (item.price * item.quantity).toFixed(2);
        const variantText = `${item.variant.size || ''} ${item.variant.color || ''} ${item.variant.material || ''}`.trim();

        doc.text(item.productId.title, currentX, rowY, { width: productColWidth, continued: true });
        currentX += productColWidth + colPadding;
        doc.text(variantText, currentX, rowY, { width: variantColWidth, continued: true });
        currentX += variantColWidth + colPadding;
        doc.text(item.quantity.toString(), currentX, rowY, { width: qtyColWidth, align: 'center', continued: true });
        currentX += qtyColWidth + colPadding;
        doc.text(`₹${item.price.toFixed(2)}`, currentX, rowY, { width: priceColWidth, align: 'right', continued: true });
        currentX += priceColWidth + colPadding;
        doc.text(`₹${itemSubtotal}`, currentX, rowY, { width: subtotalColWidth, align: 'right' });

        // Move to the next line, accounting for potentially wrapped text
        rowY = doc.y + 8; // Reduced space between rows
         doc.moveDown(0.3); // Reduced spacing between rows
      });

      // Draw bottom border of the last row (or total section)
      drawLine(rowY);
      doc.moveDown(1); // Reduced spacing

      // --- Total Amount ---
      const totalLabelWidth = 90; // Adjusted label width
      const totalValueWidth = 70; // Adjusted value width
      const totalLabelX = doc.page.width - doc.page.margins.right - totalValueWidth - colPadding - totalLabelWidth;
      const totalValueX = doc.page.width - doc.page.margins.right - totalValueWidth;

       doc
        .fontSize(13) // Slightly reduced total font size
        .font('Helvetica-Bold')
        .fillColor('#333')
        .text('Total Amount:', totalLabelX, doc.y, { width: totalLabelWidth, align: 'right', continued: true });
       doc
         .text(`₹${order.totalAmount.toFixed(2)}`, totalValueX, doc.y, { width: totalValueWidth, align: 'right' });

      doc.moveDown(1.5); // Reduced spacing

      drawLine(doc.y);
      doc.moveDown(0.4); // Reduced spacing

      // --- Footer ---
      doc
        .fontSize(9) // Slightly reduced footer font size
        .fillColor('#777')
        .text('Thank you for shopping with Lush Lilac!', { align: 'center' })
        .moveDown(0.3); // Reduced spacing

      doc
        .fontSize(8) // Further reduced copyright font size
        .text(`© ${new Date().getFullYear()} Lush Lilac. All rights reserved.`, { align: 'center' });


      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateReceiptPDF;
