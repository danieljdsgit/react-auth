import React, { Component } from "react";
import { withAuth } from "../lib/AuthProvider";

class Private extends Component {
  render() {
    return (
      <div>
        <h1>Welcome {this.props.user.username}</h1>
      </div>
    );
  }
}

//On lui 'donne' Login, signup, user, logout, isLoogedin qui font parti de withAuth dans AuthProvider.js
export default withAuth(Private);
