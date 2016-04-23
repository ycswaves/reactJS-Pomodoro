import React from "react";

export default class ClockSetting extends React.Component {
  constructor() {
    super();
  }

  handleChange(e) {
    const val = e.target.value;
    this.props.handle(val);
  }

  render() {
    let {pos, label, disabled, val} = this.props;
    let disable = disabled? 'disabled' : '';
    return (
      <label className={pos}> {label}
        <input disabled={disable} value={val} onChange={this.handleChange.bind(this)}
        className="form-control clockSetting input-lg" type="number" min="1" max="60"/>
      </label>
    )
  }
}