import React from 'react'

const NavBar =({
    title,
    username
}) => {
    return (
        <nav className="main-nav">
            <h1>{title}</h1>
            <ul>   
                <li><a href="/api">API Docs</a></li>
                <li><span>{username}</span></li>
                <li><a href="/logout">Sign out</a></li>
            </ul> 
        </nav>       
    );
}

export default NavBar