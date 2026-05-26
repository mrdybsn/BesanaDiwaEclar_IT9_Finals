export function printReceiptElement(el: HTMLElement): void {
    const printWindow = window.open("", "_blank", "width=360,height=720");
    if (!printWindow) return;
    printWindow.document.write(`
        <html><head><title>Receipt</title>
        <style>
          body { margin: 0; padding: 8px; background: #fff; }
          .thermal-receipt { font-family: "Courier New", Courier, monospace; font-size: 12px; width: 280px; margin: 0 auto; color: #111; }
          .shop-name { text-align: center; font-weight: 700; font-size: 15px; margin: 0 0 4px; }
          .shop-line, .divider, .receipt-title, .thank-you { text-align: center; margin: 4px 0; }
          .items-header { display: flex; justify-content: space-between; font-weight: 700; border-bottom: 1px dashed #999; margin: 8px 0 4px; }
          .item-row, .total-row, .meta-line { margin: 3px 0; white-space: pre; font-size: 11px; }
          .total-row { font-weight: 700; font-size: 14px; }
          .thank-you { font-weight: 700; letter-spacing: 2px; margin: 10px 0; }
          .barcode { display: flex; justify-content: center; gap: 1px; height: 36px; margin-top: 8px; }
          .barcode-bar { display: inline-block; height: 100%; background: #111; }
        </style></head>
        <body>${el.outerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}
