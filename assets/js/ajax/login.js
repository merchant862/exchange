$(document).ready(function()
      {
            $("#loginForm").submit(function(event)
            {
                // Stop form from submitting normally
                event.preventDefault();
                
                /* Serialize the submitted form control values to be sent to the web server with the request */
                var formValues = $(this).serialize();
                
                

                $.ajax(
                {
                  url: "/login/",
                  type: "POST",
                  data: formValues ,
                  success: function (data, textStatus, errorThrown) 
                  {
                    console.log(data,textStatus);
                    $("#logRes").html('<div class="alert btn-success"><strong>Success!</strong>&nbsp;'+data.msg+'</div>')
                    $("#logRes").show().delay(5000).fadeOut();
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