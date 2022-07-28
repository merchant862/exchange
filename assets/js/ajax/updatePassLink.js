$(document).ready(function()
      {
            $("#updatePassLink").submit(function(event)
            {
                // Stop form from submitting normally
                event.preventDefault();
                
                /* Serialize the submitted form control values to be sent to the web server with the request */
                var formValues = $(this).serialize();
                
                const params = new URLSearchParams(window.location.search)

                var token = params.get('token')

                $.ajax(
                {
                  url: "/update-pass/?token="+token,
                  type: "POST",
                  data: formValues ,
                  success: function (data, textStatus, errorThrown) 
                  {
                    console.log(data,textStatus,token);
                    $("#updateRes").html('<div class="alert btn-success"><strong>Success!</strong>&nbsp;'+data.msg+'</div>')
                    $("#updateRes").show().delay(5000).fadeOut();
                  },
                  error: function(jqXHR, textStatus, errorThrown) 
                  {
                    console.log(textStatus, jqXHR.responseJSON);
                    $("#updateRes").html('<div class="alert btn-danger"><strong>Error!</strong>&nbsp;'+jqXHR.responseJSON.msg+'</div>')
                    $("#updateRes").show().delay(5000).fadeOut();
                  }
                });
            });
        });