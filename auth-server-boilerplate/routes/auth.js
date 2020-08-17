const express = require("express");
const router = express.Router();
const createError = require("http-errors");
//Pour crypter les mdps
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user");

//HELPER FUNCTIONS - on appele notre middleware avec les vérifs
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

//POST '/signup'
router.post(
  "/signup",
  //On check si le user n'est pas déjà loggué avec la fonction helper (on check s'il existe un req.session.currentUser)
  isNotLoggedIn(),
  //On check que les valeurs username et password aient bien été rentrée grâce au helper
  validationLoggin(),
  async (req, res, next) => {
    const { username, password } = req.body;

    try {
      //On check si le username existe dans la BD
      const usernameExists = await User.findOne({ username }, "username");
      //Si c'est le cas, on passe l'erreur au middle en utilisant next()
      if (usernameExists) return next(createError(400));
      else {
        //Si ce n'est pas le cas, on hash le mdp et on créé le nouvel user
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        const newUser = await User.create({ username, password: hashPass });
        //Ensuite, on assigne le nouveau doc user à req.session.currentUser et on envoie la réponse en json
        req.session.currentUser = newUser;
        res
          .status(200) //OK
          .json(newUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

//POST '/login'
//On check que le user n'est pas loggué (check s'il existe un req.session.currentUser) et si le username et password sont bien envoyés
router.post(
  "/login",
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { username, password } = req.body;
    try {
      //Check si le user existe dans la BD
      const user = await User.findOne({ username });
      //Si c'est le cas, on passe l'erreur au middle en utilisant next()
      if (!user) {
        next(createError(404));
      }
      //Si le user existe, on fait le hash du password et on le compare avec celui de la BD
      //On log le user et retourne un json avec le user
      else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.status(200).json(user);
        return;
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  }
);

//POST '/logout'
//On check d'abord si le user est loggué
router.post("/logout", isLoggedIn(), (req, res, next) => {
  req.session.destroy();
  //définit le code d'état et renvoie la réponse
  res
    .status(204) //No content
    .send();
  return;
});

//GET '/private' --> Only for testing
router.get("/private", isLoggedIn(), (req, res, next) => {
  res.status(200).json({ message: "All good - User is logged in" });
});

//GET '/me'
router.get("/me", isLoggedIn(), (req, res, next) => {
  //Si on est logged in, empêche l'envoi du mot de passe et renvoie un json avec les données de l'utilisateur (disponible dans req.session.currentUser)
  req.session.currentUser.password = "*";
  res.json(req.session.currentUser);
});

module.exports = router;
