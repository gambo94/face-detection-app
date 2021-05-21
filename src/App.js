import React, { Component } from 'react';
import './App.css';
import Signin  from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';




// clarifai app with api key to be used down below
const app = new Clarifai.App({
    apiKey: "9816cf162a374d0f9eba5397544c85af",
  });
    

// options for particles.js
const options = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      },
      resize: true
    }
  }
}


class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        signup_date: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: { 
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      signup_date: data.signup_date
    }})
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // getting pic info in order to calculate below
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width, // since we receive the percentage from data face, mult by our width 
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
    Clarifai.FACE_DETECT_MODEL,
    // THE JPG
    this.state.input)
      .then(response => {
        if(response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id,
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }))
        })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
 })
  .catch(err => console.log(err))    
}


  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles"
                  params={options} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
            ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl = {imageUrl}/>
              </div>
            : (
                route === 'signin' 
                  ?  <Signin loadUser={this.loadUser} onRouteChange = {this.onRouteChange} />
                  :  <Register loadUser={this.loadUser} onRouteChange ={this.onRouteChange} />
              )

      }
      </div>
    );
  }
}

export default App;
