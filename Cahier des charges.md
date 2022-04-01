# Cahier des charges

#### Énoncé :

- Jouer à 2 en application mobile
- Supervision par web responsive

---

#### Contrainte technique :

- Android / IOS
- NodeJS + React-Native
- MongoDB / ORM

---

#### Méthode :

- Test -> jtest, CURL
- Découpage en couche :
    - Présentation : React-Native + flex
    - Services : REST -> Architecture MS (micro-service)
    - Data-access : WS (Web-Service) REST
    - Protocole : https + json

---

Application de type SP (singe Page), WS, Micro-Service, mobile -> héberger : playstore

---

#### Interface :

- LaunchPage (animation, son)
- Menu Création partie/Rejoindre partie
- Page Création partie
- Page Rejoindre partie
- Grilles (16 x 16), séparer en deux grille
- Échange -> son, couleur
- Page Gagné/Perdu
- Page statistiques

---

#### Protocole :

1 - Bouton démarrer

2 - Le WS enregistre que le joueur est disponible

Trouver un joueur -> Créer la flotte -> Jouer

---

#### Grille :

- grille 16 x 16
- bouton dispo/arret
- bouton tir
- rappel navire

---

#### GUI :

- timer (récup infos)
- splash screen
- son
- animation

1 - Structure de la première page

2 - Splash screen + animation (Image)

3 - Enchaînement entre page (link)

splash screen -> pseudo stocker localement -> si absent fenêtre de demande + validation + confirmation

Livrer une version fonctionnel du projet à la fin du mois
