import React from 'react'
import {getHeaders} from './utils'
import Suggestion from './suggestion'

class Suggestions extends React.Component{
    constructor(props){
        super(props)
        this.state={
            suggestions : []
        }
        this.getSuggestionsFromServer()
    }

    getSuggestionsFromServer(){
        fetch("/api/suggestions/", {
            method: "GET",
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            this.setState({
                suggestions : data
            })
        });
    }

    render () {
        return (
            <div class = "suggestions">
                {
                    this.state.suggestions.map(suggestion => {
                        return(
                            <Suggestion key={'suggestion_'+suggestion.id} model={suggestion}/>
                        )
                    })
                }
            </div>
        )
    }
}

export default Suggestions