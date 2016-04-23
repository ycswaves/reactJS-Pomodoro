export default class Timer {
  constructor(sec) {
    this.duration = sec || 0;
    this.timerID;
  }

  start(runTask, callback) {
    const endAt = (new Date()).getTime() + this.duration * 1000; //timestamp of end time
    runTask(endAt);
    this.timerID = setInterval((() => {
      if ((new Date()).getTime() <= endAt) {
        runTask(endAt);
      } else {
        this.clearTimer();
        if (typeof callback === "function") {
          callback();
        }
      }
    }).bind(this), 1000)
  }

  clearTimer() {
    clearInterval(this.timerID);
  }
}