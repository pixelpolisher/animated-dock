import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';

import Icon from './Icon';
import { iconData } from './data/IconData';

import throttle from 'lodash/throttle';
import delay from 'lodash/delay';
import classnames from 'classnames';

const numIcons = 6;

class Dock extends Component {

  constructor(props) {
    super(props);
    this.dock = React.createRef();
    this.dockWindow = React.createRef();

    this.state = {
      panelX: 0,
      showInfo: false,
      activeIcon: 0
    }

    this.handleMouseMove = throttle(this.handleMouseMove, 50);
    this.handleTouchMove = throttle(this.handleTouchMove, 50);
    this.toggleListeners = this.toggleListeners.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
    this.showInfoPanel = this.showInfoPanel.bind(this);
  }

  componentDidMount() {
    this.toggleListeners(true);
  }

  toggleListeners(state) {
    if(state === true) {
      this.dock.current.addEventListener('mousemove', this.handleMouseMove);
      this.dock.current.addEventListener('touchmove', this.handleTouchMove);
    }
    else {
      this.dock.current.removeEventListener('mousemove', this.handleMouseMove);
      this.dock.current.addEventListener('touchmove', this.handleTouchMove);
    }
  }

  handleMouseMove = ({pageX: x, pageY: y}) => {
    const xPos = ((this.dock.current.getBoundingClientRect().x) - x) * (this.dock.current.offsetWidth / 210) + 350;
    this.setState({ panelX: xPos});
  }

  handleTouchMove({touches}) {
    this.handleMouseMove(touches[0]);
  }

  toggleInfo(state) {
    if(state === true) {
      this.setState({ showInfo: true });
      this.toggleListeners(false);
    } else {
      this.setState({ showInfo: false });
      this.toggleListeners(true);
    }
  }

  showInfoPanel(index) {
    this.toggleInfo(true);
    this.setState({ activeIcon: index });
    const windowWidth = this.dockWindow.current.offsetWidth;
    const percentage = Math.round(windowWidth / numIcons);

    const posX =- Math.round((percentage * index) - (16 * index) + 50);

    delay(() => {
      this.setState({ panelX: posX });
    }, 60);
  }

  render() {
    const config = { stiffness: 40, damping: 5 };
    const toCSS = (translateX) => ({ transform: `translateX(${translateX}px)` });
    const {
      panelX,
      showInfo,
      activeIcon
    } = this.state;

    const icons = iconData.map((icon, index) => {
      const isActive = this.state.activeIcon === index;
      return(
        <Icon key={index}
              index={index}
              icon={icon.symbol}
              isActive={isActive}
              showPanel={this.showInfoPanel}
        />
      )
    });

    const curTitle = iconData[activeIcon].title;
    const curText = iconData[activeIcon].text;

    return (
      <div className="dock">
        <div className={classnames({"dock__window": true, "dock__window--active" : showInfo })} ref={this.dock}>
          <div className="dock__surface" />
          <Motion defaultValue={{ translateX: 0 }}
                  style={{ translateX: spring(panelX, config) }}>
                  { (value) => <div ref={this.dockWindow}  className="dock__visual" style={toCSS(value.translateX)} />  }
          </Motion>
          <div className="dock__icons">
            {icons}
          </div>
          <div className={classnames({ "dock__info": true, "dock__info--active": showInfo })}>
            <h3>{curTitle}</h3>
            <p>{curText}</p>
            <button className="dock__close" onClick={() => { this.toggleInfo(false); }}>close</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Dock;
