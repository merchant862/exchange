function amount(_amount,_percentage)
{
    $(document).ready(function() 
    {
        const params = new URLSearchParams(window.location.search)
        var asset = params.get('asset')
        
        $.ajax({
            type: "GET",
            url: "/price?asset="+asset,
            success: function (data, textStatus, errorThrown) 
            { 
                var percentage = (_amount/100)*_percentage
                document.getElementById("balance").value = percentage;
                document.getElementById("coin").value = (percentage/data.price).toFixed(2);
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                console.log(textStatus, jqXHR.responseJSON);
            }
        });
    });
}