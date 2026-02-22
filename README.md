# Offline POS System

A lightning-fast, fully offline Point of Sale (POS) application built with Electron, Node.js, and SQLite. Designed completely from scratch to run on standard hardware with zero internet required. 

This project aims to help small businesses, coffee shops, and independent retailers manage their checkout operations freely and securely without paying monthly cloud subscription fees.

## Features

- **🚀 100% Offline & Local:** Your database never leaves your hard drive. No internet means no downtime.
- **⚡ Performance First:** Built specifically to maintain high frame rates and instant responsiveness on basic office PCs.
- **🎨 Premium Dark UI:** An elegant, modern dark theme featuring deep contrast, glassmorphism-inspired components, and subtle micro-animations.
- **🛒 Advanced Cart Handling:** 
  - Pause and Hold active carts to ring up another customer.
  - Automatically save cart states and restore them instantly.
- **💳 Customer Tab Management:** Keep a running balance for loyal customers with built-in credit limit checks.
- **📊 Excel Import/Export:** Import thousands of products instantly via `.xlsx` or `.csv`. Export your customer balances simply.
- **📱 Hardware Scanner Ready:** Seamlessly integrates with USB or Bluetooth Barcode scanners. Unrecognized barcodes automatically pop up the "Add Product" form and pre-fill the barcode so you can catalog items while checking people out.

## Getting Started

### Prerequisites
You will need [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/offline-pos.git
   cd offline-pos
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

### Building for Production
To package the application into a `.exe` installer or standalone Windows executable, use:
```bash
npm run build
```
*Note: The packaged portable application will be placed in the `/dist` directory.*

## Contributing
Contributions are absolutely welcome! If you see something that can be improved, or want to add feature support for other hardware (like receipt printers or cash drawers), please open an issue or submit a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
