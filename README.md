# 🎓 Application de Gestion des Étudiants et Enseignants et de Stages (Admin Only)

<div align="center">
  <img width="900" alt="Accueil" src="https://github.com/user-attachments/assets/49af52e9-1d69-4daa-bc56-9f0ae71b5a23" />
  <br/>
  <em>Interface d’administration — Application de gestion éducative</em>
</div>

---

## 🚀 Description du projet

Cette application éducative a été développée pour **faciliter la gestion des étudiants, enseignants et stages** au sein d’un établissement d’enseignement.  
Elle est exclusivement destinée à l’administrateur et offre un **tableau de bord complet** permettant d’ajouter, modifier et gérer toutes les informations liées aux classes, étudiants et enseignants.  

L’objectif principal du projet est d’automatiser la **gestion des stages** et d’améliorer l’efficacité administrative à travers une interface moderne et fluide.

---

## 🧩 Fonctionnalités principales

### 🔐 Authentification
- Connexion sécurisée pour l’administrateur  
- Fonction **mot de passe oublié** avec réinitialisation par email  

### 🧑‍🏫 Gestion des enseignants et des niveaux
- Ajout, modification et suppression d’enseignants  
- Création et gestion des **niveaux/classes**  

### 🎓 Gestion des étudiants
- Ajout manuel ou **import automatique depuis un fichier Excel**  
- Affichage, recherche et mise à jour des informations étudiantes  

### 🧾 Gestion des stages
- Génération **automatique des stages** (initiation, perfectionnement, PFE)  
- Attribution automatique des enseignants encadrants (2 par étudiant)  
- Limite de **6 étudiants par enseignant**  
- **Exportation Excel** des affectations de stage  

### 👤 Profil administrateur
- Consultation et mise à jour des informations personnelles  
- Modification du mot de passe et de la photo de profil  

---

## 🖼️ Aperçu de l’application

### 🔑 Page de connexion
<div align="center">
  <img width="900" alt="Login Page" src="https://github.com/user-attachments/assets/58d70a1e-74d2-43b6-af2a-2026eb44c131" />
</div>

### 🔁 Page mot de passe oublié
<div align="center">
  <img width="900" alt="Forgot Password" src="https://github.com/user-attachments/assets/03854c46-1448-4596-b55b-0e951a893b1f" />
</div>

### 🏠 Page d’accueil
<div align="center">
  <img width="900" alt="Home Page" src="https://github.com/user-attachments/assets/49af52e9-1d69-4daa-bc56-9f0ae71b5a23" />
</div>

### 🧩 Page gestion des niveaux
<div align="center">
  <img width="900" alt="Gestion Niveau" src="https://github.com/user-attachments/assets/9f1c7ea5-943c-4991-a390-5d536865cc0b" />
</div>

### 🎓 Page gestion des étudiants
<div align="center">
  <img width="900" alt="Gestion Étudiants" src="https://github.com/user-attachments/assets/58ace551-5ac5-4f51-886d-fb538c8be9fe" />
</div>

### 📊 Génération automatique des stages
<div align="center">
  <img width="900" alt="Génération Stage" src="https://github.com/user-attachments/assets/d1f0841c-f71d-41a8-8b03-b0c0f55964eb" />
</div>

### 👤 Page profil administrateur
<div align="center">
  <img width="500" alt="Profil Admin 1" src="https://github.com/user-attachments/assets/1231fcee-cabf-48b9-9ed3-a4f331bacd21" />
  <img width="500" alt="Profil Admin 2" src="https://github.com/user-attachments/assets/6bec1855-28df-47ca-b2ce-1c9ae1c837dd" />
</div>

---

## ⚙️ Technologies utilisées

| Catégorie | Technologies |
|------------|--------------|
| **Frontend** | Angular 16, Bootstrap 5 |
| **Backend** | Node.js, Express.js |
| **Base de données** | MongoDB (Mongoose ORM) |
| **Authentification** | JWT (JSON Web Token) |
| **Outils & Autres** | ExcelJS, Postman, GitHub, VS Code |

---

## 📦 Installation et exécution

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/ton-compte/gestion-educative-admin.git
cd gestion-educative-admin
