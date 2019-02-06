import { gql } from "apollo-boost";
import Link from "next/link";
import React, { Component } from "react";
import { Mutation } from "react-apollo";

const registerMutation = gql`
  mutation($username: String!, $password: String!) {
    register(username: $username, password: $password)
  }
`;

class App extends Component {
  state = {
    username: "",
    password: ""
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { username, password } = this.state;
    return (
      <Mutation mutation={registerMutation}>
        {mutate => (
          <div className="App">
            <div>
              <input
                placeholder="username"
                type="text"
                name="username"
                value={username}
                onChange={this.onChange}
              />
            </div>
            <div>
              <input
                placeholder="password"
                type="password"
                name="password"
                value={password}
                onChange={this.onChange}
              />
            </div>
            <button
              onClick={() => mutate({ variables: { username, password } })}
            >
              submit
            </button>
            <div>
              <Link href="/auth-hello">
                <a>to auth page</a>
              </Link>
              <br />
              <a href={`${process.env.SERVER_URL}/auth/github`}>
                login with github
              </a>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default App;
