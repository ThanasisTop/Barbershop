$(document).ready(function(){
	
	var datesForDisable = ["28/10/2023"]
	
    $('.datepicker').datepicker({
		datesDisabled: datesForDisable,
		language: "en",
		autoclose: true,
		format: "dd/mm/yyyy",
		startDate: '-0d'
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
                email: {
                    required: true,
                    email: true
                },
                // message: {
                    // required: true,
                    // minlength: 20
                // }
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
                email: {
                    required: "no email, no message"
                },
                // message: {
                    // required: "um...yea, you have to write something to send this form.",
                    // minlength: "thats all? really?"
                // },
				day: {
                    required: "um...yea, you have to select something to send this form."
                }
            },
            submitHandler: function(form) {
				if($('#date').val()==""){
					alert('Please select Date');
					return;
				}
				if($('#time').val()==null){
					alert('Please select Time');
					return;
				}
				if($.inArray($('#date').val(), datesForDisable)==0){
					alert('Invalid Date');
					return;
				}
					
                // $(form).ajaxsubmit({
                    // type:"post",
                    // data: $(form).serialize(),
                    // url:"contact_process.php",
                    // success: function() {
                        // $('#contactform :input').attr('disabled', 'disabled');
                        // $('#contactform').fadeto( "slow", 1, function() {
                            // $(this).find(':input').attr('disabled', 'disabled');
                            // $(this).find('label').css('cursor','default');
                            // $('#success').fadein()
                            // $('.modal').modal('hide');
		                	// $('#success').modal('show');
                        // })
                    // },
                    // error: function() {
                        // $('#contactform').fadeto( "slow", 1, function() {
                            // $('#error').fadein()
                            // $('.modal').modal('hide');
		                	// $('#error').modal('show');
                        // })
                    // }
                // })
				alert('email sent');
            }
        })
    })
        
 })(jQuery)
})