import React, { Component } from "react";
// Nous importons des fonctions pour les appels axios à l'API
import auth from "./auth-service";
//Le Contexte offre un moyen de faire passer des données à travers l’arborescence du composant sans avoir à passer manuellement les props à chaque niveau.
const { Consumer, Provider } = React.createContext();

//HOC pour créer Consumer
//WithAuth renvoie un composant encapsulé dans le composant <Consumer>
const withAuth = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <Consumer>
          {/* Le composant <Consumer> fournit un callback qui reçoit la "valeur" avec l'objet Providers */}
          {({ login, signup, user, logout, isLoggedin }) => {
            return (
              <WrappedComponent
                login={login}
                signup={signup}
                user={user}
                logout={logout}
                isLoggedin={isLoggedin}
                //En plus des props qui existent déjà (via le ...this.props) on en créé d'autres (ci-dessus)
                {...this.props}
              />
            );
          }}
        </Consumer>
      );
    }
  };
};

//Provider
class AuthProvider extends React.Component {
  state = { isLoggedin: false, user: null, isLoading: true };

  componentDidMount() {
    auth
      .me()
      .then((user) =>
        this.setState({ isLoggedin: true, user: user, isLoading: false })
      )
      .catch((err) =>
        this.setState({ isLoggedin: false, user: null, isLoading: false })
      );
  }

  signup = (user) => {
    const { username, password } = user;

    auth
      .signup({ username, password })
      .then((user) => this.setState({ isLoggedin: true, user }));
  };

  login = (user) => {
    const { username, password } = user;

    auth
      .login({ username, password })
      .then((user) => this.setState({ isLoggedin: true, user }))
      .catch((err) => console.log(err));
  };

  logout = () => {
    auth
      .logout()
      .then(() => this.setState({ isLoggedin: false, user: null }))
      .catch((err) => console.log(err));
  };

  render() {
    const { isLoading, isLoggedin, user } = this.state;
    const { login, logout, signup } = this;

    return isLoading ? (
      <div>Loading</div>
    ) : (
      //values = Toutes les valeurs qui seront dispos pour les composants enfants de <Provider> qu'on peut voir dans App.js
      <Provider value={{ isLoggedin, user, login, logout, signup }}>
        {this.props.children}
      </Provider>
    );
  }
}

export { Consumer, withAuth };
export default AuthProvider;
