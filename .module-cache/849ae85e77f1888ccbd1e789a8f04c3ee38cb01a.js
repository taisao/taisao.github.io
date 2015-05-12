var BlogForm = React.createClass({displayName: "BlogForm",
    render: function () {
        return (
            React.createElement("form", {class: "blogForm"}, 
                React.createElement("input", {type: "text", ref: "title"}), 
                React.createElement("textarea", {ref: "content"}), 
                React.createElement("input", {type: "submit"})
            )
        );
    }
});

var Blog = React.createClass({displayName: "Blog",
   render: function () {
       var contentSplit = this.props.blog.content.split("\n");
       var contentMarkup = "";

       for (i in contentSplit) {
           contentMarkup += "<p>" + marked(contentSplit[i], {sanitize: false}) + "</p>";
       }

       return (
           React.createElement("div", {className: "blog"}, 
               React.createElement("h2", null, this.props.blog.title), 
               React.createElement("span", {dangerouslySetInnerHTML: {__html: contentMarkup}})
           )
       );
   }
});

var Blogs = React.createClass({displayName: "Blogs",
    render: function () {
        var blogs = this.props.blogs.map(function (blog) {
            return (
                React.createElement(Blog, {blog: blog})
            );
        });
        return (
            React.createElement("div", {className: "blogs"}, 
                blogs
            )
        );
    }
});

var Why = React.createClass({displayName: "Why",
    getInitialState: function () {
        return {
            blogs: []
        };
    },
    getDataFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({
                    blogs: data
                });
            }.bind(this),
            error: function (xhr, state, err) {
                console.log(this.props.url, state, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.getDataFromServer();
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
	document.getElementById("why")
);