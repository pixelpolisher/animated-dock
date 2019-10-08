import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';

import Icon from './Icon';
import { iconData } from './data/IconData';

import throttle from 'lodash/throttle';
import delay from 'lodash/delay';
import classnames from 'classnames';

const numIcons = iconData.length;
let windowWidth = 0;

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

    this.handleMouseMove    = throttle(this.handleMouseMove, 50);
    this.handleTouchMove    = throttle(this.handleTouchMove, 50);
    this.imageOnload        = this.imageOnload.bind(this);
    this.toggleListeners    = this.toggleListeners.bind(this);
    this.toggleInfo         = this.toggleInfo.bind(this);
    this.showInfoPanel      = this.showInfoPanel.bind(this);
  }

  componentDidMount() {

  }

  imageOnload() {
    windowWidth = this.dockWindow.current.offsetWidth;
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
    const xPos = ((this.dock.current.getBoundingClientRect().x) - x) * (this.dock.current.offsetWidth / (windowWidth / numIcons));
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
    const percentage = Math.round(windowWidth / numIcons);

    const posX =- Math.round(((percentage * index) * 0.93) + 50);

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
              image={icon.image}
              isActive={isActive}
              showPanel={this.showInfoPanel}
              hitRegion="300"
              scaleFactor="1.8"
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
                  {(value) =>
                      <div ref={this.dockWindow} className="dock__visual" style={toCSS(value.translateX)}>
                        <img src="images/bg-animation.png" alt="" onLoad={this.imageOnload} />
                      </div>
                  }
          </Motion>
          <div className="dock__icons">
            {icons}
          </div>
          <div className={classnames({ "dock__info": true, "dock__info--active": showInfo })}>
            <button className="dock__close" onClick={() => { this.toggleInfo(false); }}>close</button>
            <h3 class="dock__title">{curTitle}</h3>
            <p>{curText}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Dock;
