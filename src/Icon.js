import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import classnames from 'classnames';

// declare variables globally so that we can access them everywhere within our component
let iconWidth = 0;
let hitRegion = 0;
let scaleFactor = 0;

class Icon extends Component {

  constructor(props) {
    super(props);
    this.icon = React.createRef();

    this.state = {
      mouseX: 0,
      mouseY: 0,
      iconX: 0,
      iconY: 0,
      iconScale: 1
    }

    this.getIconPosition = this.getIconPosition.bind(this);
    this.handleMouseMove = throttle(this.handleMouseMove, 50);
    this.handleTouchMove = throttle(this.handleTouchMove, 50);
    this.measureAfterResize = debounce(this.measureAfterResize, 500);
  }

  componentDidMount() {
    // get the correct values for our global variables
    iconWidth = this.icon.current.offsetWidth;
    hitRegion = this.props.hitRegion;
    scaleFactor = this.props.scaleFactor;

    this.getIconPosition();
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('resize', this.measureAfterResize);
  }

  getIconPosition() {
    // get the value of iconX and iconY. This is the exact center of the dom element
    const iconX = Math.round((this.icon.current.getBoundingClientRect().left) + (this.icon.current.offsetWidth / 2));
    const iconY = Math.round((this.icon.current.getBoundingClientRect().top) + (this.icon.current.offsetHeight / 2));
    this.setState({ iconX: iconX, iconY: iconY });
  }

  // if window is resized, iconX and Y have changed because they're relative to the viewport
  measureAfterResize = () => {
    this.getIconPosition();
  }

  handleMouseMove = ({pageX: x, pageY: y}) => {
    const dx = this.state.iconX - x;
		const dy = this.state.iconY - y;
		const dist = Math.sqrt(dx*dx + dy*dy);

    // size is inverse to the distance of the mouse from the icon's center
    // the closer you get to the center, the larger the icon becomes
    let size =- dist;
    size = (size + (iconWidth * scaleFactor)) / iconWidth;

    // prevent icon from scaling down below 100%
    if (dist < hitRegion && size > 1) {
      this.setState({ iconScale: size })
		}
		else {
      this.setState({ iconScale: 1 })
		}
  }

  // touch devices
  handleTouchMove({touches}) {
    this.handleMouseMove(touches[0]);
  }

  // icon has been clicked. Take care of the logic in the parent component
  activateIcon(index) {
    this.props.showPanel(index);
  }

  render() {
    const {
      index,
      isActive,
      image
    } = this.props;

    return (
      <div
        className={classnames("dock__icon", { "dock__icon--active": isActive })}
        ref={this.icon}
        onClick={() => { this.activateIcon(index) }}
        style={{ transform: `scale(${this.state.iconScale})` }}>
        <img className="dock__image" src={`images/${image}`} onLoad={this.imageOnload} alt="" />
      </div>
    );
  }
}

export default Icon;
