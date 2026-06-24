import axios from 'src/utils/axios';
import BaseAPI from './base-api';

const table = 'announcement';

export default class AnnouncementAPI extends BaseAPI {
  constructor() {
    super(table);
  }

  async uploadImage(imageFile: File) {
    const formData = new FormData();
    formData.append('file', imageFile);
    return axios.axiosInstanceWithLoading
      .post('/admin/announcement/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to upload announcement image:', error);
        throw error;
      });
  }
}
