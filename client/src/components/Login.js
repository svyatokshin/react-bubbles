import React from "react";
import Axios from "axios";
import styled from 'styled-components';

const Button = styled.button`
    width: 30%;
    border: 2 px silver;
    margin: 0 auto;
    background: lightgrey;
`

const Form = styled.form`
    display:flex;
    margin:250px auto;
    justify-content:space-evenly;
    flex-direction: column;
    width: 20%;
    height: 4%;
`

const Input = styled.input`
    margin: 10px auto;
    border-radius:5px;
`

class Login extends React.Component {
  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route
  state = { 
    credentials: {
      username: '',
      password: ''
    }
  };

  handleChanges = e => {
    this.setState({
      credentials: {
        ...this.state.credentials,
        [e.target.name]: e.target.value
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    Axios
    .post('http://localhost:5000/api/login', this.state.credentials)
    .then(res => {
      localStorage.setItem('token', res.data.payload);
      this.props.history.push('/bubbles')
    })
    .catch(err => console.log(err))
  }
  
  render() {
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <h1>Welcome to the Bubble App!</h1>
          <Input 
          type='text'
          name='username'
          placeholder='username'
          value={this.state.credentials.username}
          onChange={this.handleChanges}
          />
          <Input 
          type='password'
          name='password'
          placeholder='password'
          value={this.state.credentials.password}
          onChange={this.handleChanges}
          />
          <Button>Log In</Button>
        </Form>
      </>
    );
  }
  
};

export default Login;
