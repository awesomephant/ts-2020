let userProfile;
// Via: https://developers.google.com/identity/sign-in/web/build-button

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
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

window.addEventListener('DOMContentLoaded', () => {
    init();
    userProfile = document.querySelector('.auth-user')
    let userList = document.querySelector('.site-users')
    socket.on('connect', () => {
    });

    socket.on('users', (users) => {
        const lis = UserList(users);
        userList.innerHTML = ''
        userList.appendChild(lis)
    });
})
