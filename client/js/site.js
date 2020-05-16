let userProfile;
let me = {
    name: ''
}
let comments = [];

const delay = 5;
function animateIn(el) {
    el.textContent = ''
    const chars = el.getAttribute('data-text').split('');
    let currentChar = 0;
    const timer = window.setInterval(function () {
        if (currentChar < chars.length) {
            let c = chars[currentChar];
            if (c === ' ') { c = ' ' }
            el.textContent += c
            currentChar++;
        } else {
            window.clearInterval(timer)
        }
    }, delay)
}
function animateOut(el) {
    const chars = el.getAttribute('data-text').split('');
    let currentChar = chars.length;
    const timer = window.setInterval(function () {
        if (currentChar > 0) {
            el.textContent = el.textContent.substring(0, el.textContent.length - 1)
            currentChar--;
        } else {
            window.clearInterval(timer)
        }
    }, delay)
}

function initAnimation() {
    const els = document.querySelectorAll('.animate')
    els.forEach(el => {
        el.setAttribute('data-text', el.textContent)
        el.textContent = '';
    })
}

function MeliWork(){
    var containerMeli = document.querySelector('[data-project="18"]').querySelector(".work-images .section-content");
    var obj = document.createElement('OBJECT');
   // obj.innerHTML = "Paragraph changed!";
    obj.setAttribute("data", "/Meli.html");
    obj.style.width = "900px";
    containerMeli.appendChild(obj);
}

MeliWork();

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
    controls.forEach((c) => {
        c.addEventListener('click', e => {
            e.target.classList.toggle('active');
            toggleSections(e.target.getAttribute('data-section'));
        })
    })
}

function toggleSections(section) {
    const targetSections = document.querySelectorAll(`.work-${section}`)
    console.log(targetSections)
    targetSections.forEach(s => {
        const content = s.querySelector('.animate')
        if (s.classList.contains('open')) {
            s.classList.remove('open')
            if (content) {
                animateOut(content)
            }
        } else {
            s.classList.add('open')
            if (content) {
                animateIn(content)
            }
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
    lbImage.setAttribute('src', e.target.getAttribute('src'))
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

function initWorks() {
    const works = document.querySelectorAll('.work')
    works.forEach((w) => {
        let openBracket = document.createElement('button')
        openBracket.classList.add('bracket')
        openBracket.innerText = '{'

        let closeBracket = document.createElement('button')
        closeBracket.innerText = '}'
        closeBracket.classList.add('bracket')

        w.insertAdjacentElement('beforebegin', openBracket)
        w.insertAdjacentElement('afterend', closeBracket)

        const id = w.getAttribute('data-project')
        const commentContainer = w.querySelector('.comments')
        let localComments = []
        // Render existing comments
        if (comments) {
            comments.forEach((c) => {
                if (c.project === id) {
                    localComments.push(c)
                }
            })
        }

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
            let openBracket = document.createElement('button')
            openBracket.classList.add('bracket')
            openBracket.innerText = s.getAttribute('data-brackets').split('')[0]
            const content = s.querySelector('.animate')
            openBracket.addEventListener('click', () => {
                if (s.classList.contains('open')) {
                    animateOut(content)
                } else {
                    animateIn(content)
                }
                s.classList.toggle('open')
            })

            let closeBracket = document.createElement('button')
            closeBracket.innerText = s.getAttribute('data-brackets').split('')[1]
            closeBracket.classList.add('bracket')
            closeBracket.addEventListener('click', () => {
                if (s.classList.contains('open')) {
                    animateOut(content)
                } else {
                    animateIn(content)
                }
                s.classList.toggle('open')
            })

            s.addEventListener('click', (e) => {
                s.nextElementSibling.classList.toggle('open')
            })

            s.insertAdjacentElement('beforebegin', openBracket)
            s.insertAdjacentElement('afterend', closeBracket)
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
    initLightbox()
    initAnimation()
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
