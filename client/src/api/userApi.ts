import axiosInstance from "./axiosInstance";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

/**
 * Registers a new user by sending a POST request to the "/user/register" endpoint.
 *
 * @param {RegisterData} data - The data for the new user, including name, email, password, and optional avatar.
 * @return {Promise<any>} A Promise that resolves to the response data from the server.
 * @throws {Error} If an error occurs during the request.
 */
export const registerUserApi = async (data: RegisterData): Promise<any> => {
  try {
    const res = await axiosInstance.post("/user/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res, "register user api data");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginUserApi = async (data: LoginUserData): Promise<any> => {
  try {
    const res = await axiosInstance.post("/user/login", data);
    console.log(res, "login user api data");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logoutUserApi = async () => {
  try {
    const res = await axiosInstance.post("/user/logout");
    console.log(res, "logout user api data");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserApi = async () => {
  try {
    const res = await axiosInstance.get("/user");
    console.log(res, "get user api data");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const refreshAccessTokenApi = async () => {
  try {
    const res = await axiosInstance.post("/users/refresh-token");
    console.log("res from refresh access token user api => ", res);
    return res.data;
  } catch (error: any) {
    console.log("error in refresh access user api", error);
    throw error.message;
  }
};
