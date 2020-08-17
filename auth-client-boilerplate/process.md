1. Faire npm install
2. Ajouter les routes dans App.js afin de rendériser les composants Login, Signup et private
3. npm start pour pouvoir voir la page
4. On créé le composant AuthProvider.js dans components/lib
5. Créer les méthodes signup(), login() et logout() dans AuthProvider.js
6. Importer AuthProvider dans App.js et on englobe tout ce qu'il y a dans le return() de App.js avec <AuthProvider>
7. S'occuper de withAuth qui renvoie un composant encapsulé dans le composant <Consumer>
8. Éditer tous les composants de src/pages qui ont besoin d'utiliser les fonctions du Provider afin qu'ils soient Consumers et qu'ils y aient accès
9. On actualise components/Navbar.js pour afficher le nom du user s'il est co
10. On créé components/AnonRoute.js
11. On l'ajoute à App.js et on actualise le <Switch>
12. On créé components/PrivateRoute.js
13. On l'ajoute à App.js et on actualise le <Switch>
