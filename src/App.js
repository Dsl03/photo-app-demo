import React from 'react';
import NavBar from './navbar'
import {getHeaders} from './utils'
import Posts from './posts'
import Profile from './profile'
import Stories from './stories'
import Suggestions from './suggestions'



{/* TODO: Break up the HTML below into a series of React components. */}
class App extends React.Component {  
    constructor(props) {
        super(props);
        this.getProfileFromServer();
        this.state ={
            user: {}
        }
    }

    getProfileFromServer () {
        fetch('/api/profile',{
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            this.setState({
                user: data
            })
        })
    }
    render () {
        return (
            <div>
            
            <NavBar title="Photo App" username={this.state.user.username} />

            <aside>
                <Profile image={this.state.user.image_url} username={this.state.user.username}/>
                <div className="suggestions">
                    <p className="suggestion-text">Suggestions for you</p>
                    <Suggestions/>
                </div>
            </aside>

            <main className="content">
                <Stories/>
                <Posts/>
            </main>

            </div>
        );
    }
}

export default App;