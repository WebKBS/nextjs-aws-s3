'use server';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';

// S3 클라이언트 생성
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
} as any);

// 파일 이름을 UTF-8로 인코딩하는 함수 추가
function encodeFileName(fileName: string) {
  return encodeURIComponent(fileName);
}

// S3에 파일 업로드 함수
async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  fileType: string
) {
  const fileBuffer = file;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${encodeFileName(fileName)}`, // 만약 folder를 설정하려면, `폴더이름/${fileName}`
    // 만약 파일 중복을 피하려면 `${Date.now()}_${fileName}` Date now + 파일 이름
    Body: fileBuffer,
    ContentType: fileType,
  };

  console.log(fileType);

  const command = new PutObjectCommand(params);

  try {
    const response = await s3Client.send(command);
    console.log('데이터 업로드 성공', response);

    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;

    console.log('url', url);

    return url;
  } catch (error) {
    console.log('데이터 업로드 실패', error);
  }
}

// 파일 업로드 함수
export async function uploadFile(prevState: any, formData: FormData) {
  // await new Promise((resolve) => setTimeout(resolve, 3000)); // 3초 딜레이 테스트

  try {
    console.log(formData.get('file'));

    const file = formData.get('file') as File;

    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      return {
        status: 'error',
        message: '파일의 형식은 png, jpeg만 가능합니다.',
      };
    } else if (file.size === 0) {
      return {
        status: 'error',
        message: '파일을 선택해주세요.',
      };
    } else if (file.size > 1024 * 1024 * 5) {
      return {
        status: 'error',
        message: '파일의 크기는 5MB를 넘을 수 없습니다.',
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer()); // 파일을 버퍼로 변환

    const url = await uploadFileToS3(buffer, file.name, file.type);

    revalidatePath('/');

    return {
      status: 'success',
      message: '파일 업로드를 성공했습니다.',
      imageUrl: url,
    };
  } catch (error) {
    return {
      status: 'error',
      message: '파일 업로드를 실패했습니다.',
    };
  }
}
