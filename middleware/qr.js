var QRCode = require('qrcode')

module.exports = async function getQRCode(req, res, _address)
{
        var opts = 
        {
            type: 'image/jpeg',
            quality: 0.3,
            margin: 0.5,
            color: {
                dark:"#000000",
                light:"#FFFFFF"
            }
        }
        
        var qr = QRCode.toDataURL(_address, opts)
         
        return qr;
}

