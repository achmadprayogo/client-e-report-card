import axios, { AxiosError, AxiosResponse } from 'axios';

function createAxiosJsonInstance() {
  return axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function getErrorType(error: AxiosError) {
  let errorType;
  if (axios.isAxiosError(error)) {
    if (error.response) {
      errorType = 'response';
      console.log('Response error:', error.response.data);
    } else if (error.request) {
      errorType = 'request';
    } else {
      errorType = 'error';
    }
  } else {
    errorType = 'error';
  }

  return errorType;
}

function errorResponse(error: AxiosError) {
  return {
    type: getErrorType(error),
    error: error.response?.data || error.message,
    status: error.status || 500,
  };
}

export async function getData(url: string) {
  try {
    const axiosJson = createAxiosJsonInstance();
    const response = await axiosJson.get(url);
    return response.data;
  } catch (error) {
    return errorResponse(error as AxiosError);
  }
}

export async function postData(url: string, data: any) {
  try {
    const axiosJson = createAxiosJsonInstance();
    const response = await axiosJson.post(url, data);
    return response;
  } catch (error) {
    return errorResponse(error as AxiosError);
  }
}

export async function patchData(url: string, data: any) {
  try {
    const axiosJson = createAxiosJsonInstance();
    const response = await axiosJson.patch(url, data);
    return response;
  } catch (error) {
    return errorResponse(error as AxiosError);
  }
}

export async function deleteData(url: string) {
  try {
    const axiosJson = createAxiosJsonInstance();
    const response = await axiosJson.delete(url);
    return response;
  } catch (error) {
    return errorResponse(error as AxiosError);
  }
}
