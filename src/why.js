var React = require('react/addons');

var Why = React.createClass({
	render: function () {
		return (
			<div className="why">
				Hello World Why
			</div>
		);
	}
});

React.render(
	<Why />,
	document.body
);