var BlogForm = React.createClass({displayName: "BlogForm",
    render: function () {
        return (
            React.createElement("form", {className: "blogForm"}, 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("input", {className: "form-control", type: "text", ref: "title", placeholder: "Why?"})
                ), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("textarea", {className: "form-control", ref: "content", placeholder: "Explanation"})
                ), 
                React.createElement("button", {type: "submit", className: "btn btn-primary pull-right"}, "Say")
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
                React.createElement("hr", null), 
                React.createElement(BlogForm, null), 
                React.createElement("hr", null), 
                React.createElement(Blogs, {blogs: this.state.blogs})
			)
		);
	}
});

React.render(
	React.createElement(Why, {url: "data.json"}),
//	<Why url="http://my-aetitud.rhcloud.com/api/tee/" />,
	document.getElementById("why")
);