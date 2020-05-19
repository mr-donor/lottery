import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from "react-router-dom";
import { observer, Provider, inject } from "mobx-react";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	render() {
		return (
			<div style={{ color: 'red', fontSize: '18px' }}>
				<h1>Hello, World!</h1>
			</div>
		);
	}

    isDevelopment() {
        if (document.querySelector("meta[http-equiv='Content-Security-Policy']")) {
            return false;
        }
        return true
    }

}

ReactDOM.render(<App/>, document.getElementById('app'));