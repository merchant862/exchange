const path = require('path'); 

const multer = require('multer');

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, './assets/uploads/')     // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
      callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
    
module.exports =  upload = multer(
    { 
        storage: storage,
        limits: 
        {
          fileSize : 5242880,
          files : 3,
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
    }).array("docs[]", 3);