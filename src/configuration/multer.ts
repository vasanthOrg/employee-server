import multer from 'multer'; // import multer library
import { Request } from 'express';

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const fileFilter = (req: Request, file: Express.Multer.File, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
export default class Multer_CL {
  private endPath: string;
  public storage: any;

  constructor(endPath: string) {
    this.endPath = endPath;
    this.storage = multer(this.multerConfig(this.endPath));
  }

  public multerConfig(path: string) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path);
      },
      filename: function (req, file, cb) {
        const originalValue = file.originalname.replace(/\s/g, '_');
        const originalName = Date.now() + '_' + originalValue;
        cb(null, originalName);
      }
    });

    return {
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 5
      },
      fileFilter: fileFilter
    };
  }
}
