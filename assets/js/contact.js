$(document).ready(function(){
	
	var datesForDisable = ["24/11/2023","25/11/2023","30/11/2023","25/12/2023","31/12/2023","01/01/2024"];
	//var datesAndTimesForDisable = {};
	var datesAndTimesForDisable = {
		"26/11/2023": ['10:00','10:30'],
		"27/11/2023": ['11:00','11:30','17:30'],
		"01/12/2023": ['20:00'],
		"02/12/2023": ['17:30'],
		"26/12/2023": ['10:00','10:30','11:00','11:30','12:00','12:30','13:00'],
		"02/01/2024": ['10:00','10:30','11:00','11:30','12:00','12:30','13:00']};                                            
	                                                                         
    $('.datepicker').datepicker({                                            
		datesDisabled: datesForDisable,                                      
		language: "en",
		autoclose: true,
		format: "dd/mm/yyyy",
		startDate: '-0d'
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
		
		//Display unavailable hours
		if(txt.length>0){
			document.getElementById("unavailableHours").innerHTML = 'Μη διαθέσιμη ώρες<br>'+txt;
		}
		else
			document.getElementById("unavailableHours").innerHTML = txt;
	});
	
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
				// $.each(datesAndTimesForDisable, function(key, value) {
			
					// if($('#date').val()==key && $.inArray($('#time').val(), value)!=-1){
						// unavailableHour=true;
						// return false;
					// }
					// else
						// unavailableHour=false;
	
				// });
				
				//selected date time validation in db case
				apps.forEach(function(appointment) {
					if($('#date').val()==appointment.date && $('#time').val()==appointment.time){
						unavailableHour=true;
						return false;
					}	
				});
				
				if(unavailableHour){
					alert('Η ώρα που διαλέξατε δεν ειναι διαθέσιμη!');
					return;
				}
				
				//email preperation
				var message = "<b>Ημερομηνία: "+$('#date').val()+"</b><br>"+
							  "<b>Ώρα: "+$('#time').val()+"</b><br>"+
							  "<b>Όνομα: "+$('#name').val()+"</b><br>"+
							  "<b>Τηλέφωνο: "+$('#phone').val()+"</b><br>"+
							  "<b>Υπηρεσία: "+$('#subject').val()+"</b><br>";
				
				var mail={ 
						SecureToken : "e423ce2a-a4db-4edf-b089-5d815ac80203",
						To : "pasxalis6444@gmail.com",
						From : "sakis530@hotmail.com",
						Subject : $('#subject').val(),
						Body : message 
					};	
				
				// Save data
				ref.push({date:$('#date').val(),
						time:$('#time').val(),
						name:$('#name').val()}).then(() => {
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
 

 
 
 var sendEmail=function(mail){
	 Email.send(mail).then(
	      function(message){
			if(message=='OK'){
				document.getElementById("afterEmail").innerHTML ='<div class="col-lg-8">'+
																		'<h2 class="contact-title">Το ραντεβού ολοκληρώθηκε. Ευχαριστούμε πολυ!</h2>'+
																	'</div>';
				document.getElementById("afterEmailErase").innerHTML = '<div></div>';
				setTimeout(() => {
					location.reload();
				}, "1000");
			}
			else{
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
