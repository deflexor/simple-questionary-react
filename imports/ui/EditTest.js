import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { observer } from "mobx-react";
import { observable } from "mobx";
import deepEqual from 'deep-equal';

import { Tests } from '../api/tests.js';
import { REPLY_TYPES_4 } from '../startup/config';


const DEFAULT_TEST = { q: [], title: '' }

export default EditTest = observer(class EditTest extends Component {

  test = observable(DEFAULT_TEST)
  err = observable({ q: [] })
  
  constructor(props) {
    super(props);
  }

  setStateFromProps() {
    let { items, match: { params: { id } } } = this.props
    let test = null
    if(id) {
      [test] = items.filter(it => it._id === id)
    }
    test = test || DEFAULT_TEST
    if(! deepEqual(this.test, test)) Object.assign(this.test, test)
  }

  componentDidMount() {
    this.setStateFromProps()
  }

  componentDidUpdate() {
    this.setStateFromProps()
  }

  handleAddItem = (e) => {
    this.test.q.push({ title: '', type: REPLY_TYPES_4 })
    this.err.q.push(false)
  }

  handleDeleteItem = (idx) => (e) => {
    let { test, err } = this.state
    this.test.q = test.q.filter((e,i) => i !== idx)
    this.err.q = err.q.filter((e,i) => i !== idx)
  }

  handleChange = (e) => {
    let { target } = e
    this.test[target.name] = target.value;
  }

  handleChangeItem = (idx) => (e) => {
    let { target } = e
    this.test.q[idx][target.name] = target.value;
  }
  

  handleSubmit = (event) => {
    event.preventDefault();

    let err = {}
    err.q = test.q.map((e,i) => { return !test.q[i].title })
    err.title = !test.title

    this.err = err
    const noErrors = !err.title && err.q.every(v => !v)

    if(noErrors) {
      let r = Tests.insert(test)
      this.props.history.push('/admin123', { msg: `Добавлен новый тест!` })
    }
  }

  render() {
    const { test, err } = this
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="field">
          <label className="label">Название теста</label>
          <div className="control">
            <input className={classnames({ input: true, 'is-danger': err.title })} type="text" value={test.title} name="title" onChange={this.handleChange} autoComplete="off" />
          </div>
        </div>

        <button className="button is-primary is-rounded" type="button" onClick={this.handleAddItem}>Добавить вопрос</button>

        {test.q.map((item, i) => {
          return (
            <div className="tile notification" key={i}>
              <div className="field" style={{width: '100%'}}>
                <label className="label">Название</label>
                <div className="control is-expanded">
                  <input className={classnames({ input: true, 'is-danger': err.q.length > i+1 ? err.q[i] : false })} name="title" value={item.title} type="text" onChange={this.handleChangeItem(i)} placeholder="" autoComplete="off" />
                </div>
              </div>
              <div className="field">
                <label className="label">Тип ответов</label>
                <div className="control" style={{whiteSpace: 'nowrap'}}>
                  <div className="select">
                    <select>
                      <option>Согласен? Нет, Частично, Да, Полностью</option>
                    </select>
                  </div>
                  <a href="javascript:void(0)" onClick={this.handleDeleteItem(i)} className="icon has-text-danger my-pad-top3 my-pad-left">
                    <i className="fas fa-ban"></i>
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
})

