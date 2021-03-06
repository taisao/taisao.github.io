var BlogMarked = React.createClass({displayName: "BlogMarked",
    render: function () {
        var contentSplit = this.props.content.split("\n");
        var lines = contentSplit.map(function(line) {
            if (line) {
                return React.createElement("span", {dangerouslySetInnerHTML: {__html: marked(line, {sanitized: false})}});
            } else {
                return React.createElement("br", null);
            }

        });

        return (
            React.createElement("div", {className: "blogMarked"}, 
                lines
            )
        );
    }
});

var BlogForm = React.createClass({displayName: "BlogForm",
    handleTitleChange: function (e) {
        var title = e.target.value;
        this.props.handleBlogFromTitleChange(title);
    },
    handleContentChange: function (e) {
        var content = e.target.value;
        this.props.handleBlogFromContentChange(content);
    },
    handleSubmit: function (e) {
        this.props.handleSubmit(e);
    },
    render: function () {
        return (
            React.createElement("form", {className: "blogForm", onSubmit: this.handleSubmit}, 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("input", {className: "form-control", type: "text", ref: "title", placeholder: "Why?", value: this.props.title, onChange: this.handleTitleChange})
                ), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("textarea", {className: "form-control", ref: "content", placeholder: "Explanation (Markdown)", value: this.props.content, onChange: this.handleContentChange})
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
    handleBlogFromTitleChange: function(title) {
        this.setState({
            title: title
        });
    },
    handleBlogFromContentChange: function(content) {
        this.setState({
            content: content
        });
    },
    handleSubmit: function (e) {
        e.preventDefault();
        this.putDataToServer();
        this.setState({
            title: '',
            content: ''
        });
    },
    getInitialState: function () {
        return {
            blogs: [],
            title: '',
            content: ''
        };
    },
    putDataToServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: {title: this.state.title, content: this.state.content, date: new Date(new Date().getTime() + 7*60*60*1000).toJSON().slice(0,10)},
            success: function (data) {
                var blogs = this.state.blogs.reverse().concat([data]);
                blogs.reverse();
                for (i in blogs) {
                    blogs[i]["id"] = i;
                }
                this.setState({
                    blogs: blogs
                });
            }.bind(this),
            error: function (xhr, state, err) {
                console.log(this.props.url, state, err.toString());
            }.bind(this)
        });
    },
    getDataFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                var blogs = data["results"].reverse();
                for (i in blogs) {
                    blogs[i]["contentState"] = false;
                    blogs[i]["id"] = i;
                }
                this.setState({
                    blogs: blogs
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
                React.createElement(BlogForm, {handleBlogFromContentChange: this.handleBlogFromContentChange, 
                          handleBlogFromTitleChange: this.handleBlogFromTitleChange, 
                          handleSubmit: this.handleSubmit, 
                          title: this.state.title, 
                          content: this.state.content}), 
                this.state.content ? React.createElement(BlogMarked, {content: this.state.content}) : null, 
                React.createElement(Blogs, {blogs: this.state.blogs, hanldeBlogClick: this.hanldeBlogClick})
			)
		);
	}
});

React.render(
//	<Why url="data.json" />,
	React.createElement(Why, {url: "http://my-aetitud.rhcloud.com/api/blogs/?format=json"}),
	document.getElementById("why")
);