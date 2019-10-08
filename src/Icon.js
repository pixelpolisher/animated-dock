import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import delay from 'lodash/delay';
import classnames from 'classnames';

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
    this.addMoveListeners = this.addMoveListeners.bind(this);
    this.removeMoveListeners = this.removeMoveListeners.bind(this);
    this.measureAfterResize = debounce(this.measureAfterResize, 500);
    this.resetIcon = this.resetIcon.bind(this);
  }

  componentDidMount() {
    this.getIconPosition();
    this.addMoveListeners();
    window.addEventListener('resize', this.measureAfterResize);
  }

  addMoveListeners() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove);
  }

  removeMoveListeners() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
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

  activateIcon(index) {
    this.props.showPanel(index);
  }

  resetIcon() {
    console.log('reset');
    this.addMoveListeners();
    this.setState({ isActive: false });
  }

  render() {
    const {
      icon,
      index,
      isActive
    } = this.props;

    return (
      <div
        className={classnames("dock__icon", `dock__icon--${icon}`, { "dock__icon--active": isActive })}
        ref={this.icon}
        onClick={() => { this.activateIcon(index) }}
        style={{ transform: `scale(${this.state.iconScale})` }}
      />
    );
  }
}

export default Icon;
