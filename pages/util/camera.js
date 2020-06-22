import { get, post } from "./requestManager";
import * as faceapi from "face-api.js";
import storrage from "./storagemanager";

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

const state = {
  faces: [],
  loading: false,
  loaded: false,
  faceMatcher: null,
  detections: {
    scoreThreshold: 0.5,
    inputSize: 320,
    boxColor: "blue",
    textColor: "red",
    lineWidth: 1,
    fontSize: 20,
    fontStyle: "Georgia",
  },
  useTiny: false,
  expressions: {
    minConfidence: 0.2,
  },
  landmarks: {
    drawLines: true,
    lineWidth: 1,
  },
  descriptors: {
    withDistance: false,
  },
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

    return data;
  },

  async getFaceDetections({ canvas, options }) {
    //this.loadface();
    let detections = faceapi.detectAllFaces(
      canvas,
      new faceapi.TinyFaceDetectorOptions({
        scoreThreshold: detection.scoreThreshold,
        inputSize: detection.inputSize,
      })
    );

    if (options && (options.landmarksEnabled || options.descriptorsEnabled)) {
      detections = detections.withFaceLandmarks(detection.useTiny);
    }
    if (options && options.expressionsEnabled) {
      detections = detections.withFaceExpressions();
    }
    if (options && options.descriptorsEnabled) {
      detections = detections.withFaceDescriptors();
    }
    detections = await detections;

    return detections;
  },
  loadface() {
    return Promise.all([
      faceapi.loadFaceRecognitionModel("/data/models"),
      faceapi.loadFaceLandmarkModel("/data/models"),
      faceapi.loadTinyFaceDetectorModel("/data/models"),
      faceapi.loadFaceExpressionModel("/data/models"),
    ]);
  },

  draw({ canvasDiv, canvasCtx, detection, options }) {
    let emotions = "";
    // filter only emontions above confidence treshold and exclude 'neutral'
    if (options.expressionsEnabled && detection.expressions) {
      for (const expr in detection.expressions) {
        if (
          detection.expressions[expr] > state.expressions.minConfidence &&
          expr !== "neutral"
        ) {
          emotions += ` ${expr} &`;
        }
      }
      if (emotions.length) {
        emotions = emotions.substring(0, emotions.length - 2);
      }
    }
    let name = "";
    if (options.descriptorsEnabled && detection.recognition) {
      name = detection.recognition.toString(state.descriptors.withDistance);
    }

    const text = `${name}${emotions ? (name ? " is " : "") : ""}${emotions}`;
    const box = detection.box || detection.detection.box;
    if (options.detectionsEnabled && box) {
      // draw box
      canvasCtx.strokeStyle = state.detections.boxColor;
      canvasCtx.lineWidth = state.detections.lineWidth;
      canvasCtx.strokeRect(box.x, box.y, box.width, box.height);
    }
    if (text && detection && box) {
      // draw text
      const padText = 2 + state.detections.lineWidth;
      canvasCtx.fillStyle = state.detections.textColor;
      canvasCtx.font =
        state.detections.fontSize + "px " + state.detections.fontStyle;
      canvasCtx.fillText(
        text,
        box.x + padText,
        box.y + box.height + padText + state.detections.fontSize * 0.6
      );
    }

    if (options.landmarksEnabled && detection.landmarks) {
      console.log(detection.landmarks);
      faceapi.draw.drawFaceLandmarks(canvasDiv, detection.landmarks, {
        lineWidth: state.landmarks.lineWidth,
        drawLines: state.landmarks.drawLines,
      });
    }
  },

  async createCanvas({ commit, state }, elementId) {
    const canvas = await faceapi.createCanvasFromMedia(
      document.getElementById(elementId)
    );
    return canvas;
  },

  async getAll() {
    const data = await get("/api/face/getAll");
    storrage.SetValues("setFaces", data);
  },

  getFaceMatcher() {
    const faces = storrage.GetValues("setFaces");
    console.log(faces);

    // const labeledDescriptors = [];
    // state.faces.forEach((face) => {
    //   const descriptors = face.descriptors.map((desc) => {
    //     if (desc.descriptor) {
    //       const descArray = [];
    //       for (const i in desc.descriptor) {
    //         descArray.push(parseFloat(desc.descriptor[i]));
    //       }
    //       return new Float32Array(descArray);
    //     }
    //   });
    //   if (descriptors.length) {
    //     labeledDescriptors.push(
    //       new faceapi.LabeledFaceDescriptors(face.user, descriptors)
    //     );
    //   }
    // });
    // const matcher = new faceapi.FaceMatcher(labeledDescriptors);
    // commit("setFaceMatcher", matcher);
    // return matcher;
  },
};
