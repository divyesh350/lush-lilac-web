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
      const drawLine = (y, color = '#eee', width = 1) => {
        doc
          .strokeColor(color)
          .lineWidth(width)
          .moveTo(doc.page.margins.left, y)
          .lineTo(doc.page.width - doc.page.margins.right, y)
          .stroke();
      };

      // --- Header ---
      doc
        .fontSize(22) 
        .fillColor('#6B4E71') 
        .text('LUSH LILAC', { align: 'center' })
        .moveDown(0.3); 

      doc
        .fontSize(16) 
        .fillColor('#333')
        .text('Order Receipt', { align: 'center' })
        .moveDown(1); 

      drawLine(doc.y);
      doc.moveDown(0.4); 

      // --- Order Details ---
      doc
        .fontSize(13) 
        .fillColor('#6B4E71')
        .text('Order Details')
        .moveDown(0.4); 

      doc
        .fontSize(11) 
        .fillColor('#333')
        .text(`Order ID: ${order._id}`)
        .text(`Date: ${new Date(order.createdAt).toLocaleString()}`)
        .text(`Payment Status: ${order.paymentInfo.paid ? 'Paid ✅' : 'Unpaid'}`)
        .text(`Payment Method: ${order.paymentInfo.method || 'N/A'}`)
        .moveDown(1.2); 

      drawLine(doc.y);
      doc.moveDown(0.4); 

       // --- Customer Information ---
       doc
        .fontSize(13) 
        .fillColor('#6B4E71')
        .text('Customer Information')
        .moveDown(0.4); 

       doc
         .fontSize(11) 
         .fillColor('#333')
         .text(`Name: ${order.user.name}`)
         .text(`Email: ${order.user.email}`)
         .moveDown(1.2); 

      drawLine(doc.y);
      doc.moveDown(0.4); 

      // --- Shipping Address ---
      doc
        .fontSize(13) 
        .fillColor('#6B4E71')
        .text('Shipping Address')
        .moveDown(0.4); 

      doc
        .fontSize(11) 
        .fillColor('#333')
        .text(order.shippingAddress)
        .moveDown(1.2); 

      drawLine(doc.y);
      doc.moveDown(0.4); 

      // --- Items Table ---
      doc
        .fontSize(13) 
        .fillColor('#6B4E71')
        .text('Items')
        .moveDown(0.4); 

      const itemTableY = doc.y;
      const colPadding = 4; 

      // Column Widths (adjust as needed)
      const productColWidth = 180;
      const variantColWidth = 110;
      const qtyColWidth = 40; 
      const priceColWidth = 60; 
      const subtotalColWidth = 70;
      const totalTableWidth = productColWidth + variantColWidth + qtyColWidth + priceColWidth + subtotalColWidth + colPadding * 4; 
      const startX = doc.page.width / 2 - totalTableWidth / 2; // Center the table

      // Draw Table Header Row
      const headerY = itemTableY + 5;
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#333');

      let currentX = startX;
      doc.text('Product', currentX, headerY, { width: productColWidth });
      currentX += productColWidth + colPadding;
      doc.text('Variant', currentX, headerY, { width: variantColWidth });
      currentX += variantColWidth + colPadding;
      doc.text('Qty', currentX, headerY, { width: qtyColWidth, align: 'center' });
      currentX += qtyColWidth + colPadding;
      doc.text('Price', currentX, headerY, { width: priceColWidth, align: 'right' });
      currentX += priceColWidth + colPadding;
      doc.text('Subtotal', currentX, headerY, { width: subtotalColWidth, align: 'right' });

      // Draw header bottom border
      const headerBottomY = headerY + 15;
      drawLine(headerBottomY);
      doc.moveDown(0.4);

      // Draw Table Rows with Borders
      doc.font('Helvetica').fontSize(8);
      let rowY = doc.y;

      order.items.forEach((item) => {
        currentX = startX;
        const itemSubtotal = (item.price * item.quantity).toFixed(2);
        const variantText = `${item.variant.size || ''} ${item.variant.color || ''} ${item.variant.material || ''}`.trim();

        // Get the initial Y before drawing the row content
        const startRowY = rowY;

        // Draw content for each cell
        doc.text(item.productId.title, currentX, rowY, { width: productColWidth, continued: true });
        currentX += productColWidth + colPadding;
        doc.text(variantText, currentX, rowY, { width: variantColWidth, continued: true });
        currentX += variantColWidth + colPadding;
        // Need to calculate the exact Y after text wrapping for the tallest cell in the row
        // For simplicity, let's just move Y after writing text, assuming reasonable text length
        let currentCellY = doc.y; // Capture Y after writing the previous cell
        doc.text(item.quantity.toString(), currentX, rowY, { width: qtyColWidth, align: 'center', continued: true });
         currentCellY = Math.max(currentCellY, doc.y); // Update Y if this cell is taller
        currentX += qtyColWidth + colPadding;
        doc.text(`Rs.${item.price.toFixed(2)}`, currentX, rowY, { width: priceColWidth, align: 'right', continued: true });
         currentCellY = Math.max(currentCellY, doc.y); // Update Y
        currentX += priceColWidth + colPadding;
        doc.text(`Rs.${itemSubtotal}`, currentX, rowY, { width: subtotalColWidth, align: 'right' });
         currentCellY = Math.max(currentCellY, doc.y); // Update Y

        // Determine the maximum height of the current row based on the tallest cell
        const maxRowHeight = currentCellY - startRowY;

        // Draw cell borders (simple vertical lines between columns)
        // This is a simplified approach. Full table borders would involve more complex line drawing.
        // Let's focus on bottom border for now to define rows.

        // Instead of complex cell borders, let's just draw a bottom line for the row at the maxRowHeight + some padding
        const rowBottomY = startRowY + maxRowHeight + 5; // 5 is padding below text
        drawLine(rowBottomY);

        // Move to the next row's starting Y position
        rowY = rowBottomY + 5; // 5 is padding between rows
         doc.moveDown(0.3); // Reduced spacing
      });

      // Draw line after the last row
      // This is already handled by the loop drawing rowBottomY

      doc.moveDown(1); 

      // --- Total Amount ---
      const totalLabelWidth = 90; 
      const totalValueWidth = 70; 
      // Position the total amount block on the right side
      const totalBlockStartX = doc.page.width - doc.page.margins.right - totalLabelWidth - colPadding - totalValueWidth;

       doc
        .fontSize(13) 
        .font('Helvetica-Bold')
        .fillColor('#333');

       // Draw Total Amount label and value on the same line
       doc.text('Total Amount:', totalBlockStartX, doc.y, { width: totalLabelWidth, align: 'right', continued: true });
       doc.text(`Rs.${order.totalAmount.toFixed(2)}`, totalBlockStartX + totalLabelWidth + colPadding, doc.y, { width: totalValueWidth, align: 'right' });

      doc.moveDown(1.5); 

      // Push content to the bottom if possible
      const remainingHeight = doc.page.height - doc.y - doc.page.margins.bottom - 40; // Estimate space needed for footer
      if (remainingHeight > 0) {
          doc.moveDown(remainingHeight / doc.currentLineHeight() ); // Move down by remaining lines
      }

      // --- Footer ---
      doc
        .fontSize(9) 
        .fillColor('#777')
        .text('Thank you for shopping with Lush Lilac!', { align: 'center' })
        .moveDown(0.3); 

      doc
        .fontSize(8) 
        .text(`© ${new Date().getFullYear()} Lush Lilac. All rights reserved.`, { align: 'center' });


      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateReceiptPDF;
