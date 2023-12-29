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
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const childId = urlParams.get('id');
//const dataRef = database.ref('private_appointment').child(childId);
const dataRef = database.ref('appointment').child(childId);

function fetchChildById() {
   
  // Fetch the data once
  dataRef.once('value').then((snapshot) => {
    const childData = snapshot.val();
	document.getElementById("title").innerHTML = '<h5 class="card-title" id="title">Κωδικός Ραντεβού: '+childData.id+'</h5>';
	document.getElementById("datedetails").innerHTML = '<p class="card-text" id="datedetails">Ημερομηνία Ραντεβού: <b>'+childData.date+'</b></p>';
	document.getElementById("hourdetails").innerHTML = '<p class="card-text" id="hourdetails">Ώρα Ραντεβού: <b>'+childData.time+'</b></p>';
	document.getElementById("spinner").style.display = "none";
  })
  .catch((error) => {
	// Handle any errors
	document.getElementById("card").innerHTML = '<h1 style="color:red">Not Found</h1>';
	console.error("Error fetching data:", error);
});
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
	fetchChildById();
  } else {
    // No user is signed in, handle this as needed
	document.getElementById("spinner").style.display = "none";
	document.getElementById("card").innerHTML = '<h1 style="color:red">Access Denied</h1>';
    console.log("No user signed in.");
	setTimeout(()=>{window.location.href = "./login.html"}, "2000")
  }
});

function deleteAppointment(){

  // Remove the specific child by ID
  dataRef.remove()
    .then(() => {
      alert(`Το ραντεβού διαγραφηκε με επιτυχία.`);
	  window.location.href = "./user.html";
    })
    .catch((error) => {
      console.error(`Error deleting child with ID ${childId}:`, error);
	  alert('Delete failed')
    });
	
}