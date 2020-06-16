import React from "react";
import loginImg from "../../login.svg";
import axios from "axios";
import history from"./history";

export class Login extends React.Component {

  

  state = { 
    email: '',
    password: '',
  };



  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ 
      email: '' ,
      password: '' 
    });
   
    // axios.post('http://localhost:5000/login', this.state)
    fetch('http://localhost:5000/login', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        history.push('/profile')
        // this.context.history.push('/AI-Economics')
        console.log("Hey")
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })

  };

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} />
          </div>
          <div className="form">
          <form method='POST' action='/Login' onSubmit={this.handleSubmit} >
                <div className="forms"> 
              <label htmlFor="e-mail">E-Mail</label>
              <input 
               type="text"
               name="email"
               value={this.state.email}
               placeholder="E-Mail"
               onChange={event => this.setState({ email: event.target.value })}
              />
            </div> 
                <br/>  
                <div className="forms">
              <label htmlFor="password">Password</label>
              <input 
               type="password"
               name="password"
               value={this.state.password}
               placeholder="password"
               onChange={event => this.setState({ password: event.target.value })}
              />
            </div> 
                <div className="footer">
                  <button className="btn" onClick={()=> this.handleSubmit}>
                    Login
                  </button>
                </div>
      </form>
           
        </div>
        
      </div>
      </div>
    );
  }
}
