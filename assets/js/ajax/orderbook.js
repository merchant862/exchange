$(document).ready(function()
{
    const params = new URLSearchParams(window.location.search)

    var asset = params.get('asset')

    function bars() 
    {
        var bars = 
        [
            "green-bg",
            "green-bg-5",
            "green-bg-8",
            "green-bg-10",
            "green-bg-20",
            "green-bg-40",
            "green-bg-60",
            "green-bg-80",
        ];

        return bars[Math.floor(Math.random() * bars.length)]
    }
    
    $.ajax(
        {
            url: "/depth?asset="+asset,
            type: "GET",
            success: function (data, textStatus, errorThrown) 
            {
                //orderBookBid
                for(i = 0; i < data.bids.length; i++)
                {
                    $("#orderBookBid").append('<tr class="'+bars()+'"><td class="green">'+parseFloat((data.bids[i]["0"]/100)*70).toFixed(2)+'</td><td>'+data.bids[i]["1"]+'</td></tr>')
                }
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                
                $("#orderBookBid").html("00.00")
            }
        });
});
