import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import { withTracker } from 'meteor/react-meteor-data';
import { USER_SES_KEY } from '../startup/config';

import { Tests } from '../api/tests.js';

import Test from './Test.js';
import ShowTest from './ShowTest.js';

const Empty = (props) => {
  return (
    <div className="tile is-child notification is-vertical is-10">Выберите тест</div>
  );
}

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  handleChange = (e) => {
    let { user } = this.props
    let { target } = e
    user[target.name] = target.value;
    Session.set(USER_SES_KEY, user)
    // this.setState({ test });
  }


  render() {
    let { tests, user, location } = this.props
    const items = tests
    let itemsE = items.map((item) => {
      return (
        <li key={item._id}>
          <Link to={`/${item._id}`}>{item.title}</Link>
        </li>
      );
    });

    return (
      <div className="columns">
        
        <div className="menu column is-one-quarter">
          <p className="menu-label">
            Тесты
          </p>
          <ul className="menu-list">
            {itemsE}
          </ul>
        </div>
        <div className="column">
          <nav className="level">
            <div className="level-left">
              <div className="level-item">
                <div className="field has-addons">
                  <p className="control">
                    <input  className="input" name="name" value={user.name} type="text" onChange={this.handleChange} autoComplete="off" placeholder="Имя" />
                  </p>
                  <p className="control">
                    <input className="input" name="age" value={user.age} type="text" onChange={this.handleChange} autoComplete="off" placeholder="Возраст" />
                  </p>
                </div>
              </div>
            </div>
          </nav>
          {location.state && location.state.msg && <article className="message is-success">
            <div className="message-header">
              <p>Ок!</p>
              <button className="delete" aria-label="delete"></button>
            </div>
            <div className="message-body">{location.state.msg}</div>
          </article>}
          <Switch>
            <Route exact path={`/`} component={Empty} />
            <Route path={`/:id`} render={(props) => <ShowTest {...props} items={items} />}  />
          </Switch>
        </div>
      </div>
    )
  }
}

export default withTracker(() => {
  Meteor.subscribe('tests');

  return {
    tests: Tests.find({}, { sort: { createdAt: -1 } }).fetch(),
    user: Session.get(USER_SES_KEY)
  };
})(App);
