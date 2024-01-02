//Database configuration
const firebaseConfig = {
apiKey: "AIzaSyB7COIXZWAOl9a2XyynwYb-uIasbu0NFn0",
authDomain: "barbershop-76b04.firebaseapp.com",
databaseURL: "https://barbershop-76b04-default-rtdb.europe-west1.firebasedatabase.app",
projectId: "barbershop-76b04",
storageBucket: "barbershop-76b04.appspot.com",
messagingSenderId: "503743576752",
appId: "1:503743576752:web:afc840af1ed3db3cc29975",
measurementId: "G-X4PKNN2H94"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    window.location.href = "./user.html";
  }
});

function LogIn()
{	
	event.preventDefault();
	var username = document.getElementById("Email").value;
	var pass = document.getElementById("Password").value;
	
	firebase.auth().signInWithEmailAndPassword(username, pass)
				.then((userCredential) => {
					// Signed in
					var user = userCredential.user;
					window.location.href = "./user.html";
				})
				.catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					alert(errorMessage);
				});	
}

