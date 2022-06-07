import React from 'react'

const Profile = ({
    image,
    username
})=>{
    return (
        <div style={{display:"flex", marginTop:"20px"}}>
            <img src={image} style={{borderRadius: "50%", width:"65px", height:"65px", marginRight:"10px"}}/>
            <h1>{username}</h1>
        </div>
    )
}
export default Profile