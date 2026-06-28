import multer from 'multer';

const armazenamento = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage'); 
    },
    filename: function (req, file, cb) {
        let nomeNovo = Date.now() + '-' + Math.round(Math.random() * 1E9);
        let extensao = file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null, nomeNovo + extensao);
    }
});

const upload = multer({ storage: armazenamento });
export default upload;