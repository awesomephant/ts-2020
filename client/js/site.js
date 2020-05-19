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

function initBackgroundColor() {
    window.addEventListener('mousemove', (e) => {
        if (e.clientX >= window.innerWidth / 2) {
            document.body.classList.add('alternateColours')
        } else {
            document.body.classList.remove('alternateColours')
        }
    });
}

function initFontToggles() {
    const toggles = document.querySelectorAll('.toggleTypeface')
    toggles.forEach(t => {
        t.addEventListener('click', () => {
            if (t.classList.contains('active')) {
                document.body.style.fontFamily = "";
                t.classList.remove('active')
            } else {
                t.classList.add('active')
                document.body.style.fontFamily = `${t.getAttribute('data-typeface')}, haas`
            }
        })
    })
}

function initControls() {
    const controls = document.querySelectorAll('.controls .control');
    controls.forEach((c) => {
        c.addEventListener('click', e => {
            if (e.target.classList.contains('active')) {
                e.target.classList.remove('active');
                toggleSections(e.target.getAttribute('data-section'), 'off');

            } else {
                e.target.classList.add('active');
                toggleSections(e.target.getAttribute('data-section'), 'on');
            }
        })
    })
}

function toggleSections(section, status) {
    const targetSections = document.querySelectorAll(`.work-${section}`)
    targetSections.forEach(s => {
        if (status === 'off') {
            s.classList.remove('open')
        } else if (status === 'on') {
            s.classList.add('open')
        }

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

function handleImageClick(e) {
    const lb = document.querySelector('.lightbox')
    const lbImage = lb.querySelector('img')
    lb.classList.add('active')
    lbImage.setAttribute('src', e.target.getAttribute('data-large'))
}

function initLightbox() {
    const lb = document.querySelector('.lightbox')
    const images = document.querySelectorAll('img')
    images.forEach(img => {
        img.addEventListener('click', handleImageClick)
    })
    lb.addEventListener('click', () => {
        lb.classList.remove('active')
    })
}

function renderComments(comments) {
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
    })
}

function initWorks() {
    const works = document.querySelectorAll('.work')
    works.forEach((w) => {
        let openBracket = document.createElement('span')
        openBracket.classList.add('bracket')
        openBracket.innerText = '['

        let closeBracket = document.createElement('span')
        closeBracket.innerText = ']'
        closeBracket.classList.add('bracket')
        closeBracket.classList.add('close-bracket')

        w.insertAdjacentElement('beforebegin', openBracket)
        w.insertAdjacentElement('afterend', closeBracket)

        // Bind comment form 
        const commentSubmit = w.querySelector('.comment-submit')
        commentSubmit.addEventListener('click', handleCommentSubmit)

        // Bind section events
        let sections = w.querySelectorAll('.work-section')
        sections.forEach((s) => {
            s.addEventListener('click', e => {
                const parent = s.closest("section")
                const nextSibling = parent.nextElementSibling
                const elementSibling = nextSibling.nextElementSibling
                const NextElementSibling = elementSibling.nextElementSibling
                NextElementSibling.classList.toggle('open')
            })

            let openBracket = document.createElement('span')
            openBracket.classList.add('bracket')
            openBracket.innerText = s.getAttribute('data-brackets').split('')[0]


            let closeBracket = document.createElement('span')
            closeBracket.innerText = s.getAttribute('data-brackets').split('')[1]
            closeBracket.classList.add('bracket')



            s.insertAdjacentElement('beforebegin', openBracket)
            s.insertAdjacentElement('afterend', closeBracket)
        })
    })
}

function handleCommentSubmit(e) {
    const text = e.target.parentElement.querySelector('.input');
    const id = e.target.parentElement.getAttribute('data-project');
    // We have to set the date here so we can send it out
    // to sockets without hitting the database, which will
    // have the canonical date.
    let now = new Date()
    const data = { project: id, text: text.textContent, author: me, created: now.toISOString() }
    socket.emit('comment', data)
    text.innerText = '';
}

window.addEventListener('DOMContentLoaded', () => {
    initAuth();
    shuffle();
    initWorks();
    initControls();
    initLightbox();
    initFontToggles();
    initBackgroundColor();

    toggleSections('description', 'on')

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
        if (comments){
            renderComments(comments)
        }
    })
})
