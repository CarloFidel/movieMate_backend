import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { fileFilter } from './helper/fileFilter.helper';
import { fileNamer } from './helper/fileNamer.herlper';
import { FileService } from './file.service';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/Auth.decorator';
import { GetUser } from '../auth/decorators/GetUser.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload_avatar')
  @Auth()
  @ApiResponse({ status: 201, description: 'Avatar uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid image file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter, //aquí se valida
      storage: diskStorage({
        destination: './static/avatar',
        filename: fileNamer, //aquí se le asigna el uuuid para el nombre
      }),
    }),
  )
  createrAvatarImage(@UploadedFile() file: Express.Multer.File, @GetUser() user: User) {
    if (!file) {
      throw new BadRequestException('Make sure the file is an image');
    }
    console.log(file)

    this.fileService.saveAvatarUrl(file.filename, user)

    const securUrl = `${this.configService.get('HOST_API')}/file/user/${file.filename}`;

    return {
      securUrl,
    };
  }

  @Get('user/:imageName')
  @ApiResponse({ status: 200, description: 'Image retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Image not found' })
  findProductImage(
    @Res() res: Response, 
    @Param('imageName') imageName: string,
  ) {
    const path = this.fileService.getStaticImage(imageName);

    return res.sendFile(path);
  }
}
