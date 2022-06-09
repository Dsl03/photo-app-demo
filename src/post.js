import React from 'react'
import {getHeaders} from './utils'
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import AddComment from './AddComment';

class Post extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            post: props.model
        }
        this.refreshPostDataFromServer = this.refreshPostDataFromServer.bind(this)
    }

    componentDidMount(){

    }

    refreshPostDataFromServer () {
        const url = '/api/posts/' + this.state.post.id
        fetch(url, {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            console.log (data)
            this.setState({
                post : data
            })
        })
    }

    render () {
        const post = this.state.post;
        const boldusername = <strong>bolded</strong>

        return (
            <section
                className="card">
                <h3><strong>{post.user.username}</strong> </h3>
                <img src={post.image_url}/>
                <div className = "buttons">
                    <div>
                        <LikeButton refreshPost = {this.refreshPostDataFromServer} likeId={post.current_user_like_id} postId = {post.id}/>
                        <i className = "far fa-comment" style={{paddingLeft: 5, paddingRight: 1}}></i>
                        <i className = "far fa-paper-plane" style={{paddingLeft: 1, paddingRight: 5}}></i>
                    </div>
                    <div>
                        <BookmarkButton refreshPost = {this.refreshPostDataFromServer} bookmarkId={post.current_user_bookmark_id} postId = {post.id}/>
                    </div>
                </div>
                <p><strong> {post.likes.length != 1 ? post.likes.length + " likes" :post.likes.length + " like"} </strong></p>
                <p><strong>{post.user.username}</strong>{post.caption}</p>
                <p style = {{color: "grey", fontSize: 15, marginTop: 5}}>
                    {post.comments[0] ? post.comments[post.comments.length-1].display_time : ""}
                </p>
                <p style = {{color: "#2c699b"}}> {post.comments.length > 1 ? "View all " + post.comments.length +  " Comments" : ""}</p>
                <p><strong>{post.comments[0] ? post.comments[post.comments.length-1].user.username : ""}</strong>{post.comments[0] ? post.comments[post.comments.length-1].text: ""}</p>
                <AddComment refreshPost = {this.refreshPostDataFromServer} postId = {post.id}/>
            </section>
        )
    }
}

export default Post 