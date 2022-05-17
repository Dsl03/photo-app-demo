const toggleFollow = ev => {
    const elem = ev.currentTarget;


    if (elem.innerHTML === "follow"){
        createFollower(elem.dataset.userId, elem)
    }
    else {
        deleteFollower(elem.dataset.followingId, elem)
    }
}

const createFollower = (userId, elem) => {
    const postData = {
        "user_id":userId
    }
    fetch("https://photo-app-396nu.herokuapp.com/api/following/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        elem.innerHTML = "unfollow"
        elem.setAttribute('aria-checked', 'true')
        elem.classList.add('unfollow')
        elem.classList.remove('follow')
        elem.setAttribute('data-following-id', data.id)
    });

}

const deleteFollower = (followingId,elem) => {
    const deleteURL = `https://photo-app-396nu.herokuapp.com/api/following/${followingId}`;
    fetch(deleteURL, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        elem.innerHTML = "follow"
        elem.classList.add('follow')
        elem.classList.remove('unfollow')
        elem.removeAttribute('data-following-id')  
        elem.setAttribute('aria-checked', 'fa;se') 
    });
}

const user2Html = user => {
    return`
    <div class="suggestion">
        <img src="${user.thumb_url}" />
        <div>
            <p class="username">${user.username}</p>
            <p class="suggestion-text">Suggested for you</p>
        </div>
        <div>
            <button aria-label="Follow" aria-checked="false" class="follow" data-user-id="${user.id}" onClick="toggleFollow(event);">follow</button>
        </div>
    </div>
    `;
}

const getSuggestions = () => {
    fetch('https://photo-app-396nu.herokuapp.com/api/suggestions/')
        .then(response => response.json())
        .then(users =>{
            console.log(users);
            const html = users.map(user2Html).join('\n')
            document.querySelector('#suggestions').innerHTML = html;

        })
}

getSuggestions();