let BASE_URL = "http://localhost:3001/api/";
import fetch from "node-fetch";

const makeRequest = (config) => {
  const url = `${BASE_URL}${config.url}`;
  let requestConfig = {};
  requestConfig = {
    method: config.method,
    mode: "cors",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
  };

  const { params } = config;
  if (params) {
    if (config.method === "POST" || config.method === "PUT") {
      requestConfig.body = JSON.stringify(params);
    }
  }
  try {
    console.log(url);
    return fetch(url, requestConfig)
      .then((response) => {
        return {
          status: response.status,
          data: response.json(),
        };
      })
      .catch((err) => {
        return { status: err };
      });
  } catch (error) {
    return { status: error };
  }
};

export const get = (url, params) => {
  return makeRequest({
    url,
    params,
    method: "GET",
  });
};

export const post = (url, params) => {
  return makeRequest({
    url,
    params,
    method: "POST",
  });
};

export const put = (url, params) => {
  return makeRequest({ url, params, method: "PUT" });
};

export const remove = (url, params) => {
  return makeRequest({ url, params, method: "DELETE" });
};
