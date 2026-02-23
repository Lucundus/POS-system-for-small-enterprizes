const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');
const fs = require('fs');
class Database {
    constructor() {
        let dbPath;
        if (app.isPackaged) {
            const userDataPath = app.getPath('userData');
            if (!fs.existsSync(userDataPath)) {
                fs.mkdirSync(userDataPath, { recursive: true });
            }
            dbPath = path.join(userDataPath, 'pos.db');
        } else {
            dbPath = path.join(__dirname, 'pos.db');
        }
        console.log("Database Path:", dbPath);
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Database connection error:', err.message);
            } else {
                console.log('Connected to SQLite database.');
                this.init(); 
            }
        });
    }
    init() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                const db = this.db;
                db.run(`
                    CREATE TABLE IF NOT EXISTS Customers (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        Name TEXT NOT NULL,
                        Balance DECIMAL(10,2) DEFAULT 0,
                        CreditLimit DECIMAL(10,2) DEFAULT -3000
                    )
                `);
                db.run(`
                    CREATE TABLE IF NOT EXISTS Products (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        Barcode TEXT UNIQUE NOT NULL,
                        Name TEXT NOT NULL,
                        Price REAL NOT NULL,
                        Category TEXT DEFAULT 'General'
                    )
                `);
                db.run(`
                    CREATE TABLE IF NOT EXISTS Transactions (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        Date DATETIME DEFAULT CURRENT_TIMESTAMP,
                        CustomerId INTEGER,
                        Type TEXT, -- e.g., 'SALE', 'PAYMENT'
                        TotalAmount REAL NOT NULL,
                        FOREIGN KEY(CustomerId) REFERENCES Customers(Id)
                    )
                `);
                db.run(`
                    CREATE TABLE IF NOT EXISTS TransactionItems (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        TransactionId INTEGER NOT NULL,
                        ProductId INTEGER NOT NULL,
                        Quantity INTEGER NOT NULL,
                        UnitPrice REAL NOT NULL,
                        FOREIGN KEY(TransactionId) REFERENCES Transactions(Id),
                        FOREIGN KEY(ProductId) REFERENCES Products(Id)
                    )
                `, (err) => {
                    if (err) {
                        console.error('Error creating database tables', err);
                        reject(err);
                    } else {
                        db.all("PRAGMA table_info(Products)", (pragmaErr, rows) => {
                            if (!pragmaErr && rows) {
                                const hasCategory = rows.some(r => r.name === 'Category');
                                if (!hasCategory) {
                                    db.run("ALTER TABLE Products ADD COLUMN Category TEXT DEFAULT 'General'", (alterErr) => {
                                        if (alterErr) console.error("Error migrating Products table:", alterErr);
                                        else console.log("Added Category column to Products table.");
                                        resolve();
                                    });
                                } else {
                                    resolve();
                                }
                            } else {
                                console.error("Error checking Products table info:", pragmaErr);
                                resolve(); 
                            }
                        });
                    }
                });
            });
        });
    }
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}
module.exports = new Database();
