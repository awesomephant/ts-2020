let userProfile;
let me = {
    name: ''
}
// Via: https://developers.google.com/identity/sign-in/web/build-button

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

function init() {
    gapi.load('auth2', function () {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '431294902057-8pcjs5j7qb6ija5a2680djplnp6ied7f.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
        });
        attachSignin(document.getElementById('js-signin'));
    });
}

function attachSignin(element) {
    console.log(element.id);
    auth2.attachClickHandler(element, {},
        function (googleUser) {
            onSignIn(googleUser)
        }, function (error) {
            alert(JSON.stringify(error, undefined, 2));
        });
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
    var elementsArray = Array.prototype.slice.call(container.getElementsByClassName('work'));
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

function ControlsEventOpen() {
    if ($(".work-open").hasClass("open")){
        $(".work-open").removeClass("open");
    }else {
 $(".work-open").addClass("open");
    }
}
function ControlsEventClose() {
 $(".work-section").toggleClass("open");
 if (!$(".work-open").hasClass("open")){
  $(".work-open").addClass("open");
 }
}

function ControlsDescriptionOpen() {
    if ($(".work-title").hasClass("open")){
        $(".work-title").removeClass("open");
    }else {
 $(".work-title").addClass("open");
    }
}
function ControlsDescriptionClose() {
    $(".work-section").toggleClass("open");
    if (!$(".work-title").hasClass("open")){
    $(".work-title").addClass("open");
    }
}

function ControlsAuthorOpen() {
    if ($(".work-description").hasClass("open")){
        $(".work-description").removeClass("open");
    }else {
 $(".work-description").addClass("open");
    }
}
function ControlsAuthorClose() {
    $(".work-section").toggleClass("open");
        if (!$(".work-description").hasClass("open")){
        $(".work-description").addClass("open");
    }
}

function ControlsImageOpen() {
    if ($(".work-author").hasClass("open")){
        $(".work-author").removeClass("open");
    }else {
 $(".work-author").addClass("open");
    }
}
function ControlsImageClose() {
    $(".work-section").toggleClass("open");
        if (!$(".work-author").hasClass("open")){
        $(".work-author").addClass("open");
    }
}

function ControlsCommentsOpen() {
    if ($(".work-images").hasClass("open")){
        $(".work-images").removeClass("open");
    }else {
 $(".work-images").addClass("open");
    }
}
function ControlsCommentsClose() {
    $(".work-section").toggleClass("open");
        if (!$(".work-images").hasClass("open")){
        $(".work-images").addClass("open");
    }
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
    } else {
        return fragment.children[0];
    }
}

function initWorks() {

    const works = document.querySelectorAll('.work')
    works.forEach((w) => {
        let sections = w.querySelectorAll('.work-section')
        sections.forEach((s) => {
            let expand = s.querySelector('.section-expand')
            if (expand) {
                expand.innerText = '+'
                expand.addEventListener('click', (e) => {
                    e.target.parentElement.classList.toggle('open')
                })
            }
        })
    })
}

function SmallScreen(x) {
  if (x.matches) {
    $('.section-expand').html('+');
    $(".work-section").addClass("open");
    $(".title-control").click(ControlsEventClose);
    $(".description-control").click(ControlsDescriptionClose);
    $(".author-control").click(ControlsAuthorClose);
    $(".images-control").click(ControlsImageClose);
    $(".comments-control").click(ControlsCommentsClose);
  } else {
    $(".work-section").removeClass("open");
    initWorks();
    $(".title-control").click(ControlsEventOpen);
    $(".description-control").click(ControlsDescriptionOpen);
    $(".author-control").click(ControlsAuthorOpen);
    $(".images-control").click(ControlsImageOpen);
    $(".comments-control").click(ControlsCommentsOpen);
  }
}
var x = window.matchMedia("(max-width: 600px)")
SmallScreen(x) 
x.addListener(SmallScreen)

function handleCommentSubmit(e) {
    let text = e.target.parentElement.querySelector('input').value;

    // We have to set the date here so we can send it out
    // to sockets without hitting the database, which will
    // have the canonical date.

    let now = new Date()
    socket.emit('comment', { text: text, author: me, created: now.toISOString() })
}

window.addEventListener('DOMContentLoaded', () => {
    init();
    userProfile = document.querySelector('.auth-user')
    let userList = document.querySelector('.site-users')
    let commentList = document.querySelector('#comment-list')
    let commentSubmit = document.querySelector('#comment-submit')

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
        console.log(comment)
        const li = CommentList([comment]);
        commentList.insertAdjacentElement('afterbegin', li)
    });

   // initWorks();

    commentSubmit.addEventListener('click', handleCommentSubmit)
    getData('/api/comments?project=0').then(res => {
        const lis = CommentList(res.data)
        commentList.appendChild(lis)
    })
})
