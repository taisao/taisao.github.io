var BlogForm = React.createClass({
    render: function () {
        return (
            <form class="blogForm">
                <input type="text" ref="title" />
                <textarea ref="content"></textarea>
                <input type="submit" />
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
               <h2>{this.props.blog.title}</h2>
               <span dangerouslySetInnerHTML={{__html: contentMarkup}}></span>
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
				<h1>Why Blog</h1>
                <BlogForm />
                <Blogs blogs={this.state.blogs} />
			</div>
		);
	}
});

React.render(
	<Why url="http://my-aetitud.rhcloud.com/api/tee/" />,
	document.getElementById("why")
);