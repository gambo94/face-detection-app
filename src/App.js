import React, { Component } from 'react';
import './App.css';
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
      imageUrl: ''
    }
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    console.log("click");
    app.models
      .predict(
    Clarifai.FACE_DETECT_MODEL,
    // THE JPG
    "https://i.insider.com/5d321d4ea209d3146d650b4a?width=1100&format=jpeg&auto=webp"
  )
    .then((response) => {
      console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    })
    .catch((err) => {
      console.log(err);
    });
 };    

  render() {
    return (
      <div className="App">
        <Particles className="particles"
                  params={options} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl = {this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
