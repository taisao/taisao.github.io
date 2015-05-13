var BlogForm = React.createClass({
    render: function () {
        return (
            <form className="blogForm">
                <div className="form-group">
                    <input className="form-control" type="text" ref="title" placeholder="Why?" />
                </div>
                <div className="form-group">
                    <textarea className="form-control" ref="content" placeholder="Explanation"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Say</button>
            </form>
        );
    }
});

var Blog = React.createClass({
   render: function () {
       var contentSplit = this.props.blog.content.split("\n");
       var contentMarkup = "";

       for (i in contentSplit) {
           contentMarkup += "<p>" + marked(contentSplit[i], {sanitize: false}) + "</p>";
       }

       return (
           <div className="blog">
               <div className="title">
                   <b>{this.props.blog.title}</b>
                   <img src="static/img/down.png" className="pull-right" />
               </div>
               <div className="content">
                   <span dangerouslySetInnerHTML={{__html: contentMarkup}}></span>
               </div>
           </div>
       );
   }
});

var Blogs = React.createClass({
    render: function () {
        var blogs = this.props.blogs.map(function (blog) {
            return (
                <Blog blog={blog} />
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
			<div className="why">
				<h1>WHY BLOG</h1>
                <hr />
                <BlogForm />
                <Blogs blogs={this.state.blogs} />
			</div>
		);
	}
});

React.render(
	<Why url="data.json" />,
//	<Why url="http://my-aetitud.rhcloud.com/api/tee/" />,
	document.getElementById("why")
);