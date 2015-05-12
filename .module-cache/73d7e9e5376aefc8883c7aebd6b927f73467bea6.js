var Blog = React.createClass({displayName: "Blog",
   render: function () {
       React.createElement("h2", null, this.props.blog.title)
       {this.props.blog.content}
   }
});

var Blogs = React.createClass({displayName: "Blogs",
    render: function () {
        var blogs = this.props.blogs.map(function (blog) {
            React.createElement(Blog, {blog: blog})
        });
        return (
            {blogs}
        );
    }
});

var Why = React.createClass({displayName: "Why",
    getInitialState: function () {
        return
    },
	render: function () {
		return (
			React.createElement("div", {className: "why"}, 
				React.createElement("h1", null, "Why Blog"), 
                React.createElement(Blogs, {blogs: this.state.blogs})
			)
		);
	}
});

React.render(
	React.createElement(Why, {url: "data.json"}),
	document.body
);