export default {
  SetValues(key, data) {
    sessionStorage.removeItem(key);
    const values = JSON.stringify(data);
    sessionStorage.setItem(key, values);
  },

  GetValues(key) {
    const data = JSON.parse(sessionStorage.getItem(key));
    return data;
  },

  RemoveValues(key) {
    sessionStorage.removeItem(key);
  },
};
