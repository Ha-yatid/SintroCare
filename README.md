# **_SintromCare_**  

## **_Contexte du Projet_**  
**SintromCare** est une application web développée pour gérer le traitement des patients sous anticoagulants comme le Sintrom. Elle offre une plateforme centralisée pour suivre les dosages, surveiller les analyses INR, et faciliter la communication entre les patients et leurs médecins.  
L'objectif est d'améliorer la précision du traitement et la gestion quotidienne des patients atteints de troubles cardiovasculaires.  

## **_Technologies Utilisées_**  
### **_Frontend_**  
- _**React.js**_ : Interface utilisateur interactive et dynamique.  
- _**Axios**_ : Gestion des requêtes HTTP.  
- _**React Router**_ : Navigation entre les pages.
- _**Formik & Yup**_ : Gestion avancée des formulaires et validation des données côté client.
-  _**Context API**_ : Gestion de l'état global pour une navigation fluide.

### **_Backend_**  
- _**Node.js**_ : Gestion des opérations serveur.  
- _**Express.js**_ : API RESTful.  
- _**JWT (jsonwebtoken)**_ : Authentification sécurisée.  
- _**bcrypt**_ : Cryptage des mots de passe.
  
### **_Base de Données_**  
- _**MongoDB**_ : Stockage des informations utilisateurs et données médicales via Mongoose.

### **_Tests_**  
- _**Mocha & Chai**_  : Frameworks pour les tests unitaires et d'intégration.
-  _**Postman**_ : Tests manuels des API pour garantir la fiabilité.  

### **_Conteneurisation_** 
   _**Docker**_ :
     -  _**Dockerfile**_ :Conteneurisation de l’application backend.
     -   _**Docker Compose**_ :Orchestration des conteneurs backend, frontend et base de données.


## **_Fonctionnalités Principales_**  
- _Gestion des comptes (patients et médecins)._  
- _Suivi des dosages journaliers et analyses INR._  
- _Association facultative entre patients et médecins._  
- _Authentification et autorisation sécurisées._  

---






![Diagramme classe Sntrm App](https://github.com/user-attachments/assets/ede8acec-0aca-4517-a100-34f07b2dbd5a)
![diag Use case](https://lucid.app/publicSegments/view/b07bb5fa-5b4e-466c-85f4-84a5bc33e1ea/image.png)
![diag gant](diagGant.png)


