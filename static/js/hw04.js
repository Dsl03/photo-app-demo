const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

const profile2Html = profile => {
    return `
        <div>
            <img src="${ profile.thumb_url }" class="pic" alt="user profile pic for ${ profile.username }" />
            <p>${ profile.username }</p>
        </div>
    `;
};

// fetch data from your API endpoint:
const displayProfile = () => {
    fetch("/api/profile/", {
        // method: "GET",
        // headers: {
        //     'Content-Type': 'application/json',
        // }
    })
    .then(response => response.json())
    .then(profile =>  {
            const html = profile2Html(profile);
            document.querySelector('#user-profile').innerHTML = html;
    });
};

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
    fetch("/api/following/", {
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
    const deleteURL = `/api/following/${followingId}`;
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
    fetch('/api/suggestions/')
        .then(response => response.json())
        .then(users =>{
            console.log(users);
            const html = users.map(user2Html).join('\n')
            document.querySelector('#suggestions').innerHTML = html;

        })
}   

const initPage = () => {
    displayProfile();
    displayStories();
    getSuggestions();
   
};

// invoke init page to display stories:
initPage();