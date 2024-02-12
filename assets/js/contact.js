$(document).ready(function(){
	
	var datesForDisable = ["25/12/2023","31/12/2023","01/01/2024"];
	//var datesAndTimesForDisable = {};
	                                                                        
    $('.datepicker').datepicker({                                            
		datesDisabled: datesForDisable,                                      
		language: "en",
		autoclose: true,
		format: "dd/mm/yyyy",
		startDate: new Date()
	});
	
	// $("#date" ).on( "change", function() {
		// var txt='';
		// $.each(datesAndTimesForDisable, function(key, value) {
			// if($('#date').val()==key){
				// txt+='Μη διαθέσιμες ώρες για αυτή τη μέρα.<br>'
				// for(i in value){
					// txt+=value[i]+'<br>'
				// }	
			// }			
	
		// });
		// document.getElementById("unavailableHours").innerHTML = txt;
	// });
	
	//Date validation in db case
	$("#date" ).on( "change", function() {
		var txt='';
		var appointmentsToSort=[];
		
		var splittedDate=$('#date').val().split('/');
		var dateToCheck=new Date(splittedDate[2]+'-'+splittedDate[1]+'-'+splittedDate[0]);
		
		
		//Find unavailable hours
		apps.forEach(function(appointment) {
			if($('#date').val()==appointment.date){
				appointmentsToSort.push(appointment);
			}	
		});
		
		//Sort unavailable hours to display
		var sortedAppointments = sortAppointmentsOfCurrentDate(appointmentsToSort);
		sortedAppointments.forEach(function(appointment) {
			txt+=appointment.time+'<br>';
		});
		
		if(dateToCheck.getDay()==0||dateToCheck.getDay()==6){
			txt+='17:00-21:30';
		}
		
		//Display unavailable hours
		if(txt.length>0){
			document.getElementById("unavailableHours").innerHTML = 'Μη διαθέσιμη ώρες<br>'+txt;
		}
		else
			document.getElementById("unavailableHours").innerHTML = txt;
	});
	
	
	// let today = new Date();

	// // Extract date components
	// let dd = String(today.getDate()).padStart(2, '0');
	// let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
	// let yyyy = today.getFullYear();
	
	// // Extract time components
	// let hh = String(today.getHours()).padStart(2, '0');
	// let min = String(today.getMinutes()).padStart(2, '0');
	// let ss = String(today.getSeconds()).padStart(2, '0');
	
	// // Format the date and time as dd/mm/yyyy HH:MM:SS
	// let formattedDateTime = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
	// let myId=`${dd}${mm}${yyyy}${hh}${min}${ss}`
	
	//Database configuration
	const firebaseConfig = {
		databaseURL: "https://barbershop-76b04-default-rtdb.europe-west1.firebasedatabase.app",
	};
	
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	const database = firebase.database();
	
	const ref = database.ref("appointment");
	
	var apps=[]
	ref.orderByChild('date').once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var userData = childSnapshot.val();
			apps.push(userData);
		});
	});
	
	
	function sortAppointmentsOfCurrentDate(appointments){
		const formattedData = appointments.map(item => {
			const parts = item.date.split('/');
			const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T${item.time}`);
			return { ...item, formattedDate };
		});

		// Sort the array based on the 'formattedDate' property
		const sortedData = formattedData.sort((a, b) => a.formattedDate - b.formattedDate);
		
		// Extracting sorted data back to the original format (without 'formattedDate')
		const sortedResult = sortedData.map(({ formattedDate, ...rest }) => rest);
		
		return sortedResult
	}
	
    (function($) {
        "use strict";

    
	
	
    jQuery.validator.addMethod('answercheck', function (value, element) {
        return this.optional(element) || /^\bcat\b$/.test(value)
    }, "type the correct answer -_-");

    // validate contactForm form
    $(function() {
        $('#contactForm').validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                subject: {
                    required: true,
                    minlength: 4
                },
                number: {
                    required: true,
                    minlength: 5
                },
                phone: {
                    required: true,
                    minlength: 10,
					maxlength: 10
                },
            },
            messages: {
                name: {
                    required: "come on, you have a name, don't you?",
                    minlength: "your name must consist of at least 2 characters"
                },
                subject: {
                    required: "come on, you have a subject, don't you?",
                    minlength: "your subject must consist of at least 4 characters"
                },
                number: {
                    required: "come on, you have a number, don't you?",
                    minlength: "your Number must consist of at least 5 characters"
                },
                phone: {
                    required: "no phone, no message"
                },
				day: {
                    required: "um...yea, you have to select something to send this form."
                }
            },
            submitHandler: function(form) {
				var splittedDate=$('#date').val().split('/');
				var dateToCheck=new Date(splittedDate[2]+'-'+splittedDate[1]+'-'+splittedDate[0]);
				var splittedTime=$('#time').val().split(':');
				
				dateToCheck.setHours(splittedTime[0]);
				dateToCheck.setMinutes(splittedTime[1]);
				
				if(new Date()>dateToCheck){
					alert('Η ώρα που διαλέξατε έχει παρέλθει');
					return;
				}
				
				if(!$('#date').val()){
					alert('Παρακαλώ επιλέξτε ημερομηνία');
					return;
				}
				if($('#time').val()==null){
					alert('Παρακαλώ επιλέξτε Ώρα');
					return;
				}
				if($.inArray($('#date').val(), datesForDisable)==0){
					alert('Η ημερομηνία που διαλέξατε δεν είναι διαθέσιμη');
					return;
				}
				if($('#subject').val()==null){
					alert('Παρακαλώ επιλέξτε Περιποίηση');
					return;
				}
				var unavailableHour=false;
				
				
				//selected date time validation in db case
				apps.forEach(function(appointment) {
					if(($('#date').val()==appointment.date && $('#time').val()==appointment.time)||
					   (dateToCheck.getDay()==6 
						&& ($('#time').val()=="17:00"
							||$('#time').val()=="17:00"
							||$('#time').val()=="17:30"
							||$('#time').val()=="18:00"
							||$('#time').val()=="18:30"
							||$('#time').val()=="19:00"
							||$('#time').val()=="19:30"
							||$('#time').val()=="20:00"
							||$('#time').val()=="20:30"
							||$('#time').val()=="21:00"
							||$('#time').val()=="21:30"))||
					   (dateToCheck.getDay()==0 
						&& ($('#time').val()=="17:00"
							||$('#time').val()=="17:00"
							||$('#time').val()=="17:30"
							||$('#time').val()=="18:00"
							||$('#time').val()=="18:30"
							||$('#time').val()=="19:00"
							||$('#time').val()=="19:30"
							||$('#time').val()=="20:00"
							||$('#time').val()=="20:30"
							||$('#time').val()=="21:00"
							||$('#time').val()=="21:30"))){
						unavailableHour=true;
						return false;
					}	
				});
				
				if(unavailableHour){
					alert('Η ώρα που διαλέξατε δεν ειναι διαθέσιμη!');
					return;
				}
				
				var dateAndIdArray=setDateAndIdOnSubmit();
				
				//email preperation
				var message = "<b>Κωδικος Ραντεβου: "+dateAndIdArray[1]+"</b><br>"+
							  "<b>Ημερομηνία: "+$('#date').val()+"</b><br>"+
							  "<b>Ώρα: "+$('#time').val()+"</b><br>"+
							  "<b>Όνομα: "+$('#name').val()+"</b><br>"+
							  "<b>Τηλέφωνο: "+$('#phone').val()+"</b><br>"+
							  "<b>Υπηρεσία: "+$('#subject').val()+"</b><br>";
				
				var mail={ 
						SecureToken : "e423ce2a-a4db-4edf-b089-5d815ac80203",
						To : "sakis530@hotmail.com",
						From : "sakis530@hotmail.com",
						Subject : $('#subject').val(),
						Body : message 
					};	
				
				
				
				//Save data
				ref.push({
						  id: dateAndIdArray[1],
						  date:$('#date').val(),
						  time:$('#time').val(),
						  dateCreated: dateAndIdArray[0]}).then(() => {
					// Trigger email sending if data save successful
					sendEmail(mail);
				})
				.catch((error) => {
					console.error("Error saving data: ", error);
				});

            }
        })
    })
	
 })(jQuery)
 

var setDateAndIdOnSubmit=function(){
	let arrayToReturn=[];
	
	let today = new Date();

	// Extract date components
	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
	let yyyy = today.getFullYear();
	
	// Extract time components
	let hh = String(today.getHours()).padStart(2, '0');
	let min = String(today.getMinutes()).padStart(2, '0');
	let ss = String(today.getSeconds()).padStart(2, '0');
	
	// Format the date and time as dd/mm/yyyy HH:MM:SS
	let formattedDateTime = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
	let myId=`${dd}${mm}${yyyy}${hh}${min}${ss}`
	
	arrayToReturn.push(formattedDateTime);
	arrayToReturn.push(myId);
	return arrayToReturn;
}

 var sendEmail=function(mail){
	 Email.send(mail).then(
	      function(message){
			if(message=='OK'){
				alert('Το ραντεβού ολοκληρώθηκε. Ευχαριστούμε πολυ!');
				document.getElementById("afterEmail").innerHTML ='<div class="col-lg-8">'+
																		'<h2 class="contact-title">Το ραντεβού ολοκληρώθηκε. Ευχαριστούμε πολυ!</h2>'+
																	'</div>';
				document.getElementById("afterEmailErase").innerHTML = '<div></div>';
				setTimeout(() => {
					location.reload();
				}, "1000");
			}
			else{
				alert('Το ραντεβού δεν ολοκληρώθηκε. Ξαναπροσπαθήστε σε λιγο.');
				document.getElementById("afterEmail").innerHTML ='<div class="col-lg-8">'+
																		'<h2 class="contact-title">Το ραντεβού</h2><h2 class="contact-title" style="color:red">δεν ολοκληρώθηκε</h2>'+
																		'<h2 class="contact-title">Ξαναπροσπαθήστε σε λιγο.</h2>'+
																'</div>';
				document.getElementById("afterEmailErase").innerHTML = '<div></div>';
			}
		}
		);
 };
 
})
