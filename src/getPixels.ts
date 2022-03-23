export function getPixels(idata: ImageData) {
  const processedData: number[][][] = [];
  for(let i = 0; i < idata.width; i++) {
    processedData[i] = [];
    for(let j = 0; j < idata.height; j++) {
      const redIndex = j * idata.width * 4 + i * 4;
      processedData[i][j] = [idata.data[redIndex], idata.data[redIndex + 1], idata.data[redIndex + 2]];
    }
  }
  return processedData;
}