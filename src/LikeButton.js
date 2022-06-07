import React from 'react'
import {getHeaders} from './utils'

class LikeButton extends React.Component {

    constructor(props){
        super(props);
        this.toggleLike = this.toggleLike.bind(this)
        this.createLike = this.createLike.bind(this)
        this.removeLike = this.removeLike.bind(this)

    }

    componentDidMount(){

    }

    toggleLike () {
        console.log("wtf")
        if (this.props.likeId) {
            this.removeLike()
        }
        else{
            this.createLike()
        }
    }

    createLike () {
        const url = '/api/posts/likes'
        const postData = {
            post_id : this.props.postId
        }
        fetch(url, {
            headers : getHeaders(),
            method: 'POST',
            body: JSON.stringify(postData)
        }).then(reponse => reponse.json())
        .then(data => {
            console.log(data)
            this.props.refreshPost()
        })
    }

    removeLike () {
        const url = '/api/posts/likes/' + this.props.likeId
        fetch(url, {
            headers : getHeaders(),
            method: 'DELETE'
        }).then(reponse => reponse.json())
        .then(data => {
            console.log(data)
            this.props.refreshPost()
        })

    }

    render () {
        const likeId = this.props.likeId
        const classFill = likeId ? 'fas fa-heart' : 'far fa-heart'
        return (
            <button 
                onClick={this.toggleLike}
                aria-label="like/unlike">
                <i className={classFill}></i>
            </button>
        )
    }
}

export default LikeButton 