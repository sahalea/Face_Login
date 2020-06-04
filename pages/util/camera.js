import { get, post } from "./requestManager";
import * as faceapi from "face-api.js";

const detection = {
  scoreThreshold: 0.5,
  inputSize: 320,
  boxColor: "blue",
  textColor: "red",
  lineWidth: 1,
  fontSize: 20,
  fontStyle: "Georgia",
  useTiny: false,
};

export default {
  async startCamera(videoStream) {
    if (
      !videoStream &&
      navigator &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      const stream = await navigator.mediaDevices
        .getUserMedia({ video: true })
        .catch((e) => {
          console.log(e);
          throw new Error(e);
        });
      //commit("start", stream);
      return stream;
    } else {
      throw new Error("This browser doesn't support WebRTC");
    }
  },

  async uploadBase64(upload) {
    const data = await post("user/uploadBase64", { upload });
    return data;
  },

  async saveFace(faces) {
    const data = await post("face/save", { faces });
    console.log(data);
  },

  getFaceDetections({ canvas, options }) {
    console.log(canvas);
    console.log(detection);
    let detections = faceapi.fetchImage({ canvas });
    // if (options && (options.landmarksEnabled || options.descriptorsEnabled)) {
    //   detections = detections.withFaceLandmarks(detection.useTiny);
    // }
    // if (options && options.expressionsEnabled) {
    //   detections = detections.withFaceExpressions();
    // }
    // if (options && options.descriptorsEnabled) {
    //   detections = detections.withFaceDescriptors();
    // }

    return detections;
  },
  loadface() {
    return Promise.all([
      faceapi.loadFaceRecognitionModel("http://localhost:3001/data/models"),
      faceapi.loadFaceLandmarkModel("http://localhost:3001/data/models"),
      faceapi.loadTinyFaceDetectorModel("http://localhost:3001/data/models"),
      faceapi.loadFaceExpressionModel("http://localhost:3001/data/models"),
    ]);
  },
};
