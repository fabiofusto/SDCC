'use server';

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { auth } from '../../auth';
import { db } from '@/lib/db';

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.IAM_ACCESS_KEY!,
    secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY!,
  },
});

const acceptedDatasetTypes = ['text/csv'];

const maxFileSize = 1024 * 1024 * 10;

export async function getDatasetSignedURL(
  type: string,
  size: number,
  checksum: string
) {
  const session = await auth();
  if (!session) return { error: 'Unauthorized' };

  const userId = session.user?.id!;
  
  if (!acceptedDatasetTypes.includes(type))
    return { error: 'File type not supported' };
  
  if (size > maxFileSize) return { error: 'File size too large' };
  
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: userId,
    },
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });
  
  const dataset = await db.dataset.create({
    data: {
      userId: userId,
      url: signedURL.split('?')[0],
    },
  });
  
  if(!dataset) return { error: 'Could not create dataset' }
  
  return { success: { url: signedURL, datasetId: dataset.id } };
}

const acceptedReportTypes = ['application/pdf'];

export async function getReportSignedURL(
  reportId: string,
  type: string,
  size: number,
  checksum: string
) {
  const session = await auth();
  if (!session) return { error: 'Unauthorized' };

  const userId = session.user?.id!;

  if (!acceptedReportTypes.includes(type))
    return { error: 'File type not supported' };

  if (size > maxFileSize) return { error: 'File size too large' };

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: userId,
    },
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 3600,
  });

  const report = await db.report.findUnique({
    where: {
      id: reportId
    }
  })

  if(!report) return { error: 'Report does not exists' }
  if(report.url) return { error: 'Report already exists' }
  if(report.userId !== userId) return {error: 'Unauthorized'}

  await db.report.update({
    where: {
      id: reportId
    },
    data: {
      url: signedURL.split('?')[0]
    }
  })

  return { success: { url: signedURL} };
}

export async function getDatasetFromS3(datasetId: string)  {
  const session = await auth();
  if (!session) return { error: 'Unauthorized' };

  const userId = session.user?.id!;

  const dataset = await db.dataset.findUnique({
    where: {
      id: datasetId,
    },
  });

  if (!dataset) return { error: 'Dataset not found' };
  if(dataset.userId !== userId) return { error: 'Unauthorized' };

  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: dataset.url.split('/').pop(),
  });

  const signedURL = await getSignedUrl(s3, getObjectCommand, {
    expiresIn: 60,
  });

  return { success: { url: signedURL } };
}

export async function getReportFromS3(reportId: string)  {
  const session = await auth();
  if (!session) return { error: 'Unauthorized' };

  const userId = session.user?.id!;

  const report = await db.report.findUnique({
    where: {
      id: reportId,
    },
  });

  if (!report) return { error: 'Report not found' };
  if(report.userId !== userId) return { error: 'Unauthorized' };
  if(!report.url) return { error: 'Report not found' };

  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: report.url.split('/').pop(),
  });

  const signedURL = await getSignedUrl(s3, getObjectCommand, {
    expiresIn: 3600,
  });

  return { success: { url: signedURL } };
}