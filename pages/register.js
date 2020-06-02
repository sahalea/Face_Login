import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import AppLayout from "./component/layout";
import api from "./util/user";

export default function Register() {
  const registeruser = (values) => {};

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // const getUsers() {
    //   const data = await api.getAllUsers();
    //   console.log(data);
    // }
    // getAllUsers();
    console.log("***********");
  }, []);

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
}
