$(document).ready(function() 
{
	$("#balance").keyup(function() 
    { 
        const params = new URLSearchParams(window.location.search)
        var asset = params.get('asset')
		
        $.ajax({
			type: "GET",
			url: "/price?asset="+asset+"&percentage=70",
			success: function (data, textStatus, errorThrown) 
            { 
                var value = document.getElementById("balance").value;
                document.getElementById("coin").value = (value/data.price).toFixed(2);
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                console.log(textStatus, jqXHR.responseJSON);
            }
		});
	});
});