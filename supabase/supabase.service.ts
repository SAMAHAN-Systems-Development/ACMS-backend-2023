import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  constructor() {
    const supabaseURL = process.env.SUPABASE_URL;
    const supabaseAPIKey = process.env.SUPABASE_KEY;
    this.supabase = createClient(supabaseURL, supabaseAPIKey);
  }

  getSupabase() {
    return this.supabase;
  }

  async createSupabaseUser(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(`Supabase signup failed: ${error.message}`);
    }

    return data;
  }

  async createBucket(
    bucketName: string,
    allowedMimeTypes: string[] | undefined,
  ): Promise<any> {
    try {
      const { data: buckets, error: listError } =
        await this.supabase.storage.listBuckets();

      if (listError) {
        throw new Error(`Failed to list buckets: ${listError.message}`);
      }

      const bucketExists = buckets.some((bucket) => bucket.name === bucketName);

      if (bucketExists) {
        console.log('Bucket already exists');
        return false;
      }

      const { data, error } = await this.supabase.storage.createBucket(
        bucketName,
        {
          public: true,
          allowedMimeTypes: allowedMimeTypes ?? ['*'],
        },
      );

      if (error) {
        throw new Error(`Failed to create bucket: ${error.message}`);
      }

      console.log('Bucket created successfully:', data);
    } catch (error) {
      console.error('Error managing bucket:', error);
    }
  }

  // FiletoBase64(file: Express.Multer.File) {
  //   let fileToBase64;
  //   try {
  //     fileToBase64 = Buffer.from(file.buffer).toString('base64');
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  //   return fileToBase64;
  // }

  // async uploadImageToDB(file: Express.Multer.File, uuid: string) {
  //   const bucketName = 'payment';
  //   // the generated file name when
  //   // image is uploaded to supabase
  //   const file_name = `${uuid}_receipt.png`;
  //   const payment_path = `${bucketName}${file_name}`;
  //   // converts file to base64 string
  //   // supabase has limitations in uploading files
  //   // without converting to Base64, causes uploaded file to be incorrectly
  //   // uploaded with missing details in supabase
  //   const base64 = this.FiletoBase64(file);
  //   try {
  //     await this.supabase.storage
  //       .from(bucketName)
  //       .upload(file_name, decode(base64), {
  //         contentType: 'image/jpg',
  //       });
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  //   return payment_path;
  // }
}
