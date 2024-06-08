'use client';

import { getDatasetSignedURL} from '@/actions/s3';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { cn, computeSHA256 } from '@/lib/utils';
import axios from 'axios';
import { File, Loader2, MousePointerSquareDashed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';

const UploadPage = () => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const router = useRouter();

  const { toast } = useToast();

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;

    toast({
      title: 'File Rejected',
      description: `${file.file.name} was rejected because it is not a CSV file`,
      variant: 'destructive',
    });

    setIsDragOver(false);
  };

  const onDropAccepted = async (acceptedFiles: File[]) => {
    const [file] = acceptedFiles;
    setIsDragOver(false);
    setIsUploading(true);

    try {
      const checksum = await computeSHA256(file);
      const signedURL = await getDatasetSignedURL(file.type, file.size, checksum);

      if (signedURL.error !== undefined) {
        throw new Error(signedURL.error);
      }
      const { url, datasetId } = signedURL.success;

      await axios
        .put(url, file, {
          headers: {
            'Content-Type': file.type,
            'Access-Control-Allow-Origin': process.env.AUTH_URL
          },
          onUploadProgress: (e) => {
            setUploadProgress(Math.round((e.loaded * 100) / e.total!));
          },
        })
        .catch((error) => {
          return toast({
            title: 'Error while uploading file',
            description: 'Please try again',
            variant: 'destructive',
          
          })
        })
        .then(() => {
          toast({
            title: 'Upload successful!',
            description: 'File has been uploaded successfully',
            variant: 'default',
            duration: 2000
          });
        });

      startTransition(() => {
        router.push(`/analyze/select?id=${datasetId}`);
      });
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        'relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center',
        {
          'ring-blue-900/25 bg-blue-900/10': isDragOver,
        }
      )}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            'text/csv': ['.csv'],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
              ) : (
                <File className="h-6 w-6 text-zinc-500 mb-2" />
              )}
              <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    <div className='mt-2 flex justify-center items-center space-x-2'>
                    <Progress
                      value={uploadProgress}
                      className="w-40 h-2 bg-gray-300"
                    />
                    <span className='text-xs'>{uploadProgress}%</span>
                    </div>
                    
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <p>Redirecting, please wait...</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-semibold">Drop file</span> to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                )}
              </div>

              {isPending ? null : (
                <p className="text-xs text-zinc-500">
                  Only CSV files are accepted
                </p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default UploadPage;
