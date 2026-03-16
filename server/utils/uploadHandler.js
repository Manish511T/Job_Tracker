const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File upload handler
const handleFileUpload = (file, folder = 'resumes') => {
  if (!file) return null;

  const folderPath = path.join(uploadsDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const ext = path.extname(file.originalname);
  const name = path.basename(file.originalname, ext);
  const filename = `${name}-${timestamp}${ext}`;
  const filepath = path.join(folderPath, filename);

  // Write file
  fs.writeFileSync(filepath, file.buffer);

  return {
    filename: filename,
    originalName: file.originalname,
    path: `/uploads/${folder}/${filename}`,
    size: file.size,
    mimeType: file.mimetype,
  };
};

// File delete handler
const deleteFile = (filename, folder = 'resumes') => {
  try {
    const filepath = path.join(uploadsDir, folder, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
  return false;
};

module.exports = { handleFileUpload, deleteFile };
