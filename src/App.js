import React from 'react';
import './App.css';


const moment = require('moment');

const Jabir = () => <h1>Fasaha Pomodoro Clock</h1> 
const Hafsat = () => <h2>By Sagir Garba Isa</h2>



const SetTimer = ({ type, value, handleCick }) => (
  <div className='SetTimer'>
    <div id={`${type}-label`}>{type === 'session' ? 'session ' : 'Break '}</div>
    <div className='SetTimer-controls'>
      <button id={`${type}-decrement`} onClick={() => handleCick(false, `${type}Value`)}>&darr;</button>
      <div id={`${type}-length`}>{value}</div>
      <button id={`${type}-increment`} onClick={() => handleCick(true, `${type}Value`)}>&uarr;</button>
    </div>
    </div>
) 




const Timer = ({ mode, time }) => (
  <div className='Timer'>
    <h1 id='timer-label'>{mode === 'session' ? 'Session' : 'Break'}</h1>
    <h1 id='time-left'>{time}</h1>
  </div>
)

const Controls = ({ active, handleReset, handlePlayPause }) => (
  <div className='controls'>
    <button id='start_stop' onClick={handlePlayPause}>{ active ? <span>&#10074;&#10074;</span> : <span>&#9658;</span> }</button>
    <button id='reset' onClick={handleReset}>&#8635;</button>
  </div>
)


class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      breakValue: 5,
      sessionValue: 25,
      mode: 'session',
      time: 25 * 60 * 1000,
      active: true,
      touched: false
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.time === 0 && prevState.mode === 'session') {
      this.setState({ time: this.state.breakValue * 60 * 1000, mode: 'break' })
      this.audio.play()
    }
    if(prevState.time === 0 && prevState.mode === 'break') {
      this.setState({ time: this.state.sessionValue * 60 * 100, mode: 'session' })
      this.audio.play()
    }
  }

handleSetTimers = (inc, type) => {
  if(this.state[type] === 60 && inc) return
  if(this.state[type] === 1 && !inc) return
  this.setState({ [type]: this.state[type] + (inc ? 1 : -1) })
}

handleReset = () => {
  this.setState({ 
    breakValue: 5, 
    sessionValue: 25, 
    time: 25 * 60 * 1000,
    mode: 'session',
    touched: false,
    active: false 
    })
  clearInterval(this.pomodoro)
  this.audio.pause()
  this.audio.currentTime = 0
}

handlePlayPause = () => {
  if(this.state.active) {
    clearInterval(this.pomodoro)
    this.setState({ active: false })
  } else {
    if(this.state.touched){
      this.pomodoro = setInterval(() => this.setState({ time: this.state.time - 1000 }), 1000)
      this.setState({ active: true })
    } else {
      this.setState({ 
        time: this.state.sessionValue * 60 * 1000, 
        touched: true, 
        active: true }, () => this.pomodoro = setInterval(() => this.setState({ time: this.state.time - 1000 }), 1000))
    } 
  }
}


  render() {
    return (
      <div className="App">
        <div className="Header">
        <Jabir/>
        <Hafsat/>
        </div>
        <div className='settings'>
        <SetTimer type='break' value={this.state.breakValue} handleCick={this.handleSetTimers}/>
        <SetTimer type='session' value={this.state.sessionValue} handleCick={this.handleSetTimers}/>
        </div>
        <div>
          <Timer mode={this.state.mode} time={moment(this.state.time).format('mm:ss')}/>
          <Controls 
          active={this.state.active}
          handlePlayPause={this.handlePlayPause}
          handleReset={this.handleReset}
          />
        </div>
        <audio 
          id='beep' 
          src='https://s3-us-west-1.amazonaws.com/benjaminadk/Data+synth+beep+high+and+sweet.mp3'
          ref = {el => this.audio = el}
        >
        </audio>
      </div>
    );
  }
}

export default App;