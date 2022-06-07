import React from 'react'
import {getHeaders} from './utils'

class Stories extends React.Component{
    constructor(props){
        super(props)
        this.state ={ 
            stories : []
        }
        this.getStoriesFromServer()

    }

    getStoriesFromServer(){
        fetch("/api/stories/", {
            method: "GET",
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            this.setState({
                stories: data
            })
        });
    }

    render () {
        return(
            <div class="stories">
                {
                    this.state.stories.map(story => {
                        return(
                            <div>
                                <img src={story.user.image_url} style={{borderRadius:"50%", width:"50px", height:"50px"}}/>
                                <p>{story.user.username}</p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default Stories