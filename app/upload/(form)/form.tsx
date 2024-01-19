export default function UploadForm() {
  return (
    <div className="form-wrapper">
      <form action="">
        <input type="file" name="file" id="file" accept="image/*" />
        <button type="submit" className="submit-button">
          파일 업로드
        </button>
      </form>
    </div>
  );
}
