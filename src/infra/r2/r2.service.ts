import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import {
  CloudflareConfig,
  EnvironmentVariables,
} from '../config/configuration';
import { Readable } from 'stream';

@Injectable()
export class R2Service {
  private r2: S3Client;

  constructor(private readonly config: ConfigService<EnvironmentVariables>) {
    this.r2 = new S3Client({
      endpoint: `https://${this.config.get<CloudflareConfig>('cloudflare', { infer: true }).accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: this.config.get<CloudflareConfig>('cloudflare', {
          infer: true,
        }).accessKeyId,
        secretAccessKey: this.config.get<CloudflareConfig>('cloudflare', {
          infer: true,
        }).secretAccessKey,
      },
    });
  }

  async uploadFile(
    bucketName: string,
    key: string,
    body: Buffer | Uint8Array | Blob | string,
  ) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
    });
    const result = await this.r2.send(command);
    return result;
  }

  async getFile(bucketName: string, key: string) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const result = await this.r2.send(command);
    return result;
  }

  async deleteFile(bucketName: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const result = await this.r2.send(command);
    return result;
  }

  async fileExists(bucketName: string, key: string): Promise<boolean> {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    try {
      await this.r2.send(command);
      return true;
    } catch (error) {
      const isNotFoundError = (error as { name?: string }).name === 'NotFound';
      if (isNotFoundError) {
        return false;
      }
      throw error;
    }
  }

  async getFileBase64(bucketName: string, key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const result = await this.r2.send(command);
    const stream = result.Body as Readable;
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    return buffer.toString('base64');
  }
}
