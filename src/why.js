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
    handleChange: function (e) {
        var content = e.target.value;
        this.props.handleBlogFromChange(content);
    },
    render: function () {
        return (
            <form className="blogForm">
                <div className="form-group">
                    <input className="form-control" type="text" ref="title" placeholder="Why?" />
                </div>
                <div className="form-group">
                    <textarea className="form-control" ref="content" placeholder="Explanation (Markdown)" onChange={this.handleChange}></textarea>
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
    handleBlogFromChange: function(content) {
        this.setState({
            content: content
        });
    },
    getInitialState: function () {
        return {
            blogs: [],
            content: ''
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
			<div className="why">
				<h1>WHY BLOG</h1>
                <hr />
                <BlogForm handleBlogFromChange={this.handleBlogFromChange}/>
                {this.state.content ? <BlogMarked content={this.state.content} /> : null}
                <Blogs blogs={this.state.blogs} hanldeBlogClick={this.hanldeBlogClick} />
			</div>
		);
	}
});

React.render(
	<Why url="data.json" />,
//	<Why url="http://my-aetitud.rhcloud.com/api/tee/" />,
	document.getElementById("why")
);