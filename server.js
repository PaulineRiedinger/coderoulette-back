require("dotenv").config(); // Charge les variables d'environnement
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json()); // Permet de lire les requêtes en JSON

// 📌 Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🟢 Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur de connexion à MongoDB :", err));

// 📌 Modèle de Projet
const ProjetSchema = new mongoose.Schema({
  titre: String,
});
const Projet = mongoose.model("Projet", ProjetSchema);

// 📌 Route pour récupérer un projet aléatoire
app.get("/projet", async (req, res) => {
  try {
    const projets = await Projet.find(); // Récupère tous les projets
    if (projets.length === 0) {
      return res.status(404).json({ message: "Aucun projet trouvé" });
    }
    const index = Math.floor(Math.random() * projets.length);
    res.json({ projet: projets[index].titre });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📌 Route pour ajouter un projet
app.post("/projet", async (req, res) => {
  try {
    const nouveauProjet = new Projet({ titre: req.body.titre });
    await nouveauProjet.save();
    res.status(201).json({ message: "Projet ajouté !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📌 Lancement du serveur
app.listen(3000, () =>
  console.log("🚀 Serveur démarré sur http://localhost:3000")
);
