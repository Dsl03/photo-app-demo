import React from 'react'
import {getHeaders} from './utils'
import Post from './post'

class Posts extends React.Component {

    constructor(props){
        super(props);
        this.state ={ 
            posts : []
        }
        this.getPostsFromServer()
    }
    getPostsFromServer(){
        fetch('/api/posts',{
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            this.setState({
                posts: data
            })
        })
    }

    componentDidMount(){

    }

    render () {
        return (
            <div id="posts">
                {
                    this.state.posts.map(post => {
                        return(
                            <Post key={'post_' + post.id} model={post}/>
                        )
                    })
                }
            </div>
        )
    }
}

export default Posts 