var Blog = React.createClass({displayName: "Blog",
    render: function () {
        return (
            React.createElement("h1", null)
        );
    }
});

var Why = React.createClass({displayName: "Why",
	render: function () {
		return (
			React.createElement("div", {className: "why"}, 
				"Why Blog", 
                React.createElement(Blog, null)
			)
		);
	}
});

React.render(
	React.createElement(Why, {url: "data.json"}),
	document.body
);