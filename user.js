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
    getData(user);
  } else {
    // No user is signed in, handle this as needed
	document.getElementById("dataList").innerHTML = '<h1 style="color:red">Access Denied</h1>';
	document.getElementById("spinner").style.display = "none";
	document.getElementById("title").style.display = "none";
	document.getElementById("logOutButton").style.display = "none";
	document.getElementById("searchField").style.display = "none";
	document.getElementById("userInfoCard").style.display = "none";
    console.log("No user signed in.");
	setTimeout(()=>{window.location.href = "./login.html"}, "2000")
  }
});


function getData(user){
	
	const database = firebase.database();
	//const dataRef = database.ref("private_appointment");
	const dataRef = database.ref("appointment");
	const dataList = document.getElementById('dataList');
	
	userProfileInfos(user);
	
	var appointmentsCounter=0;
	dataRef.once('value').then((snapshot) => {
		snapshot.forEach((childSnapshot) => {
			const data = childSnapshot.val();
			const id = childSnapshot.key; // Get the ID (key)
			
			
			var currentFormattedDay=dateFormatting();
			if(data.date==currentFormattedDay){
				appointmentsCounter++;
			}
			
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
		progressBar(appointmentsCounter);
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

function searchAppointment(){
	const database = firebase.database();
	const dataRef = database.ref("appointment");
	
	const id=document.getElementById("appointmentId").value;
	
	if(!id){
		return alert('Παρακαλώ εισάγετε κωδικό ραντεβού');
	}
	
	dataRef.orderByChild('id').equalTo(id).once('value')
  .then(function(snapshot) {
	  if(snapshot.exists()){
		  snapshot.forEach(function(childSnapshot) {
			var appId = childSnapshot.key;
			window.location.href = "./details.html?id="+appId;
		  });
	  }
	  else
		  alert('Δεν βρέθηκε ραντεβού');
  })
  .catch(function(error) {
    console.error('Error fetching data:', error);
	alert('Error fetching data')
  });
  
}

function userProfileInfos(user, appointmentsCounter){
	
	//User info card
	var gmtTime = new Date(user.metadata.creationTime);
	const options = { timeZone: 'Europe/Athens', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
	const formatter = new Intl.DateTimeFormat('en-US', options);
	const creationFormattedDate = formatter.format(gmtTime);
	
	gmtTime = new Date(user.metadata.lastSignInTime);
	const lastSignInTimeFormattedDate = formatter.format(gmtTime);

	document.getElementById("cardDetails").innerHTML ='<div class="ms-2 c-details pl-2" id="cardDetails">'+
														'<h6 class="mb-0">'+user.email+'</h6> <span><b>Date Created:</b> '+creationFormattedDate+'</span><br>'+
														'<span><b>Last Sign In Date:</b> '+lastSignInTimeFormattedDate+'</span>'+
													'</div>';
	
}

function dateFormatting(){
	const dateString = new Date();
	const date = new Date(dateString);
	const day = date.getDate();
	const month = date.getMonth() + 1; // Adding 1 because January is represented as 0
	const year = date.getFullYear();
	
	// Padding zeros for single-digit day or month
	const formattedDay = day < 10 ? `0${day}` : day;
	const formattedMonth = month < 10 ? `0${month}` : month;
	
	return formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
}

function progressBar(appointmentsCounter){
	var barWidth = ((appointmentsCounter/17)*100).toFixed(2);	
	var availableAppointments=17-appointmentsCounter;
	
	if(barWidth>=80){
		document.getElementById("progressBar").innerHTML ='<div class="progress-bar bg-danger" role="progressbar" style="width:'+barWidth+'%" aria-valuenow="'+barWidth+'" aria-valuemin="0" aria-valuemax="100" id="progressBar">'+barWidth+'%</div>';
	}else
		document.getElementById("progressBar").innerHTML ='<div class="progress-bar" role="progressbar" style="width:'+barWidth+'%" aria-valuenow="'+barWidth+'" aria-valuemin="0" aria-valuemax="100" id="progressBar">'+barWidth+'%</div>';
	document.getElementById("fractionValue").innerHTML ='<span class="text2" id="percentValue">'+appointmentsCounter +' απο τα 17 ραντεβού ειναι <span class="text2" style="color:red">μη διαθεσιμα.</span></span>';
	document.getElementById("availableAppointments").innerHTML ='<span class="text2" id="availableAppointments">'+availableAppointments+' απο τα 17 ραντεβού ειναι <span class="text2" style="color:green">διαθεσιμα.</span></span>';
}