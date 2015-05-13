var BlogMarked = React.createClass({displayName: "BlogMarked",
    render: function () {
        var contentSplit = this.props.content.split("\n");
        var lines = contentSplit.map(function(line) {
            return React.createElement("p", {dangerouslySetInnerHTML: {__html: marked(line, {sanitized: false})}});
        });

        return (
            React.createElement("div", {className: "blogMarked"}, 
                lines
            )
        );
    }
});

var BlogForm = React.createClass({displayName: "BlogForm",
    handleChange: function (e) {
        var content = e.target.value;
        this.props.handleBlogFromChange(content);
    },
    render: function () {
        return (
            React.createElement("form", {className: "blogForm"}, 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("input", {className: "form-control", type: "text", ref: "title", placeholder: "Why?"})
                ), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("textarea", {className: "form-control", ref: "content", placeholder: "Explanation", onChange: this.handleChange})
                ), 
                React.createElement("button", {type: "submit", className: "btn btn-primary"}, "Say")
            )
        );
    }
});

var Blog = React.createClass({displayName: "Blog",
    handleClick: function () {
        this.props.hanldeBlogClick(this);
    },
    render: function () {
       var contentSplit = this.props.blog.content.split("\n");
       var contentMarkup = "";

       for (i in contentSplit) {
           contentMarkup += "<p>" + marked(contentSplit[i], {sanitize: false}) + "</p>";
       }

       return (
           React.createElement("div", {className: "blog"}, 
               this.props.blog.contentState ?
                   React.createElement("div", {className: "title active", onClick: this.handleClick}, 
                       React.createElement("b", {className: "pull-left"}, this.props.blog.title), 
                       React.createElement("img", {src: "static/img/up.png", className: "pull-right"})
                   )
                   :
                   React.createElement("div", {className: "title", onClick: this.handleClick}, 
                       React.createElement("b", {className: "pull-left"}, this.props.blog.title), 
                       React.createElement("img", {src: "static/img/down.png", className: "pull-right"})
                   ), 
               
               this.props.blog.contentState ?
                   React.createElement("div", {className: "content"}, 
                       React.createElement("span", {dangerouslySetInnerHTML: {__html: contentMarkup}})
                   )
                   :
                   null
               
           )
       );
    }
});

var Blogs = React.createClass({displayName: "Blogs",
    render: function () {
        var hanldeBlogClick = this.props.hanldeBlogClick;
        var blogs = this.props.blogs.map(function (blog) {
            return (
                React.createElement(Blog, {blog: blog, hanldeBlogClick: hanldeBlogClick})
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
    hanldeBlogClick: function (blog) {
        this.state.blogs[blog.props.blog.id]["contentState"] = !blog.props.blog.contentState;
        this.setState({
            blogs: this.state.blogs
        });
    },
    handleBlogFromChange: function(content) {
        this.setState({
            content: content
        });
    },
    getInitialState: function () {
        return {
            blogs: [],
            content: 'sad'
        };
    },
    getDataFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                for (i in data) {
                    data[i]["contentState"] = false;
                    data[i]["id"] = i;
                }
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
				React.createElement("h1", null, "WHY BLOG"), 
                React.createElement("hr", null), 
                React.createElement(BlogForm, {handleBlogFromChange: this.handleBlogFromChange}), 
                React.createElement(BlogMarked, {content: this.state.content}), 
                React.createElement(Blogs, {blogs: this.state.blogs, hanldeBlogClick: this.hanldeBlogClick})
			)
		);
	}
});

React.render(
	React.createElement(Why, {url: "data.json"}),
//	<Why url="http://my-aetitud.rhcloud.com/api/tee/" />,
	document.getElementById("why")
);