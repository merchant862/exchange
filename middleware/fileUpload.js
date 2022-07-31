const multer = require('multer');

var storage = multer.memoryStorage({})
    
module.exports =  upload = multer(
    { 
        storage: storage,
        limits: 
        {
          fileSize : 5242880,
          files : 2,
        },
        fileFilter: (req, file, cb) => 
        {
            if (
                file.mimetype == "image/png" || 
                file.mimetype == "image/jpg" || 
                file.mimetype == "image/jpeg"
                ) 
            {
              cb(null, true);
            } 
            
            else 
            {
              cb(null, false);
              return cb(new Error('Files other than .png, .jpg and .jpeg are not allowed!'));
            }
        },
    }).array("docs[]", 2);