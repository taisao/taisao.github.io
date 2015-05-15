var BlogMarked = React.createClass({
    render: function () {
        var contentSplit = this.props.content.split("\n");
        var lines = contentSplit.map(function(line) {
            if (line) {
                return <span dangerouslySetInnerHTML={{__html: marked(line, {sanitized: false})}}></span>;
            } else {
                return <br />;
            }

        });

        return (
            <div className="blogMarked">
                {lines}
            </div>
        );
    }
});

var BlogForm = React.createClass({
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
            <form className="blogForm" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <input className="form-control" type="text" ref="title" placeholder="Why?" value={this.props.title} onChange={this.handleTitleChange} />
                </div>
                <div className="form-group">
                    <textarea className="form-control" ref="content" placeholder="Explanation (Markdown)" value={this.props.content} onChange={this.handleContentChange}></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Say</button>
            </form>
        );
    }
});

var Blog = React.createClass({
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
           <div className="blog">
               {this.props.blog.contentState ?
                   <div className="title active" onClick={this.handleClick}>
                       <b className="pull-left">{this.props.blog.title}</b>
                       <img src="static/img/up.png" className="pull-right" />
                   </div>
                   :
                   <div className="title" onClick={this.handleClick}>
                       <b className="pull-left">{this.props.blog.title}</b>
                       <img src="static/img/down.png" className="pull-right" />
                   </div>
               }
               {this.props.blog.contentState ?
                   <div className="content">
                       <span dangerouslySetInnerHTML={{__html: contentMarkup}}></span>
                   </div>
                   :
                   null
               }
           </div>
       );
    }
});

var Blogs = React.createClass({
    render: function () {
        var hanldeBlogClick = this.props.hanldeBlogClick;
        var blogs = this.props.blogs.map(function (blog) {
            return (
                <Blog blog={blog} hanldeBlogClick={hanldeBlogClick} />
            );
        });
        return (
            <div className="blogs">
                {blogs}
            </div>
        );
    }
});

var Why = React.createClass({
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
			<div className="why">
				<h1>WHY BLOG</h1>
                <hr />
                <BlogForm handleBlogFromContentChange={this.handleBlogFromContentChange}
                          handleBlogFromTitleChange={this.handleBlogFromTitleChange}
                          handleSubmit={this.handleSubmit}
                          title={this.state.title}
                          content={this.state.content} />
                {this.state.content ? <BlogMarked content={this.state.content} /> : null}
                <Blogs blogs={this.state.blogs} hanldeBlogClick={this.hanldeBlogClick} />
			</div>
		);
	}
});

React.render(
//	<Why url="data.json" />,
	<Why url="http://my-aetitud.rhcloud.com/api/blogs/?format=json" />,
	document.getElementById("why")
);