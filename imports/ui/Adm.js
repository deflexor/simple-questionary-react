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

const REPLY_TYPES_4 = {}

const Empty = (props) => {
  return (
    <div className="tile is-child notification is-vertical is-10">Выберите тест</div>
  );
}

class EditTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      test: { q: [], title: '' },
      err: { q: [] }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
  }

  handleAddItem(event) {
    let test = this.state.test
    test.q.push({ title: '', type: REPLY_TYPES_4 })
    this.setState({ ...this.state, test })
  }

  handleDeleteItem(event, i) {
    let test = this.state.test
    test.q.splice(i, 1)
    this.setState({ ...this.state, test })
  }

  handleSubmit(event) {
    event.preventDefault();

    let err = {}
    let test = this.state.test
    // Find the text field via the React ref  
    const titleE = ReactDOM.findDOMNode(this.refs.title)
    const qE = test.q.map((e,i) => ReactDOM.findDOMNode(this.refs[`q${i}`]))
    test.q = test.q.map((e,i) => { return { title: qE[i].value.trim(), type: REPLY_TYPES_4 } })
    err.q = test.q.map((e,i) => { return !!test.q[i].title })
    test.title = titleE.value.trim()
    err.title = !!test.title

    this.setState({ err, test })

    const noErrors = !err.title && err.q.all(v => !v)

    if(noErrors) {
      console.log('inserting!', test)
      // Tests.insert(test)
    }
    
    // Clear form
    titleE.value = ''
  }
  
  render() {
    const { test, err } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="field">
          <label className="label">Название теста</label>
          <div className="control">
            <input className={classnames({ input: true, 'is-danger': err.title })} type="text" ref="title" placeholder="" />
          </div>
        </div>

        <button className="button is-primary is-rounded" onClick={this.handleAddItem}>Добавить вопрос</button>

        {test.q.map((item, i) => {
          return (
            <div className="tile notification">
              <div className="field">
                <label className="label">Название</label>
                <div className="control">
                  <input className={classnames({ input: true, 'is-danger': err.q[i] })} type="text" ref={`q${i}`} placeholder="" />
                </div>
              </div>
              <div className="field">
                <label className="label">Тип ответов</label>
                <div className="control">
                  <div className="select">
                    <select>
                      <option>Согласен? Нет, Частинчо, Да, Полностью</option>
                    </select>
                  </div>
                  <a href="javascript:void(0)" onClick={this.handleDeleteItem.bind(this, i)} class="icon has-text-danger my-pad-top3 my-pad-left">
                    <i class="fas fa-ban"></i>
                  </a>
                </div>
              </div>
            </div>
          )
        })}

        <div className="field is-grouped my-pad-top2">
          <div className="control">
            <button className="button is-link is-rounded" type="submit">Сохранить</button>
          </div>
          <div className="control">
            <Link to="/admin123" className="button is-link is-rounded is-warning">Отмена</Link>
          </div>
        </div>
      </form>
    )
  }
}

const ShowTest = ({match, items}) => {
  const { id } = match.params
  const [item] = items.filter(it => it._id === id)
  return (
    <div className="tile is-child notification is-vertical is-10">
      <h4>{item.name}</h4>
    </div>
  );
}


// App component - represents the whole app
class Adm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('tests.insert', text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  render() {
    // let items = this.props.tests;
    let items = [{name: 'приветэ', _id: '1'},{name: 'пока', _id: '2'}];
    let itemsE = items.map((item) => {
      return (
        <li key={item._id}>
          <Link to={`/admin123/${item._id}`}>{item.name}</Link>
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
          <Switch>
            <Route exact path={`${this.props.match.url}`} component={Empty} />
            <Route path={`${this.props.match.url}/edit`} render={(props) => <EditTest {...props} />} />
            <Route path={`${this.props.match.url}/edit/:id`} render={(props) => <EditTest {...props} items={items} />} />
            <Route path={`${this.props.match.url}/:id`} render={(props) => <ShowTest {...props} items={items} />}  />
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
