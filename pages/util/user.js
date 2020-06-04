import { get, post } from "./requestManager";

export default {
  async getAllUsers() {
    const { data } = await get("user/getAll");
    return data;
  },

  async deleteUser(name) {
    const data = await post("user/delete", { name });
    return data;
  },

  async registerUser(name) {
    const data = await post("user/register", name);
    return data;
  },
};
