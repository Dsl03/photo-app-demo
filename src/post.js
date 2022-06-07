import React from 'react'
import {getHeaders} from './utils'
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';

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
        return (
            <section
                className="card">
                <img src={post.image_url}/>
                <LikeButton refreshPost = {this.refreshPostDataFromServer} likeId={post.current_user_like_id} postId = {post.id}/>
                <BookmarkButton refreshPost = {this.refreshPostDataFromServer} bookmarkId={post.current_user_bookmark_id} postId = {post.id}/>
                <p>{post.caption}</p>
            </section>
        )
    }
}

export default Post 