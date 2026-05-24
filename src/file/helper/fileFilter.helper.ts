import { Request } from 'express';

export const fileFilter = ( req: Request, file: Express.Multer.File, callback: Function ) => {
  //console.log({ file })
  if (!file) return callback(new Error('file is empty'), false);

  const fileExptension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif']

  if ( validExtensions.includes(fileExptension) ) {
    return callback(null, true)
  } else{
    callback(null, false)
  }
};
