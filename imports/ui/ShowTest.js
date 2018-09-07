import React, { Component } from 'react';
import classnames from 'classnames';

import { Tests } from '../api/tests.js';

export default class ShowTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }

  handleChange = (e) => {
    let { test } = this.state
    let { target } = e
    test[target.name] = target.value;
    this.setState({ test });
  }

  render() {
    let { items, match: { params: { id } } } = this.props
    
    if(!id) {
      return (<div className="tile is-child notification is-vertical is-10">
        <h4>hmm..</h4>
      </div>)
    }
    
    let [test] = items.filter(it => it._id === id)
    if(!test) {
      return (<div className="tile is-child notification is-vertical is-10">
        <h4>nou such test: {id}</h4>
      </div>)
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <h2>{test.title}</h2>

        {test.q.map((item, i) => {
          return (
            <div className="tile notification" key={i}>
              <div className="field">
                <label className="label">{item.title}</label>
                <div className="control" style={{whiteSpace: 'nowrap'}}>
                  <div className="select">
                    <select>
                      <option>Согласен? Нет, Частично, Да, Полностью</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

      </form>
    )
  }
}

