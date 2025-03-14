require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const port = 5001;

// Connexion à la base de données MySQL
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "products_db",
};

// Fonction pour récupérer la connexion
async function getDBConnection() {
  return await mysql.createConnection(dbConfig);
}

// Route pour récupérer tous les produits depuis la base de données
app.get("/api/products", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const [rows] = await connection.execute("SELECT * FROM products");
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Route pour récupérer un produit par ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const connection = await getDBConnection();
    const [rows] = await connection.execute("SELECT * FROM products WHERE id = ?", [productId]);
    await connection.end();

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Produit non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Route principale
app.get("/", (req, res) => {
  res.send("Hello from the second service with MySQL!");
});

// Route test
app.get("/api/data", (req, res) => {
  res.json({ message: "This is data from the second service" });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Second service running on port ${port}`);
});
