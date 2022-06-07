import React from 'react'
import {getHeaders} from './utils'

class FollowButton extends React.Component {

    constructor(props){
        super(props);
        this.toggleFollow = this.toggleFollow.bind(this)
        this.createFollow = this.createFollow.bind(this)
        this.removeFollow = this.removeFollow.bind(this)
        this.state={
            followId: null
        }

    }

    componentDidMount(){

    }

    toggleFollow () {
        console.log(this.state.followId)
        if (this.state.followId === null) {
            this.createFollow()
        }
        else{
            this.removeFollow()
        }
    }

    createFollow () {
        const url = '/api/following/'
        const postData = {
            user_id : this.props.userId
        }
        fetch(url, {
            headers : getHeaders(),
            method: 'POST',
            body: JSON.stringify(postData)
        }).then(reponse => reponse.json())
        .then(data => {
            console.log(data)
            this.setState({
                followId: data.id
            })
        })
    }

    removeFollow () {
        const url = '/api/following/' + this.state.followId
        fetch(url, {
            headers : getHeaders(),
            method: 'DELETE'
        }).then(reponse => reponse.json())
        .then(data => {
            console.log(data)
            this.setState({
                followId: null
            })
        })

    }

    render () {
        const followId = this.state.followId
        const classFill = followId===null ? "follow" : "unfollow"
        return (
            <button 
                onClick={this.toggleFollow}
                aria-label="follow/unfollow">
                {classFill}
            </button>
        )
    }
}

export default FollowButton 