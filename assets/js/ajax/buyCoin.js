$(document).ready(function()
      {
            $("#buyCoin").submit(function(event)
            {
                // Stop form from submitting normally
                event.preventDefault();
                
                /* Serialize the submitted form control values to be sent to the web server with the request */
                var formValues = $(this).serialize();
                
                const params = new URLSearchParams(window.location.search)

                var asset = params.get('asset')

                $.ajax(
                {
                  url: "/exchange/"+asset,
                  type: "post",
                  data: formValues ,
                  success: function (data, textStatus, errorThrown) 
                  {
                    console.log(data,textStatus);
                    $("#buyRes").html('<div class="alert btn-success"><strong>Success!</strong>&nbsp;'+data.msg+'</div>')
                    $("#buyRes").show().delay(5000).fadeOut();
                  },
                  error: function(jqXHR, textStatus, errorThrown) 
                  {
                    console.log(textStatus, jqXHR.responseJSON);
                    $("#buyRes").html('<div class="alert btn-danger"><strong>Error!</strong>&nbsp;'+jqXHR.responseJSON.msg+'</div>')
                    $("#buyRes").show().delay(5000).fadeOut();
                  }
                });
            });
        });