import { Request } from 'express'; // import express library

import aws from 'aws-sdk';
import { S3 } from 'aws-sdk';

import multerS3 from 'multer-s3'; // import multer library
import multer from 'multer'; // import multer library
import path from 'path'; // import nodejs path library to read/write files

const allowedTypes = /jpeg|jpg|png|gif/; // allowed types

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRETKEY_ID,
  region: process.env.REGION
});

// method to restrict files based on file types
const fileFilter = (req: Request, file: Express.Multer.File, cb) => {
  // check mime type
  const mimeType: boolean = allowedTypes.test(file.mimetype);
  // accept allowed files only
  if (mimeType) {
    cb(null, true); // return with true
  } else {
    return cb('Invalid file type');
  }
};

// method to upload collaboration document
export const uploadCollabDocument = (path: string, file: Buffer | string, fileName: string) => {
  const params: S3.PutObjectRequest = {
    Key: path,
    Bucket: process.env.AWS_COLLAB_BUCKET as string,
    ACL: process.env.COLLAB_ACL,
    ServerSideEncryption: process.env.S3ENCRYPTION,
    Metadata: {
      fileName: fileName
    },
    Body: file
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// method to download the collaboration document
export const downloadCollaDocument = (path: string) => {
  const params: any = {
    Key: path,
    Bucket: process.env.AWS_COLLAB_BUCKET
  };

  return s3.getObject(params);
};

/**
 * Method: multer configuration method
 * path: url path
 * return multer configuration file
 */
export const multerAwsConfig: any = (folder: string) => {
  // multer s3 storage
  const storage = multerS3({
    s3: s3,
    bucket: process.env.BUCKET as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: process.env.ACL,
    serverSideEncryption: process.env.S3ENCRYPTION,
    metadata: (req: Express.Request, file: Express.Multer.File, cb: any) => {
      cb(null, { fieldName: file.fieldname, originalname: file.originalname });
    },
    key: (req: any, file: Express.Multer.File, cb: any) => {
      cb(null, process.env.AWS_ROOT_FOLDER + '/' + folder + '/' + req.query.id + path.extname(file.originalname));
    }
  });

  // configuration object
  const configuration = {
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
  };

  return multer(configuration);
};
