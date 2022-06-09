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
                <img src={post.image_url}/>
                <LikeButton refreshPost = {this.refreshPostDataFromServer} likeId={post.current_user_like_id} postId = {post.id}/>
                <BookmarkButton refreshPost = {this.refreshPostDataFromServer} bookmarkId={post.current_user_bookmark_id} postId = {post.id}/>
                <p><strong>{post.user.username}</strong>{post.caption}</p>
                <p><strong>{post.comments[0] ? post.comments[post.comments.length-1].user.username : ""}</strong>{post.comments[0] ? post.comments[post.comments.length-1].text: ""}</p>
                <AddComment refreshPost = {this.refreshPostDataFromServer} postId = {post.id}/>
            </section>
        )
    }
}

export default Post 