$(document).ready(function(){
	
	var datesForDisable = ["21/11/2023","24/11/2023","25/11/2023","30/11/2023"];
	//var datesAndTimesForDisable = {};
	var datesAndTimesForDisable = {
		"20/11/2023": ['12:00', '12:30', '13:00', '17:00'],
		"23/11/2023": ['19:00']};
	
    $('.datepicker').datepicker({
		datesDisabled: datesForDisable,
		language: "en",
		autoclose: true,
		format: "dd/mm/yyyy",
		startDate: '-0d'
	});
	
	$("#date" ).on( "change", function() {
		var txt='';
		$.each(datesAndTimesForDisable, function(key, value) {
			if($('#date').val()==key){
				txt+='Μη διαθέσιμες ώρες για αυτή τη μέρα.<br>'
				for(i in value){
					txt+=value[i]+'<br>'
				}	
			}			
	
		});
		document.getElementById("unavailableHours").innerHTML = txt;
	});
	
	
	
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
				$.each(datesAndTimesForDisable, function(key, value) {
			
					if($('#date').val()==key && $.inArray($('#time').val(), value)!=-1){
						unavailableHour=true;
						return false;
					}
					else
						unavailableHour=false;
	
				});
				
				if(unavailableHour){
					alert('Η ώρα που διαλέξατε δεν ειναι διαθέσιμη!');
					return;
				}
				
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
				
				sendEmail(mail);
				
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
