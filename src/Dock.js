import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import throttle from 'lodash/throttle';

class Dock extends Component {

  constructor(props) {
    super(props);
    this.dock = React.createRef();

    this.state = {
      mouseX: 0
    }

    this.handleMouseMove = throttle(this.handleMouseMove, 50);
    this.handleTouchMove = throttle(this.handleTouchMove, 50);
  }

  componentDidMount() {
    this.dock.current.addEventListener('mousemove', this.handleMouseMove);
    this.dock.current.addEventListener('touchmove', this.handleTouchMove);
  }

  handleMouseMove = ({pageX: x, pageY: y}) => {
    const xPos = ((this.dock.current.getBoundingClientRect().x) - x) * (this.dock.current.offsetWidth / 210) + 350;
    this.setState({ mouseX: xPos});
  }

  handleTouchMove({touches}) {
    this.handleMouseMove(touches[0]);
  }

  render() {
    const config = { stiffness: 70, damping: 4 };
    const toCSS = (translateX) => ({ transform: `translateX(${translateX}px)` })


    return (
      <div className="dock">
        <div className="dock__window" ref={this.dock}>
          <div className="dock__surface" />
          <Motion defaultValue={{ translateX: 0 }}
                  style={{ translateX: spring(this.state.mouseX, config) }}>
                  { (value) => <div className="dock__visual" style={toCSS(value.translateX)} />  }
          </Motion>
          <span className="dock__icon dock__icon--car" />
          <span className="dock__icon dock__icon--robot" />
          <span className="dock__icon dock__icon--lightbulb" />
          <span className="dock__icon dock__icon--diver" />
          <span className="dock__icon dock__icon--phone" />
          <span className="dock__icon dock__icon--nun" />
        </div>
      </div>
    );
  }
}

export default Dock;
