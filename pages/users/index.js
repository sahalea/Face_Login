import { Form, Input, Button, Popconfirm } from "antd";
import { useRouter } from "next/router";
import AppLayout from "../component/layout";
import api from "../util/user";

const Users = (props) => {
  const router = useRouter();
  const registeruser = (values) => {
    const res = api.registerUser(values);
    if (res) {
      router.push("/users/1");
    }
  };

  const removeUser = async (name) => {
    const res = await api.deleteUser(name);
    console.log(res);
  };

  return (
    <AppLayout>
      <div className="fullscreen">
        <Form name="basic" onFinish={(e) => registeruser(e)}>
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
        <div>
          {props.data.map((e) => (
            <div>
              <a>
                {e.name}
                <span>
                  <Popconfirm
                    title="Are you sure delete this user?"
                    onConfirm={() => removeUser(e.name)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <a href="#">Delete</a>
                  </Popconfirm>
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Users;

export async function getStaticProps() {
  const data = await api.getAllUsers();
  return {
    props: {
      data,
    },
  };
}
