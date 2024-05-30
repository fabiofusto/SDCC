import { Dataset } from '@/components/dataset';
import { notFound } from 'next/navigation';
import { parseData } from '@/lib/utils';
import axios from 'axios';
import { getDatasetFromS3 } from '@/actions/s3';

interface SelectPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const SelectPage = async ({ searchParams }: SelectPageProps) => {
  const { id } = searchParams;

  if (!id || typeof id !== 'string') return notFound();

  const signedURL = await getDatasetFromS3(id);
  if (signedURL.error !== undefined) return notFound()

  const response = await axios.get(signedURL.success.url).catch((error) => {
    return notFound()
  });

  const data: string = response.data;
  const tableData = parseData(data);
  
  const headers = tableData[0].map((column: string) => ({
    value: column,
    label: column.charAt(0).toUpperCase() + column.slice(1).toLowerCase(),
  }));
  const body = tableData.slice(1);

  return (
    <Dataset
      headers={headers}
      body={body}
      datasetId={id}
    />
  );
};

export default SelectPage;
