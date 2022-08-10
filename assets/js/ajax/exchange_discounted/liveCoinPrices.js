$(document).ready(function()
{
    const params = new URLSearchParams(window.location.search)

    var asset = params.get('asset')

    function url(_asset)
    {
        var url = "/price?asset="+_asset+"&percentage=70";
        return url;
    }

    const BTC = $.ajax(
        {
            url: url("BTC"),
            type: "get",
            success: function (data, textStatus, errorThrown) 
            {
            
                $("#btcusdt").html(data.price)
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                
                $("#btcusdt").html("00.00")
            }
        });
    
        const ETH = $.ajax(
            {
                url: url("ETH"),
                type: "get",
                success: function (data, textStatus, errorThrown) 
                {
                
                    $("#ethusdt").html(data.price)
                },
                error: function(jqXHR, textStatus, errorThrown) 
                {
                    
                    $("#ethusdt").html("00.00")
                }
            });
        
            const BNB = $.ajax(
                {
                    url: url("BNB"),
                    type: "get",
                    success: function (data, textStatus, errorThrown) 
                    {
                    
                        $("#bnbusdt").html(data.price)
                    },
                    error: function(jqXHR, textStatus, errorThrown) 
                    {
                        
                        $("#bnbusdt").html("00.00")
                    }
                });

                const SOL = $.ajax(
                    {
                        url: url("SOL"),
                        type: "get",
                        success: function (data, textStatus, errorThrown) 
                        {
                        
                            $("#solusdt").html(data.price)
                        },
                        error: function(jqXHR, textStatus, errorThrown) 
                        {
                            
                            $("#solusdt").html("00.00")
                        }
                    });

                    const DOT = $.ajax(
                        {
                            url: url("DOT"),
                            type: "get",
                            success: function (data, textStatus, errorThrown) 
                            {
                                $("#dotusdt").html(data.price)
                            },
                            error: function(jqXHR, textStatus, errorThrown) 
                            {
                                
                                $("#dotusdt").html("00.00")
                            }
                        });
       
        BTC,ETH,BNB,SOL,DOT;
});
