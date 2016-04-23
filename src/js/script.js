import React from "react";
import ReactDOM from "react-dom";
import ClockSetting from "./components/ClockSetting";
import Timer from "./components/Timer";

const app = document.getElementById('app');

class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      breakLen: "5",
      sessionLen: "25",
      sesTimeLeft: {nice: "25:00", raw: 25*60},
      timerPaused: true,
      breakStarted: false
    };
    this.timer;
  }

  updateSession(val) {
    if (this.timer) {
      this.timer.clearTimer();
    }
    this.setState({sessionLen: val, sesTimeLeft: {nice: val, raw:parseInt(val)*60}});
  }

  updateBreak(val) {
    if (this.timer) {
      this.timer.clearTimer();
    }
    this.setState({breakLen: val});
    if (this.state.breakStarted) {
      this.setState({sesTimeLeft: {nice: val, raw:parseInt(val)*60}})
    }
  }

  handleClick() {
    let {timerPaused, sessionLen, sesTimeLeft} = this.state;

    if (timerPaused) {
      this.timer = new Timer(sesTimeLeft.raw);
      this.timer.start(this.printT.bind(this), ()=>this.switchClock());      
    } else {
      this.timer.clearTimer();
    }
    this.setState({timerPaused: !timerPaused});
  }

  switchClock() {
    let {breakLen, sessionLen, breakStarted} = this.state;
    const duration = breakStarted? sessionLen : breakLen;
    this.timer = new Timer(parseInt(duration) * 60);
    this.timer.start(this.printT.bind(this), ()=>this.switchClock()); 
    this.setState({breakStarted: !breakStarted});
  }

  printT(endAt) {
    const timeDiffinSec = Math.ceil((endAt - (new Date()).getTime())/1000);
    const min = Math.floor(timeDiffinSec / 60);
    const sec = timeDiffinSec % 60;
    this.setState({sesTimeLeft: 
                    {nice: min+':'+(sec<10? '0'+sec : sec),
                     raw: timeDiffinSec}
                  });
  }
  
  render() {
    //console.log(this.state)
    let {timerPaused, sessionLen, sesTimeLeft, breakStarted, breakLen} = this.state;
    let display = sesTimeLeft.nice;

    const sessionLenInSec = parseInt(sessionLen) * 60;
    const breakLenInSec = parseInt(breakLen) * 60;

    let title = 'Session:', fillClass = 'fill default', percent;
    if (breakStarted) {
      title = 'Break!';
      fillClass = 'fill break';
      percent = (breakLenInSec - sesTimeLeft.raw) / breakLenInSec * 100;
    } else {
      percent = (sessionLenInSec - sesTimeLeft.raw) / sessionLenInSec * 100;
    }

    let disableSes, disableBreak;
    if (!timerPaused) {
      disableSes = disableBreak = true;
    } else if (!this.timer) {
      disableSes = disableBreak = false;
    } else {
      if (breakStarted){
        disableBreak = false;
        disableSes = true;
      } else {
        disableSes = false;
        disableBreak = true;
      }
    } 

    return (
      <div>
        <ClockSetting disabled={disableBreak} handle={this.updateBreak.bind(this)} pos="pull-left" label="BREAK LENGTH" val={this.state.breakLen}/>
        <ClockSetting disabled={disableSes} handle={this.updateSession.bind(this)} pos="pull-right" label="SESSION LENGTH" val={this.state.sessionLen}/>
        <div className="clearfix"></div>
        <div id="clock" onClick={this.handleClick.bind(this)}>
          <div className="inner-border"></div>
          <div className={fillClass} style={{height: percent+'%'}}></div>
          <div className="title-label">{title}</div>
          <div id="time-figure">{display}</div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Layout />, app);