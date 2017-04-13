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
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/webapp'));
app.use(cookieParser());
app.use(logger('dev'));

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.get('/', (_, res) => {
  const openUI5CDN = (app.get('env') === 'development')
      ? 'resources/sap-ui-core.js'
      : 'https://sapui5.hana.ondemand.com/1.44.9/resources/sap-ui-core.js';

  res.render('index', { openUI5CDN });
});

app.post('/upload', upload.single('file'), (req, res) => {
  const cookies = JSON.parse(req.cookies.isdb);
  const public_id = 'profile';

  const options = {
    public_id: public_id,
    folder: 'isdb/' + cookies.unique_id,
    overwrite: true,
    format: 'jpg',
    width: 500,
    height: 500,
    crop: 'pad',
    background: 'white'
  };

  cloudinary.uploader.upload(req.file.path, function(result) {
    res.send(JSON.stringify(result));
  }, options);
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
})
