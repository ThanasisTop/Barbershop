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

//Check if user exist
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    getData();
  } else {
    // No user is signed in, handle this as needed
	document.getElementById("dataList").innerHTML = '<h1 style="color:red">Access Denied</h1>';
	document.getElementById("spinner").style.display = "none";
	document.getElementById("title").style.display = "none";
	document.getElementById("logOutButton").style.display = "none";
    console.log("No user signed in.");
	setTimeout(()=>{window.location.href = "./login.html"}, "2000")
  }
});

function getData(){
	const database = firebase.database();
	//const dataRef = database.ref("private_appointment");
	const dataRef = database.ref("appointment");
	
	const dataList = document.getElementById('dataList');
	
	dataRef.once('value').then((snapshot) => {
		snapshot.forEach((childSnapshot) => {
			const data = childSnapshot.val();
			const id = childSnapshot.key; // Get the ID (key)
	
			// Create list item element
			const listItem = document.createElement('li');
			listItem.className = 'list-group-item';
			
			// Create anchor tag and set href
			const anchor = document.createElement('a');
			anchor.href = `details.html?id=${id}`; // Replace 'details.html' with your desired link and parameters
			anchor.textContent = `Κωδικός Ραντεβού: ${data.id}`; // Display ID and data
			// Replace 'yourProperty' with the property name in your data
	
			// Append anchor tag to list item
			listItem.appendChild(anchor);
			
			//listItem.textContent = `Id:${id}, Appointment ID: ${data.id}, Date: ${data.date}`; // Display ID and data
			// Replace 'yourProperty' with the property name in your data
	
			// Append list item to the list
			document.getElementById("spinner").style.display = "none";
			dataList.appendChild(listItem);
			
		});
	})
	.catch((error) => {
		// Handle any errors
		document.getElementById("dataList").innerHTML = '<h1 style="color:red">Access Denied</h1>';
		console.error("Error fetching data:", error);
		document.getElementById("spinner").style.display = "none";
	});

}

function LogOut(){
	firebase.auth().signOut().then(() => {
	// Sign-out successful.
		window.location.href = "./login.html";
	}).catch((error) => {
	// An error happened.
	});
}
