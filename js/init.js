var messageDelay = 8000;  // How long to display status messages (in milliseconds)


// Init the form once the document is ready
$( init );


// Initialize the form

function init() {

  // Hide the form initially.
  // Make submitForm() the form's submit handler.
  // Position the form so it sits in the centre of the browser window.
  $('#contactForm').show().submit( submitForm ).addClass( 'positioned' );

  // When the "Send us an email" link is clicked:
  // 1. Fade the content out
  // 2. Display the form
  // 3. Move focus to the first field
  // 4. Prevent the link being followed

  $('a[href="#contactForm"]').click( function() {
    $('#contactForm').fadeTo( 'slow', .2 );
    $('#contactForm').fadeIn( 'slow', function() {
      $('#senderName').focus();
    } )

    return false;
  } );
  
}


// Contact form
$("#contactForm").validator().on("submit", function (event) {
	
	if (event.isDefaultPrevented()) {
	  // handle the invalid form...
	  formError();
	  submitMSG(false, "Please complete all the fields in the form before submitting.");
	} else {
	  // everything looks good!
	  event.preventDefault();
	  submitForm();
	}
 });


function submitForm(){
  // Initiate Variables With Form Content
  var name = $("#name").val();
  var email = $("#email").val();
  var message = $("#message").val();

  $.ajax({
	  type: "POST",
	  url: "process.php",
	  data: "name=" + name + "&email=" + email + "&message=" + message,
	  
	  success : function(text){
		  if (text == "success"){
			  formSuccess();
			} else {
			  formError();
			  submitMSG(false,text);
			}
		}
	});
}

function formSuccess(){
	$("#contactForm")[0].reset();
	submitMSG(true, "Message Sent!")
}

function formError(){
	$("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
	function(){
	  $(this).removeClass();
	});
}

function submitMSG(valid, msg){
	if(valid){
	  var msgClasses = "h3 text-center fadeInUp animated text-success";
	} else {
	  var msgClasses = "h3 text-center text-danger";
	}
	$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
}