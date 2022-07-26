$(document).ready(function()
      {
            $("#updateMOB").submit(function(event)
            {
                // Stop form from submitting normally
                event.preventDefault();
                
                /* Serialize the submitted form control values to be sent to the web server with the request */
                var formValues = $(this).serialize();
                
                

                $.ajax(
                {
                  url: "/settings/mob",
                  type: "post",
                  data: formValues ,
                  success: function (data, textStatus, errorThrown) 
                  {
                    console.log(data,textStatus);
                    $("#mobRes").html('<div class="alert btn-primary"><strong>Success!</strong>&nbsp;'+data.msg+'</div>')
                    $("#mobRes").show().delay(2000).fadeOut();
                  },
                  error: function(jqXHR, textStatus, errorThrown) 
                  {
                    console.log(textStatus, jqXHR.responseJSON);
                    $("#mobRes").html('<div class="alert btn-danger"><strong>Error!</strong>&nbsp;'+jqXHR.responseJSON.msg+'</div>')
                    $("#mobRes").show().delay(2000).fadeOut();
                  }
                });
            });
        });