import axios from 'axios';
import { toast } from 'react-toastify';
import { Errors } from '../../modules/messages/message.constants';
import { handleResponseError } from '../utils/apis.util';
import { removeFromStorage } from '../utils/storage.util';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (!!localStorage.getItem('token')) {
    config.headers.common['Authorization'] =
      'Bearer ' + localStorage.getItem('token');
  }
  config.headers.common['Access-Control-Allow-Origin'] = '*';
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    // Remove all toasts !
    toast.dismiss();

    if (!error.response) {
      toast.error('Unknown error happened! Please contact admin for support');
      return handleResponseError(error);
    }

    const { data } = error.response;
    const { detailError } = data;

    let messageDetail = '';
    let messageCode = '';

    if (error.response.status === 403) {
      removeFromStorage('token');
      if (!window.location.pathname.includes('login'))
        window.location.replace('/');
    }

    if (detailError) {
      if (Array.isArray(detailError.message)) {
        messageDetail = detailError.message[0];
        messageCode = detailError?.errorCode ?? '';
      } else {
        messageDetail = detailError.message;
        messageCode = detailError?.errorCode ?? '';
      }
    } else {
      messageDetail = data.message;
      messageCode = data?.errorCode ?? '';
    }

    if (messageCode !== '') {
      const error = Errors.find((error) => error.key === messageCode);
      if (error) toast.error((error.label));
      else toast.error(messageDetail);
    } else {
      toast.error(messageDetail);
    }
    
    if (error.response.status === 400) {
      return data;
    }

    return handleResponseError(error);
  }
);

export default axiosInstance;
