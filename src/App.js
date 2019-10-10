import React, { Component } from "react";
import "./App.css";
import axios from "axios";
// import { Link } from "react-router-dom";
// import { Navbar } from "react-bootstrap";

class App extends Component {
  constructor() {
    super();
    this.state = {
      url: '',
      menuId: ''
    };
  }

  componentDidMount() {
    axios.get(
      'https://2vdqlmfjbk.execute-api.us-west-2.amazonaws.com/dev/menuimage/chipotle',
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        this.setState({ url: response.data['menuImage'] });
        return response;
      })
      .then(this.drawMenu())
      .catch(error => {
        console.log(error.response);
      });

  }

  drawMenu() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    const img = this.refs.image;
    img.onload = () => {
      axios.get(
        'https://2vdqlmfjbk.execute-api.us-west-2.amazonaws.com/dev/menujson/chipotle',
        {
          headers:
            { 'Content-Type': 'application/json' }
        })
        .then(response => {
          const boxBounds = response.data['scaledBoxBound'];
          canvas.height = img.naturalHeight;
          canvas.width = img.naturalWidth;
          ctx.drawImage(img, 0, 0);
          this.drawLines(ctx, boxBounds)
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }

  drawLines(ctx, boxBounds) {
    for (let i in boxBounds) {
      let x0 = boxBounds[i]['x0'];
      let y0 = boxBounds[i]['y0'];
      let x1 = boxBounds[i]['x1'];
      let y1 = boxBounds[i]['y1'];
      let x2 = boxBounds[i]['x2'];
      let y2 = boxBounds[i]['y2'];
      let x3 = boxBounds[i]['x3'];
      let y3 = boxBounds[i]['y3'];
      ctx.strokeStyle = "#FF0000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x3, y3);
      ctx.stroke();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.stroke();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  // handleChange(event) {
  //   this.setState({ menuId: event.target.value })
  // }

  render() {
    return (
      <div className='container'>
        {/* <input type="text" onChange={this.handleChange} /> */}
        <canvas ref="canvas" width={500} height={500} />
        <img ref="image" className='hidden' src={this.state.url}></img>
      </div>
    )
  }
}

export default App;