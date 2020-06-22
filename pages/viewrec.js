import React from "react";

import api from "./util/camera";
export default class Viewrec extends React.Component {
  constructor(props) {
    super(props);
    this.liveVideoRef = React.createRef();
    this.liveCanvas = React.createRef();
    this.state = {
      interval: null,
      fps: 3,
      realFps: 0,
      step: 2,
      counter: 0,
      progress: 0,
      duration: 0,
      isProgressActive: true,
      recognition: "",
      withOptions: [0, 1, 2, 3],
      isVideo: false,
    };
  }

  componentDidMount() {
    this.recognize();
    this.fps(1);
    api.loadface();
  }

  async componentWillUnmount() {
    await api.getAll().then(() => api.getFaceMatcher());
  }

  fps(newFps) {
    const videoDiv = this.liveVideoRef.current;
    const canvasDiv = this.liveCanvas.current;
    const canvasCtx = canvasDiv.getContext("2d");
    this.start(videoDiv, canvasDiv, canvasCtx, newFps);
  }

  start(videoDiv, canvasDiv, canvasCtx, fps) {
    const self = this.state;
    if (self.interval) {
      clearInterval(self.interval);
    }
    self.interval = setInterval(async () => {
      const t0 = performance.now();
      canvasCtx.drawImage(videoDiv, 0, 0, 320, 247);
      const options = {
        detectionsEnabled: false,
        landmarksEnabled: true,
        descriptorsEnabled: false,
        expressionsEnabled: false,
      };

      const detections = await api.getFaceDetections({
        canvas: canvasDiv,
        options,
      });

      if (detections.length) {
        if (self.isProgressActive) {
          //self.increaseProgress();
          self.isProgressActive = false;
        }
        // detections.forEach(async (detection) => {
        //   detection.recognition = await api.recognize({
        //     descriptor: detection.descriptor,
        //     options,
        //   });

        detections.forEach(async (detection) => {
          api.draw({
            canvasDiv,
            canvasCtx,
            detection,
            options,
          });
        });
      }
      const t1 = performance.now();
      this.setState({
        duration: (t1 - t0).toFixed(2),
        realFps: (1000 / (t1 - t0)).toFixed(2),
      });
    }, 1000 / fps);
  }
  async recognize() {
    await api.startCamera(this.state.isVideo).then((stream) => {
      if (this.liveVideoRef.current.srcObject !== stream) {
        this.liveVideoRef.current.srcObject = stream;
      }
    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <video
              id="live-video"
              ref={this.liveVideoRef}
              width="320"
              height="247"
              autoPlay
            />
          </div>
          <div className="col-md-4">
            <canvas
              id="live-canvas"
              ref={this.liveCanvas}
              width="320"
              height="247"
            />
          </div>
        </div>
      </div>
    );
  }
}
