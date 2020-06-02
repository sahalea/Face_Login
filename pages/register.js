import { Form, Input, Button } from "antd";
import React from "react";
import AppLayout from "./component/layout";
import api from "./util/user";

const Register = (props) => {
  const registeruser = (values) => {};

  return (
    <AppLayout>
      <div className="fullscreen">
        <Form name="basic" onFinish={registeruser}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AppLayout>
  );
};

export default Register;

export async function getStaticProps() {
  console.log("****************");

  const data = await api.getAllUsers();
  console.log(data);

  return {
    props: {}, // will be passed to the page component as props
  };
}
