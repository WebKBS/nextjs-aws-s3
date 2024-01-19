'use client';
import { useFormStatus } from 'react-dom';

export default function Button() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="submit-button" disabled={pending}>
      {pending ? '업로드 중...' : '파일 업로드'}
    </button>
  );
}
