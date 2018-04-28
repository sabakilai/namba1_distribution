import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

const firebase = window.firebase;

class Navigation extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			authUser:null
		};
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged(authUser => {
			if (authUser) {
				this.setState(() => ({ authUser }))
			} 
		});
	}

  logout(event) {
    event.preventDefault();
    firebase.auth().signOut().then(function() {
        console.log('Sign-out successful');
    }).catch(function(error) {
        console.log(error);
    });
  }


  render() {
    let userMenu  
    if (this.state.authUser) {
      userMenu = (
        <Nav pullRight>
          <NavItem eventKey={1} href="/" onClick={this.logout.bind(this)}>Logout</NavItem>
        </Nav>
      )
    }
    return (
      <div>
        <Navbar className="nav_bar">
          <Navbar.Header className="nav_logo">
            <Navbar.Brand>
              <Link to="/">Support</Link>
            </Navbar.Brand>
          </Navbar.Header>
          {userMenu}
        </Navbar>

      </div>
    )
  }
}

export default Navigation;