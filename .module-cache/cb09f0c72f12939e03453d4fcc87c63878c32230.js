var React = require('react/addons');

var Why = React.createClass({displayName: "Why",
	render: function () {
		return (
			React.createElement("div", {className: "why"}, 
				"Hello World"
			)
		);
	}
});

React.render(
	React.createElement(Why, null),
	document.body
);