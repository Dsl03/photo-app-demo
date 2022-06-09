import React from 'react'
import {getHeaders} from './utils'

class AddComment extends React.Component{

    constructor(props){
        super(props)
        this.state = {value: ""}
        this.handleChange = this.handleChange.bind(this);
        this.AddComment = this.AddComment.bind(this);
        this.retf = this.retf.bind(this);
    
    }

    handleChange(event){
        this.setState({value: event.target.value});
    }

    AddComment(){
        const postData = {
            "post_id": this.props.postId,
            "text": this.state.value
        };
        
        fetch("/api/comments", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(postData)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.props.refreshPost()
                
            });        
    }
    retf(){
        return false
    }
    render () {
        return(
            <form onSubmit={this.retf}>
                <label>
                    Add a Comment
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
                </label>
                <button type="button" onClick={this.AddComment}>Post</button>
            </form>
        )
    }
}

export default AddComment