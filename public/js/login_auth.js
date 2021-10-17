window.addEventListener("DOMContentLoaded", () => {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyA_AwgiDcSqGIuo_qo-VhyDAZQTHttemas",
        authDomain: "talkative-auth.firebaseapp.com",
        projectId: "talkative-auth",
        storageBucket: "talkative-auth.appspot.com",
        messagingSenderId: "67852865807",
        appId: "1:67852865807:web:d30266b97f770b33ff6e7a",
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    document.getElementById("login").addEventListener("submit", (event) => {
        event.preventDefault();
        const login = event.target.username.value;
        const password = event.target.password.value;

        firebase
            .auth()
            .signInWithEmailAndPassword(login, password)
            .then(({
                user
            }) => {
                return user.getIdToken().then((idToken) => {
                    return fetch("/sessionLogin", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                        },
                        body: JSON.stringify({
                            idToken
                        }),
                    });
                });

            })
            .then(() => {
                return firebase.auth().signOut();
            })
            .then(() => {
                window.location.assign("/loggedin");
            });
        return false;

    });

    // signup code 
    document.getElementById('signup').addEventListener('submit',(event)=>{
        event.preventDefault();
        let password1 = event.target.signup_password.value.trim();
        let password2 = event.target.signup_confirm_password.value.trim();
        let email = event.target.email.value;
        
        if(password1 == password2){
            firebase
            .auth()
            .createUserWithEmailAndPassword(email, password1)
            .then(({user})=>{
                alert('user account created') 
                document.getElementById('sign-in-btn').click();  
            }).catch(err=>{
                alert(err)
            })

        }
        else{
            alert('password dont match')
        }

    })


});