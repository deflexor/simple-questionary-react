import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Link } from 'react-router-dom';
import classnames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import { withTracker } from 'meteor/react-meteor-data';
import { USER_SES_KEY } from '../startup/config';

import { Tests } from '../api/tests.js';

import Test from './Test.js';
import EditTest from './EditTest.js';

const REPLY_TYPES_4 = {}

const Empty = (props) => {
  return (
    <div className="tile is-child notification is-vertical is-10">Выберите тест</div>
  );
}


// App component - represents the whole app
class Adm extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    let { tests, location } = this.props
    const items = tests
    let itemsE = items.map((item) => {
      return (
        <li key={item._id}>
          <Link to={`/admin123/edit/${item._id}`}>{item.title}</Link>
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
          <div></div>
          <Link to="/admin123/edit" className="button is-primary is-rounded">
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Добавить тест</span>
          </Link>
        </div>
        <div className="column">
          {location.state && location.state.msg && <article className="message is-success">
            <div className="message-header">
              <p>Ок!</p>
              <button className="delete" aria-label="delete"></button>
            </div>
            <div className="message-body">{location.state.msg}</div>
          </article>}
          <Switch>
            <Route exact path={`${this.props.match.url}`} component={Empty} />
            <Route path={`${this.props.match.url}/edit/:id`} render={(props) => <EditTest {...props} key={props.match.params.id} items={items} />} />
            <Route path={`${this.props.match.url}/edit`} render={(props) => <EditTest {...props} key="edit" items={items} />} />
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
})(Adm);
