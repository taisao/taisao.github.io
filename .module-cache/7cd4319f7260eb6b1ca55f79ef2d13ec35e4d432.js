var Blogs = React.createClass({displayName: "Blogs",
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
				React.createElement("h1", null, "Why Blog"), 
                React.createElement(Blogs, null)
			)
		);
	}
});

React.render(
	React.createElement(Why, {url: "data.json"}),
	document.body
);