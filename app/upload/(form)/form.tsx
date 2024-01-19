'use client';
import { useFormState } from 'react-dom';
import Button from './Button';
import { uploadFile } from './actions';

const initialState = { message: '', status: '', imageUrl: '' };

export default function UploadForm() {
  const [state, formAction] = useFormState(uploadFile, initialState);

  console.log('state', state);

  return (
    <div className="form-wrapper">
      <form action={formAction}>
        <input type="file" name="file" id="file" accept="image/*" />
        <Button />
      </form>
      {state?.status && (
        <div className={`state-message ${state?.status}`}>{state?.message}</div>
      )}
      {state?.imageUrl && (
        <div className="form-wrapper">
          <img src={state?.imageUrl} alt="업로드 이미지" />
        </div>
      )}
    </div>
  );
}
