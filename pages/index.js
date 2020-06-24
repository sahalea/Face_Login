import { Jumbotron, Button } from "react-bootstrap";
import AppLayout from "./component/layout";
import Link from "next/link";

export default function Home() {
  return (
    <AppLayout>
      <div className="fullscreen">
        <Jumbotron>
          <h1>Hello, Folks!</h1>
          <p>Realtime Face Recognition using TensorFlowJS and face-api-js</p>
          <section>
            <h4>
              Register: <span>Register your name</span>
            </h4>
            <h4>
              Take Photos:
              <span>
                Upload photos either by the File Upload or using your Camera
              </span>
            </h4>
            <h4>
              Train: <span>Train the model for all users in the catalog</span>
            </h4>
            <h4>
              Recognize: <span>Recognize your face using browser camera</span>
            </h4>
          </section>
          <p className="btn btn-success">
            <Link href="/test">
              <a style={{ color: "#FFF" }}>Register User</a>
            </Link>
          </p>
        </Jumbotron>
      </div>
    </AppLayout>
  );
}
