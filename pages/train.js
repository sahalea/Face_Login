import React from "react";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import AppLayout from "./component/layout";
import api from "./util/camera";
import apiUser from "./util/user";
import { useRouter } from "next/router";

export default class Train extends React.Component {
  state = {
    users: [],
    userImage: [],
  };
  domRefs = {};

  async getAllUsers() {
    const users = await apiUser.getAllUsers();
    this.setState({ users });
  }

  componentDidMount() {
    api.loadface();
    this.getAllUsers();
  }

  async saveface(face) {
    const data = await api.saveFace(face);
    console.log(data);
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
            const detections = await api.getFaceDetections({
              canvas: img,
              options,
            });
            if (detections.length > 0) {
              detections.forEach((d) => {
                descriptors.push({
                  path: photo,
                  descriptor: d.descriptor,
                });
              });
            }
          })
        );
        faces.push({
          user: user.name,
          descriptors,
        });
      })
    );

    console.log(faces);
    this.saveface(faces);
  }

  render() {
    const { users, userImage } = this.state;

    return (
      <AppLayout>
        <div className="fullscreen">
          <Button type="primary" onClick={() => this.trainPhoto()}>
            Train Photo
          </Button>
          <div>
            {users.map((u) => (
              <>
                <p key={u.name}>{u.name}</p>
                <div>
                  {u.photos.map((p, idx) => (
                    <figure key={p}>
                      <img id={`${u.name}${idx}`} src={`${p}`} />
                    </figure>
                  ))}
                </div>
              </>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }
}
