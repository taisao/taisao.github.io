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
           React.createElement("div", {className: "blog", onClick: this.handleClick}, 
               React.createElement("div", {className: "title"}, 
                   React.createElement("b", null, this.props.blog.title), 
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
        alert(blog.props.blog.title);
    },
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
                for (i in data) {
                    data[i]["contentState"] = false
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
                React.createElement(BlogForm, null), 
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