import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

const hitRegion = 220;

class Icon extends Component {

  constructor(props) {
    super(props);
    this.icon = React.createRef();

    this.state = {
      mouseX: 0,
      mouseY: 0,
      iconX: 0,
      iconY: 0,
      iconScale: 0.5
    }

    this.getIconPosition = this.getIconPosition.bind(this);
    this.handleMouseMove = throttle(this.handleMouseMove, 50);
    this.handleTouchMove = throttle(this.handleTouchMove, 50);
    this.measureAfterResize = debounce(this.measureAfterResize, 500);
  }

  componentDidMount() {
    this.getIconPosition();

    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('resize', this.measureAfterResize);
  }

  getIconPosition() {
    const iconX = Math.round((this.icon.current.getBoundingClientRect().left) + (this.icon.current.offsetWidth / 4));
    const iconY = Math.round((this.icon.current.getBoundingClientRect().top) + (this.icon.current.offsetHeight / 4));
    this.setState({ iconX: iconX, iconY: iconY });
  }

  measureAfterResize = () => {
    this.getIconPosition();
  }

  handleMouseMove = ({pageX: x, pageY: y}) => {
    const dx = this.state.iconX - x;
		const dy = this.state.iconY - y;
		const dist = Math.sqrt(dx*dx + dy*dy);
    let size =- dist;

    size = (size + 400) / 530;

    if (dist < hitRegion && size > 0.5) {
      this.setState({ iconScale: size })
		}
		else {
      this.setState({ iconScale: 0.5 })
		}
  }

  handleTouchMove({touches}) {
    this.handleMouseMove(touches[0]);
  }

  render() {
    const {
      icon
    } = this.props;

    return (
      <div
        className={`dock__icon dock__icon--${icon}`}
        ref={this.icon}
        style={{ transform: `scale(${this.state.iconScale})` }}
      />
    );
  }
}

export default Icon;
