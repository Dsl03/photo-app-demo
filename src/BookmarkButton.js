import React from 'react'
import {getHeaders} from './utils'

class BookmarkButton extends React.Component {

    constructor(props){
        super(props);
        this.toggleBookmark = this.toggleBookmark.bind(this)
        this.createBookmark = this.createBookmark.bind(this)
        this.removeBookmark = this.removeBookmark.bind(this)

    }

    componentDidMount(){

    }

    toggleBookmark () {
        console.log("wtf")
        if (this.props.bookmarkId) {
            this.removeBookmark()
        }
        else{
            this.createBookmark()
        }
    }

    createBookmark () {
        const url = '/api/bookmarks'
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

    removeBookmark () {
        const url = '/api/bookmarks/' + this.props.bookmarkId
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
        const bookmarkId = this.props.bookmarkId
        const classFill = bookmarkId ? 'fas fa-bookmark' : 'far fa-bookmark'
        return (
            <button 
                onClick={this.toggleBookmark}
                aria-label="bookmark/unbookmark">
                <i className={classFill}></i>
            </button>
        )
    }
}

export default BookmarkButton 