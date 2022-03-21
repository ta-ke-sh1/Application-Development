const imageFilter = function (req, file) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return false;
    }
    return true;
};
exports.imageFilter = imageFilter;