'use strict';

import React from 'react';
import {encoder, decoder, ENC_ALGOS, DEC_ALGOS} from 'string-codec';
const ENC = ENC_ALGOS.concat(['md5','rmd160','sha1','sha224','sha256','sha384','sha512']);

var Algo = React.createClass({
  _onDelete() {
    this.props.onDelete(this.props.algo.id);
  },

  render() {
    return (
      <div>
        <span>
          <button onClick={this._onDelete}>x</button>
          {this.props.algo.codec} {this.props.algo.algo}:
          <strong> {this.props.result}</strong>
        </span>
      </div>
    );
  }
});

var AlgoList = React.createClass({
  getInitialState() {
    return {algos: [], value: ''};
  },

  handleChange(e) {
    this.setState({value: e.target.value});
  },

  addAlgo(algo,codec) {
    var id = Math.floor(Math.random() * 1000000000000).toString(36);
    this.setState({
      algos: this.state.algos.concat({id:id, algo:algo, codec:codec})
    });
  },

  onDelete(id) {
    this.setState({
      algos: this.state.algos.filter( algo => {
        return algo.id !== id;
      })
    });
  },

  clearAlgos() {
    this.setState({
      algos: []
    });
  },

  render() {
    var value = this.state.value;

    var algos = this.state.algos.map( algo => {
      try {
        if(algo.codec === 'encode') {
          value = encoder(value,algo.algo);
        } else {
          value = decoder(value,algo.algo);
        }
      } catch(e) {
        value = e.toString();
      }

      return (
        <li key={algo.id}>
          <Algo algo={algo} result={value} onDelete={this.onDelete} />
        </li>
      );
    });

    return (
      <div>
        <div>string codec pipeline　
          <button
            style={style.item}
            onClick={this.clearAlgos}>
            clear
          </button>
        </div>
        <input
          type='text' style={style.text} autoFocus={true}
          placeholder='enter text you want to encode and decode'
          onChange={this.handleChange} value={this.state.value} />
        <div>
          <div>
            <div style={style.head}>encode item</div>
              {ENC.map( algo => {
                return (
                  <button
                    key={algo}
                    style={style.item}
                    onClick={this.addAlgo.bind(null,algo,'encode')}>
                    {algo}
                  </button>
                );
              })}
          </div>
          <div>
            <div style={style.head}>decode item</div>
              {DEC_ALGOS.map ( algo => {
                return (
                  <button
                    key={algo}
                    style={style.item}
                    onClick={this.addAlgo.bind(null,algo,'decode')}>
                    {algo}
                  </button>
                );
              })}
          </div>
          <div>
            <p>codec-pipeline:</p><ul style={style.list}>{algos}</ul>
          </div>
        </div>
      </div>
    );
  }
});

var style = {
  text: {
    fontSize: '80%',
    width: 400
  },
  head: {
    textDecoration: 'underline'
  },
  item: {
    margin: 5,
    height: 40,
    fontSize: '100%'
  },
  list: {
    padding: 5,
    listStyleType: 'none'
  }
};

React.render(<AlgoList />, document.body);
