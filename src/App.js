import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();

  const [user, setUser] = useState({
    isSignedIn : false,
    name : '',
    email : '',
    photo : '',
    isValid : false
  })

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider).then(res=> {
      const {displayName, email, photoURL} = res.user;
      const signedInUser = {
        isSignedIn : true,
        name : displayName,
        email : email,
        photo : photoURL,
        isValid : true
      }

      setUser(signedInUser);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn : false,
        name : "",
        email : "",
        photo : "",
        isValid : false
      }

      setUser(signedOutUser);
    })
    .catch (err => console.log(err))
  }

  const isValidEmail = email => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  const isValidPassword = password => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password);

  const handleChange = e => {
    const newUserInfo = {
      ...user
    };

    let validEmail, validPassword;

    if(e.target.name ==="email") {
      validEmail = isValidEmail(e.target.value);
      console.log(validEmail);
    }

    if(e.target.name ==="password") {
      validPassword = isValidPassword(e.target.value);
      console.log(validPassword);
    }

    if(validEmail && validPassword) {
      newUserInfo[e.target.name] = e.target.value;
      newUserInfo.isValid = true;
    }

    setUser(newUserInfo);
  }

  const createAccount = e => {
    e.preventDefault();
    if(user.isValid) {
      console.log(user.email, user.password);
    }
    else {
      console.log("Invalid email or password");
    }
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <h3>Welcome {user.displayName}</h3>
          <h6>Your email address is {user.email}</h6>
          <img src={user.photo} alt=""></img>
        </div>
      }

      <h1>Create Account</h1>
      <form onSubmit={createAccount}>
        <input onBlur={handleChange} type="text" name="email" placeholder="Enter your email address" required/><br/>
        <input onBlur={handleChange} type="password" name="password" placeholder="Enter your password" required/><br/>
        <input type="submit" value="Create Account"/>
      </form>
    </div>
  );
}

export default App;
