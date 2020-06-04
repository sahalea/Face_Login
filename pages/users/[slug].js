import React from "react";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import AppLayout from "../component/layout";
import api from "../util/camera";
import apiUser from "../util/user";

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

export default class UserByid extends React.Component {
  constructor(props) {
    super(props);
    this.liveVideoRef = React.createRef();
    this.imageCanvasRef = React.createRef();
    this.state = {
      name: "sahal",
      isDocument: false,
      users: [],
    };
  }

  async startCamera() {
    await api.startCamera(this.state.isVideo).then((stream) => {
      if (this.liveVideoRef.current.srcObject !== stream) {
        this.liveVideoRef.current.srcObject = stream;
      }
    });
  }

  async getAllUsers() {
    const users = await apiUser.getAllUsers();
    this.setState({ users });
  }

  componentDidMount() {
    this.getAllUsers();
  }

  async takePhoto() {
    const video = this.liveVideoRef.current;
    const canvas = this.imageCanvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    canvasCtx.drawImage(video, 0, 0, 320, 247);
    const content = canvas.toDataURL("image/jpeg");
    const apiRes = await api.uploadBase64({
      user: "sahel",
      content: content,
    });
    this.getAllUsers();
  }

  async trainPhoto() {
    const { users } = this.state;
    const faces = [];
    await Promise.all(
      users.map(async (user) => {
        const descriptors = [];
        await Promise.all(
          user.photos.map(async (photo, index) => {
            const photoId = `${user.name}${index}`;
            const img = document.getElementById(photoId);
            const options = {
              detectionsEnabled: true,
              landmarksEnabled: true,
              descriptorsEnabled: true,
              expressionsEnabled: false,
            };
            const detections = await self.$store.dispatch(
              "face/getFaceDetections",
              { canvas: img, options }
            );
            detections.forEach((d) => {
              descriptors.push({
                path: photo,
                descriptor: d.descriptor,
              });
            });
            self.increaseProgress();
          })
        );
        faces.push({
          user: user.name,
          descriptors,
        });
      })
    );
    await self.$store
      .dispatch("face/save", faces)
      .then(() => {
        self.increaseProgress();
        self.isProgressActive = false;
      })
      .catch((e) => {
        self.isProgressActive = false;
        console.error(e);
      });
  }

  render() {
    const { isDocument } = this.state;

    return (
      <AppLayout>
        <div className="fullscreen">
          <>
            <Button
              type="primary"
              onClick={() => this.setState({ isDocument: !isDocument })}
            >
              Upload
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: 10 }}
              onClick={() => this.startCamera()}
            >
              Camera
            </Button>
          </>
          <div>
            {isDocument ? (
              <Upload {...props}>
                <Button>
                  <UploadOutlined /> Click to Upload
                </Button>
              </Upload>
            ) : (
              <>
                <Button type="primary" onClick={() => this.takePhoto()}>
                  Take Photo
                </Button>
                <div className="row">
                  <div className="col-md-4">
                    <video
                      ref={this.liveVideoRef}
                      width="320"
                      height="247"
                      autoPlay
                    />
                  </div>
                  <div className="col-md-4">
                    <canvas
                      ref={this.imageCanvasRef}
                      width="320"
                      height="247"
                    />
                  </div>
                </div>
                <Button type="primary" onClick={() => this.trainPhoto()}>
                  Train Photo
                </Button>
              </>
            )}
          </div>
        </div>
      </AppLayout>
    );
  }
}
