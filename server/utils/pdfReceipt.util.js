const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateReceiptPDF(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      doc.fontSize(18).text("Lush Lilac - Order Receipt", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Order ID: ${order._id}`);
      doc.text(`Customer: ${order.user.name} (${order.user.email})`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
      doc.text(`Shipping Address: ${order.shippingAddress}`);
      doc.moveDown();

      doc.text("Items:");
      order.items.forEach((item, i) => {
        doc.text(
          `${i + 1}. ${item.productId.name} - ${item.variant.size || ""} ${
            item.variant.color || ""
          } ${item.variant.material || ""}`
        );
        doc.text(`   Qty: ${item.quantity} × ₹${item.price}`);
      });

      doc.moveDown();
      doc.text(`Total: ₹${order.totalAmount}`);
      doc.text(
        `Payment Status: ${order.paymentInfo.paid ? "Paid ✅" : "Unpaid ❌"}`
      );
      doc.text(`Payment Method: ${order.paymentInfo.method || "N/A"}`);

      doc.moveDown();
      doc.text("Thank you for shopping with Lush Lilac!", { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateReceiptPDF;
