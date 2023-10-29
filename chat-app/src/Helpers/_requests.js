import axios from "axios";

const localStorageKeys = {
  token: "_token",
};

export const BASE_URL = "http://127.0.0.1:5001/api/";
const LOGIN_URL = "auth/login";
const GROUPS_URL = "groups/search";
const CREATE_GROUP_URL = "groups/create";
const USERS_URL = "groups/users";
const ADD_MEMBER_URL = "groups/add-member/";
const CREATE_USER_URL = "auth/create-user";

export const checkAuth = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem(localStorageKeys.token) || "{}"
    );
    if (user && user.token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;
      return { success: true, data: user, error: null };
    }
    return { success: false, error: null };
  } catch (error) {
    return { success: false, error };
  }
};

export const loginRequest = async ({ username, password }) => {
  try {
    const response = await axios.post(BASE_URL + LOGIN_URL, {
      username,
      password,
    });
    if (response.status === 200) {
      localStorage.setItem(
        localStorageKeys.token,
        JSON.stringify(response.data)
      );
      return { success: true, data: response.data, error: null };
    }
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const logoutRequest = async () => {
  localStorage.clear();
  return { success: true, data: null, error: null };
};

export const registerRequest = () => {};

export const getGroupsRequest = async (search = "") => {
  try {
    const response = await axios.get(BASE_URL + GROUPS_URL + "?name=" + search);
    if (response.status === 200) {
      return { success: true, data: response.data, error: null };
    }
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const createGroupRequest = async (groupName) => {
  try {
    const response = await axios.post(BASE_URL + CREATE_GROUP_URL, {
      name: groupName,
    });
    if (response.status === 201) {
      return { success: true, data: response.data, error: null };
    }
    return { success: false, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const getUserRequest = async () => {
  try {
    const response = await axios.get(BASE_URL + USERS_URL);
    if (response.status === 200) {
      return { success: true, data: response.data, error: null };
    }
    return { success: false, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const addMemberRequest = async (groupId, memberId) => {
  try {
    const response = await axios.post(BASE_URL + ADD_MEMBER_URL + groupId, {
      memberId,
    });
    if (response.status === 200) {
      return { success: true, data: response.data, error: null };
    }
    return { success: false, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const createUserRequest = async (user) => {
  try {
    const response = await axios.post(BASE_URL + CREATE_USER_URL, {
      ...user,
    });
    if (response.status === 200) {
      return { success: true, data: response.data, error: null };
    }
    return { success: false, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};
