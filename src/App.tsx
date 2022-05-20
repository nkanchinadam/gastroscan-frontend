import React, { useState, useRef } from 'react';
import { AbnormalityLabels, ConditionLabels, ModelType } from './types';
import { getPixels } from './getPixels';

function App() {
  const [modelType, setModelType] = useState<ModelType>('abnormality');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImage, setIsImage] = useState(true);
  const [prediction, setPrediction] = useState<AbnormalityLabels | ConditionLabels | null>(null);

  const imageDisplay = useRef<HTMLCanvasElement>(null);

  const changeModel = (index: number): void => {
    if(index === 0) {
      setModelType('abnormality');
    }
    else {
      setModelType('condition');
    }
  } 

  const onFileUpload = (event: any) => {
    if(event.target !== null) {
      setSelectedFile(event.target.files[0]);
    }
  }

  const onFileSubmit = () => {
    if(selectedFile !== null) {
      const img = new Image();
      console.log('selected file: ', selectedFile);
      img.src = URL.createObjectURL(selectedFile);
      img.width = 100;
      img.height = 100;

      img.onload = async () => {
        URL.revokeObjectURL(img.src);
        if(imageDisplay.current !== null) {
          imageDisplay.current.width = img.width;
          imageDisplay.current.height = img.height;
          const context = imageDisplay.current.getContext('2d');
          if(context) {
            context.drawImage(img, 0, 0, 100, 100);
            const data = context.getImageData(0, 0, img.width, img.height);
            const pixels = getPixels(data);
            console.log(pixels)
            const result = await fetch('http://localhost:8080/handle_file_upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                pixels: pixels,
                modelType: modelType
              })
            })
            const response = await result.json();
            setPrediction(response.prediction);
          }
        }
      }
    }
  }

  const backButton = (): void => {
    setPrediction(null);
  }

  return (
    <div>
      {prediction ? 
        <div style={prediction === 'Healthy' ? {backgroundColor: '#00ff00'} : {backgroundColor: '#ff0000'}}>
          <button onClick={backButton}>Back</button>
          <h2>{prediction}</h2>
        </div> :
        <div>
          {modelType === 'condition' ? <button onClick={() => changeModel(0)}>Abnormality Model</button> : <button onClick={() => changeModel(1)}>Condition Model</button>}<br/>
          <label>Upload Image or Video Here</label><br/>
          <input type="file" accept="image/*, video/*" onChange={onFileUpload} id="myImage"/><br/>
          <button onClick={onFileSubmit}>Upload</button><br/>
          <canvas ref={imageDisplay} id='image_display' width={600} height={400} style={{/*display: 'none'*/}}></canvas>
        </div>
      }
    </div>
  );
}

export default App;