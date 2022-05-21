const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

const handleBookmark = ev => {
    const elem = ev.currentTarget;
    console.log("Handle bookmark functionality")

    if (elem.getAttribute('aria-checked') === 'true') {
        unbookmarkPost(elem);
    } else {
        console.log('bookmark post');
        bookmarkPost(elem);

    }
};

const renderLikeButton = post => {
    if (post.current_user_like_id) {
        return `
        <button 
            data-post-id = "${post.id}"
            data-like-id = "${post.current_user_like_id}"
            aria-label = "Like/ Unlike"
            aria-checked = "true"
            onclick ="handleLike(event);">
            <i class = "fas fa-heart"></i>
        </button>
        `;
    } else {
        return  `
        <button 
            data-post-id = "${post.id}"
            data-like-id = "${post.current_user_like_id}"
            aria-label = "Like/ Unlike"
            aria-checked = "false"
            onclick ="handleLike(event);">
            <i class = "far fa-heart"></i>
        </button>
        `;
    }
}; 

const renderBookmarkButton = post => {
    if (post.current_user_bookmark_id) {
        return `
        <button 
            data-post-id = "${post.id}"
            data-bookmark-id = "${post.current_user_bookmark_id}"
            aria-label = "Bookmark/ Unbookmark"
            aria-checked = "true"
            onclick ="handleBookmark(event);">
            <i class = "fas fa-bookmark"></i>
        </button>
        `;
    } else {
        return  `
        <button 
            data-post-id = "${post.id}"
            data-like-id = "${post.current_user_bookmark_id}"
            aria-label = "Bookmark/ Unbookmark"
            aria-checked = "false"
            onclick ="handleBookmark(event);">
            <i class = "far fa-bookmark"></i>
        </button>
        `;
    }
}; 

const handleLike = ev => {
    const elem = ev.currentTarget;
    console.log("Handle like functionality")

    if (elem.getAttribute('aria-checked') === 'true') {
        unlikePost(elem);
    } else {
        console.log('like post');
        likePost(elem);

    }
    
};


const unlikePost = elem => {
    console.log('unlike post');
    const postId = elem.dataset.postId
    fetch(`/api/posts/likes/${elem.dataset.likeId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        redrawPost(postId)

    });
    

};


const unbookmarkPost = elem => {
    console.log('unbookmark post');
    const postId = elem.dataset.postId
    fetch(`/api/bookmarks/${elem.dataset.bookmarkId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        redrawPost(postId)

    });
    

};
const redrawPost = (postId, callback) => {
    fetch(`api/posts/${postId}`)
        .then(response => response.json())
        .then(updatedPost => {
            if (! callback){
                redrawCard(updatedPost);
            } else {
                callback(updatedPost);
            }
        })
};

const redrawCard = post => {
    console.log(post);
    const html = post2Html(post);
    const newElement = stringToHTML(html);
    const postElement = document.querySelector(`#post_${post.id}`);
    console.log(newElement.innerHTML);
    postElement.innerHTML = newElement.innerHTML;
};

const likePost = elem => {
    console.log('like post', elem);
    const postId = Number(elem.dataset.postId);

    const postData = {
        "post_id": postId
    }

    console.log(postData)
    fetch(`/api/posts/likes/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        redrawPost(postId)
    });

};

const bookmarkPost = elem => {
    console.log('bookmark post', elem);
    const postId = Number(elem.dataset.postId);

    const postData = {
        "post_id": postId
    }

    console.log(postData)
    fetch(`/api/bookmarks/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        redrawPost(postId)
    });

};

const stringToHTML = htmlString => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.firstChild;
}

const displayComments = post => {
    if (post.comments.length  > 1){
        //display button
        //return first comment
        
        return `
        <div>
            <button data-post-id=${post.id} onclick="showModal(event)">View All ${post.comments.length} Comments</button>
            <p>${post.comments[post.comments.length-1].text}</p>
        </div>`
    }
    else if (post.comments.length === 1){
        return `<p>${post.comments[0].text}</p>`
    }
    else{
        return ""
    }
}

const showModal = ev => {
    const postId = Number(ev.currentTarget.dataset.postId);
    redrawPost(postId, post => {
        const html = post2Modal(post);
        document.querySelector(`#post_${post.id}`).insertAdjacentHTML('beforeend', html);
    })
    
}

const post2Html = post => {
    return `
    <section id="post_${post.id}" class = "card">
        <img src="${post.image_url }"  />
        <div class = "button-container">
            ${renderLikeButton(post)}
            ${renderBookmarkButton(post)}

        </div>
        <p>${post.caption }</p>
        ${displayComments(post)}
        <input id="comment${post.id}" type="text" placeholder="Add a Comment...">
        <button onclick="addComment(${post.id }, document.querySelector('#comment${post.id}').value)">Add comment</button>
    </section>
`;

};

const post2Modal = post => {
    return `
    <div class ="modal-bg" aria-hidden="false" role="dialog">
        <section class="modal">
            <button class="close" aria-label="Close the modal window" onclick="closeModal(event);">Close</button>
            <img src="${post.image_url}"/>
        </section>
    </div>
    `
}

const closeModal = ev =>{
    console.log("close modal")
    document.querySelector('.modal-bg').remove();

}
const displayPosts = () => {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            console.log(posts);
            const html = posts.map(post2Html).join('\n');
            document.querySelector('#posts').innerHTML = html;
        })
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
        <div class = "profile">
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
        console.log(data)
        elem.innerHTML = "unfollow"
        elem.setAttribute('aria-checked', 'true')
        elem.classList.add('unfollow')
        elem.classList.remove('follow')
        elem.setAttribute('data-following-id', data.id)
    });

}

const addComment = (postId, text) => {
    const postData = {
        "post_id": postId,
        "text": text
    }
    fetch("/api/comments",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        redrawPost(postId)
    })
}

const deleteFollower = (followingId,elem) => {
    const deleteURL = `/api/following/${followingId}`;
    fetch(deleteURL, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        elem.innerHTML = "follow"
        elem.classList.add('follow')
        elem.classList.remove('unfollow')
        elem.removeAttribute('data-following-id')  
        elem.setAttribute('aria-checked', 'false') 
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
    displayPosts();
    displayProfile();
    displayStories();
    getSuggestions();
   
};

// invoke init page to display stories:
initPage();