import React from 'react'
import FollowButton from './FollowButton';
import {getHeaders} from './utils'

class Suggestion extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            suggestion : props.model
        }
        this.refreshSuggestionDataFromServer = this.refreshSuggestionDataFromServer.bind(this)
    }

    refreshSuggestionDataFromServer () {
        const url = '/api/suggestions/'
        fetch(url, {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            console.log (data)
            this.setState({
                suggestion : data
            })
        })
    }

    render () {
        const user = this.state.suggestion;
        return(
            <section
                className='suggestion'>
                <div style={{display:"flex", alignItems:"center"}}>
                    <img src={user.image_url} style={{borderRadius:"50%", width:"40px", height:"40px", marginRight:"10px"}}/>
                    <div style={{display:"flex", justifyContent:"space-between", width:"400px"}}>
                        <div>
                            <p>{user.username}</p>
                            <p>suggested for you</p>
                        </div>
                        <FollowButton refreshSuggestion = {this.refreshSuggestionDataFromServer} userId={user.id} followId={null}/>
                    </div>
                    

                </div>
            </section>
        )
    }
}
export default Suggestion