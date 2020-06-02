import { get } from "./requestManager";

export default {
  async getAllUsers() {
    console.log("***************");
    const data = await get("/user/getAll");
    return data.data;
  },
};
