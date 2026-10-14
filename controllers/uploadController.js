
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please upload a file',
      });
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  } catch (error) {
    next(error);
  }
};
