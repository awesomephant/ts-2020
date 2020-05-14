let userProfile;
let me = {
    name: ''
}
let comments = [];

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function getData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'GET',
    });
    return response.json();
}

function initAuth() {
    try {
        gapi.load('auth2', function () {
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            auth2 = gapi.auth2.init({
                client_id: '431294902057-8pcjs5j7qb6ija5a2680djplnp6ied7f.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
            });
            attachSignin(document.getElementById('js-signin'));
        });
    } catch (err) {
        console.log(err)
    }
}

function attachSignin(element) {
    try {

        auth2.attachClickHandler(element, {},
            function (googleUser) {
                onSignIn(googleUser)
            }, function (error) {
            });
    } catch (err) {
        console.log(err)
    }
}


function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;

    postData('/api/authenticate/', { token: id_token, socketID: socket.id })
        .then(data => {
            userProfile.innerText = profile.getName();
            me.name = profile.getName()
            document.body.classList.add('signed-in')
        });

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        document.body.classList.remove('signed-in')
        userProfile.innerText = ''
        socket.emit('signout', socket.id)
    });
}


function shuffle() {
    var container = document.querySelector(".works");
    var elementsArray = Array.prototype.slice.call(container.querySelectorAll('.work'));
    elementsArray.forEach(function (element) {
        container.removeChild(element);
    })
    shuffleArray(elementsArray);
    elementsArray.forEach(function (element) {
        container.appendChild(element);
    })
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
shuffle();


function initControls() {
    const controls = document.querySelectorAll('.controls .control');
    console.log(controls)
    controls.forEach((c) => {
        c.addEventListener('click', e => {
            e.target.classList.toggle('active');
            toggleSections(e.target.getAttribute('data-section'));
        })
    })
}

function toggleSections(section) {
    const targetSections = document.querySelectorAll(`.work-${section}`)
    targetSections.forEach(s => {
        s.classList.toggle('open')
    })
}

function ControlsPhone() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function UserList(users) {
    let fragment = new DocumentFragment();
    for (const key in users) {
        let u = users[key]
        let el = document.createElement('li')
        el.classList.add('site-user')
        el.innerText = u.given_name || u.id;
        el.setAttribute('data-auth', u.auth || 'false')
        fragment.appendChild(el)
    }
    return fragment;
}

function CommentList(comments) {
    let fragment = new DocumentFragment();
    comments.forEach((c) => {
        const li = document.createElement('li')
        const meta = document.createElement('aside')
        meta.classList.add('comment-meta')
        const content = document.createElement('span')
        meta.innerHTML = `<span class='comment-author'>${c.author.name} – ${c.created}</span>`
        li.classList.add('comment')
        content.classList.add('comment-content')
        content.innerText = c.text;

        li.appendChild(meta)
        li.appendChild(content)

        fragment.appendChild(li)
    })
    if (fragment.childElementCount > 1) {
        return fragment;
    } else if (fragment.childElementCount === 1) {
        return fragment.children[0];
    }
}

function initWorks() {
    const works = document.querySelectorAll('.work')
    works.forEach((w) => {
        const id = w.getAttribute('data-project')
        const commentContainer = w.querySelector('.comments')
        let localComments = []
        // Render existing comments
        comments.forEach((c) => {
            if (c.project === id) {
                localComments.push(c)
            }
        })

        let frag = CommentList(localComments);
        if (frag) {
            commentContainer.appendChild(frag)
        }

        // Bind comment form 
        const commentSubmit = w.querySelector('.comment-submit')
        commentSubmit.addEventListener('click', handleCommentSubmit)

        // Bind section events
        let sections = w.querySelectorAll('.work-section')
        sections.forEach((s) => {
            let expand = s.querySelector('.section-expand')
            if (expand) {
                expand.innerText = ''
                expand.addEventListener('click', (e) => {
                    expand.classList.toggle('active')
                    e.target.parentNode.nextElementSibling.classList.toggle('open')
                })
            }
        })
    })
}

function handleCommentSubmit(e) {
    const text = e.target.parentElement.querySelector('input');
    const id = e.target.parentElement.getAttribute('data-project');
    // We have to set the date here so we can send it out
    // to sockets without hitting the database, which will
    // have the canonical date.
    let now = new Date()
    const data = { project: id, text: text.value, author: me, created: now.toISOString() }
    socket.emit('comment', data)
    text.value = '';
}

window.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initControls();
    userProfile = document.querySelector('.auth-user')
    let userList = document.querySelector('.site-users')

    if (socket) {
        socket.on('connect', () => {
            me.name = socket.id;
            me.id = socket.id;
        });

        socket.on('users', (users) => {
            const lis = UserList(users);
            userList.innerHTML = ''
            userList.appendChild(lis)
        });

        socket.on('comment', (comment) => {
            const li = CommentList([comment]);
            const commentContainer = document.querySelector(`[data-project="${comment.project}"] .comments`)
            commentContainer.insertAdjacentElement('afterbegin', li)
        });
    }

    getData('/api/comments/').then(res => {
        comments = res.data;
        initWorks();
    })
})
