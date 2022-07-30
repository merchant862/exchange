$(document).ready(function()
      {
            $("#kycForm").submit(function(event)
            {
                // Stop form from submitting normally
                event.preventDefault();
                
                /* Serialize the submitted form control values to be sent to the web server with the request */
                var formValues = $(this).serialize(); 
                var formData = new FormData();
                formData.append('file', $('#docs')[0].files[0]);
                formData.append('file', $('#docs')[0].files[1]); 
                
                
                $.ajax(
                {
                  url: "/kyc/",
                  type: "POST",
                  data: formValues,
                  success: function (data, textStatus, errorThrown) 
                  {
                    console.log(data,textStatus);
                    $("#kycRes").html('<div class="alert btn-success"><strong>Success!</strong>&nbsp;'+data.msg+'</div>')
                    $("#kycRes").show().delay(5000).fadeOut();
                  },
                  error: function(jqXHR, textStatus, errorThrown) 
                  {
                    console.log(textStatus, jqXHR.responseJSON);
                    $("#kycRes").html('<div class="alert btn-danger"><strong>Error!</strong>&nbsp;'+jqXHR.responseJSON.msg+'</div>')
                    $("#kycRes").show().delay(5000).fadeOut();
                  }
                });
            });
        });