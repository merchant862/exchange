$(document).ready(function()
      {
            $("#kycForm").submit(function(event)
            {
                // Stop form from submitting normally
                event.preventDefault();

                var formData = new FormData();
                
                var totalfiles = document.getElementById('docs').files.length;
                
                for (var x = 0; x < totalfiles; x++) 
                {
                    formData.append("docs[]", document.getElementById('docs').files[x]);
                }
                
                

                $.ajax(
                { 
                  url: "/kycCard/",
                  type: "POST",
                  data: formData,
                  dataType: 'json',
            
                  Cache: false,
                  processData: false,
                  contentType: false,

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