let userProfile;
// Via: https://developers.google.com/identity/sign-in/web/build-button

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
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Email: ' + profile.getEmail());

    userProfile.innerText = profile.getName();
    document.body.classList.add('signed-in')
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        document.body.classList.remove('signed-in')
        userProfile.innerText = ''
    });
}


window.addEventListener('DOMContentLoaded', () => {
    init();
    userProfile = document.querySelector('.auth-user')
})
