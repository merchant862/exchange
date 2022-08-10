$(document).ready(function()
      {
            $("#otpForm").submit(function(event)
            {
                // Stop form from submitting normally
                event.preventDefault();
                
                /* Serialize the submitted form control values to be sent to the web server with the request */
                var formValues = $(this).serialize();
                
                

                $.ajax(
                {
                  url: "/otp/",
                  type: "POST",
                  data: formValues ,
                  success: function (data, textStatus, errorThrown) 
                  {
                    window.location.assign(data.msg);
                  },
                  error: function(jqXHR, textStatus, errorThrown) 
                  {
                    console.log(textStatus, jqXHR.responseJSON);
                    $("#logRes").html('<div class="alert btn-danger"><strong>Error!</strong>&nbsp;'+jqXHR.responseJSON.msg+'</div>')
                    $("#logRes").show().delay(5000).fadeOut();
                  }
                });
            });
        });