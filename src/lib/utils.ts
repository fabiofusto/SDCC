import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
};

export const parseData = (data: string) => {
  const rows: string[] = data.split('\r\n');
  let table: string[][] = rows.map((row) => row.split(';'));
  table = table.filter((row) => row.some((field) => field !== ''));
  return table;
};

export const exportComponentAsPDF = async (): Promise<File> => {
  try {
    const input = document.getElementById('report');
    if (!input) {
      throw new Error();
    }

    const dataUrl = await domtoimage.toPng(input);
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(img);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = (imgProps.width * pdfWidth) / imgProps.width;
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(img, 'PNG', 0, 10, imgWidth, imgHeight);

    const pdfBlob = pdf.output('blob');

    const pdfFile = new File([pdfBlob], 'report.pdf', {
      type: 'application/pdf',
    });

    //pdf.save("report.pdf")
    return pdfFile;
  } catch (error) {
    throw new Error('Error exporting component as PDF');
  }
};
