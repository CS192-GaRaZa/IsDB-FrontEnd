const express = require('express');
const logger = require('morgan');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary');

const app = express();

var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: 'isdb2017',
  api_key: '634533456144729',
  api_secret: 'TAxUs6pWr6807W-b08TY80BR3dk'
});

app.set('port', process.env.PORT || 12121);
app.use(express.static(__dirname + '/webapp'));
app.use(cookieParser());
app.use(logger('dev'));

app.get('/', (_, res) => {
  res.sendFile('webapp/index.html');
});

app.post('/upload', upload.single('file'), (req, res) => {
  const cookies = JSON.parse(req.cookies.isdb);
  const public_id = 'profile';

  const options = {
    public_id: public_id,
    folder: 'isdb/' + cookies.unique_id,
    overwrite: true,
    eager: [
      { format: 'jpg' }
    ]
  };

  cloudinary.uploader.upload(req.file.path, function(result) {
    res.send(JSON.stringify(result));
  }, options);
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
})
