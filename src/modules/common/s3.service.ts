import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  buildPictureUrl(fileName: string, folder: string): string {
    return `${process.env.AWS_BACKET_BASE_URL}/${folder}/${fileName}`;
  }

  async uploadFile(
    data: Buffer,
    filename: string,
    folder: string,
    contentType: string,
  ): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: data,
      Key: `${folder}/${filename}`,
      ContentType: contentType,
    });

    return this.client.send(command);
  }

  async deleteFile(filename: string) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
    });
    const data = await this.client.send(command);

    return data;
  }
}
