import React from "react";
import api from "./util/camera";
import * as faceapi from "face-api.js";

export default class Viewrec extends React.Component {
  constructor(props) {
    super(props);
    this.liveVideoRef = React.createRef();
    this.liveCanvas = React.createRef();
    this.state = {
      interval: null,
      errortext: "HI hlloebjfbb",
    };
  }

  componentDidMount() {
    this.startCamera();
    api.loadface();
    this.recognize();
  }

  async startCamera() {
    await api.startCamera(false).then((stream) => {
      if (this.liveVideoRef.current.srcObject !== stream) {
        this.liveVideoRef.current.srcObject = stream;
      }
    });
  }

  async recognize() {
    const videoDiv = this.liveVideoRef.current;
    const canvasDiv = this.liveCanvas.current;
    const canvasCtx = canvasDiv.getContext("2d");
    const options = {
      detectionsEnabled: true,
      landmarksEnabled: true,
      descriptorsEnabled: true,
      expressionsEnabled: true,
    };
    const self = this.state;
    if (self.interval) {
      clearInterval(self.interval);
    }
    self.interval = setInterval(async () => {
      const t0 = performance.now();
      canvasCtx.drawImage(videoDiv, 0, 0, 320, 247);
      const detections = await api.getFaceDetections({
        canvas: canvasDiv,
        options,
      });

      if (detections.length) {
        let eye_left = this.getMeanPosition(
          detections[0].landmarks.getLeftEye()
        );

        var eye_right = this.getMeanPosition(
          detections[0].landmarks.getRightEye()
        );
        // let leftEye = this.eyeBlink(detections[0].landmarks.getLeftEye());
        // let rightEyr = this.eyeBlink(detections[0].landmarks.getRightEye());

        // console.log("left: " + leftEye);
        //console.log("Right " + rightEyr);

        let mouthOPen = this.eyeBlink(detections[0].landmarks.getMouth());
        console.log("mouth: " + mouthOPen);

        var nose = this.getMeanPosition(detections[0].landmarks.getNose());
        var mouth = this.getMeanPosition(detections[0].landmarks.getMouth());
        var jaw = this.getTop(detections[0].landmarks.getJawOutline());
        var rx = (jaw - mouth[1]) / detections[0].detection.box.height;
        var ry =
          (eye_left[0] + (eye_right[0] - eye_left[0]) / 2 - nose[0]) /
          detections[0].detection.box.width;
        var ryarray = ry.toString().split(/\.(?=[^\.]+$)/);
        var rxarray = rx.toString().split(/\.(?=[^\.]+$)/);
        var ryVal = ryarray[1].substring(0, 2);
        var rxVal = rxarray[1].substring(0, 2);
        if (
          (ryVal.toString() === "00" || ryVal.toString() === "01") &&
          this.betweenNumber(rxVal, 29, 51) === true
        ) {
          this.setState({ errortext: "" });
        } else {
          this.setState({ errortext: "Please correct head position" });
        }

        // get firt and last points of jaw , get points diff between two y
        //console.log(ry, rx);
        // ry = yaw
        //rx = pitch
        // console.log(
        //   detections[0].detection.score, //Face detection score
        //   ry, //Closest to 0 is looking forward
        //   rx // Closest to 0.5 is looking forward, closest to 0 is looking up
        //   // rz
        // );
        detections.forEach(async (detection) => {
          api.draw({
            canvasDiv,
            canvasCtx,
            detection,
            options,
          });
        });
      }
    }, 1000 / 1);
  }

  eyeBlink(arr) {
    let minY = Math.min.apply(
      null,
      arr.map(function (item) {
        return item.y;
      })
    );

    let maxY = Math.max.apply(
      null,
      arr.map(function (item) {
        return item.y;
      })
    );
    let minX = Math.min.apply(
      null,
      arr.map(function (item) {
        return item.x;
      })
    );

    let maxX = Math.max.apply(
      null,
      arr.map(function (item) {
        return item.x;
      })
    );

    let ear = (2 * (maxY - minY)) / (maxX - minX);
    return ear;
  }

  betweenNumber(val, a, b) {
    var min = Math.min(a, b),
      max = Math.max(a, b);
    return val > min && val < max;
  }

  getTop(l) {
    return l.map((a) => a.y).reduce((a, b) => Math.min(a, b));
  }

  getMeanPosition(l) {
    return l
      .map((a) => [a.x, a.y])
      .reduce((a, b) => [a[0] + b[0], a[1] + b[1]])
      .map((a) => a / l.length);
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
          <h2>{this.state.errortext}</h2>
        </div>
      </div>
    );
  }
}
