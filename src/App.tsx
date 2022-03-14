import React from 'react';
import logo from './src/logo.svg';

function App() {
  const onFileUpload = (): void => {
    console.log('File uploaded');
  }

  return (
    <div>
      <label>Upload Image or Video Here</label><br/>
      <input type="file" accept="image/*, video/*" /><br/>
      <button onClick={onFileUpload}>Upload</button>
    </div>
  );
}

export default App;
