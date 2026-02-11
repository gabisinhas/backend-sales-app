export class UploadController {
  async upload(req, res) {
    if (!req.file) {
      return res.status(400).json({
        error: "File is required"
      });
    }

    const message = {
      filePath: req.file.path,
      originalName: req.file.originalname,
      uploadedAt: new Date().toISOString()
    };

    console.log("File uploaded:", message);

    return res.status(202).json({
      message: "File uploaded successfully",
      data: message
    });
  }
}
