import { api } from './api.ts';
import { ExtractedCvData } from '../../server/services/documentExtractor.ts';

export async function parseUploadedFile(file: File): Promise<{
  extracted: ExtractedCvData;
  source: string;
}> {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File exceeds the 5MB size limit. Please upload a smaller document.');
  }

  const name = file.name.toLowerCase();

  // 1. Plain Text (.txt)
  if (name.endsWith('.txt')) {
    const text = await file.text();
    const res = await api.extractDocument({
      filename: file.name,
      fileType: 'txt',
      rawText: text,
    });
    return { extracted: res.extracted, source: file.name };
  }

  // 2. Word Document (.docx)
  if (name.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    const res = await api.extractDocument({
      filename: file.name,
      fileType: 'docx',
      fileBase64: base64,
    });
    return { extracted: res.extracted, source: file.name };
  }

  // 3. PDF Document (.pdf)
  if (name.endsWith('.pdf')) {
    // Attempt text extraction
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    const res = await api.extractDocument({
      filename: file.name,
      fileType: 'pdf',
      fileBase64: base64,
    });
    return { extracted: res.extracted, source: file.name };
  }

  throw new Error('Unsupported file extension. Supported formats are: .pdf, .docx, .txt');
}
