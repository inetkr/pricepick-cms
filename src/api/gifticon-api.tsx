import axios from 'src/utils/axios';

export default class GifticonAPI {
  async getProducts(params: Record<string, any>) {
    return axios.axiosInstanceWithLoading
      .get('/admin/gifticon/products', { params })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  async getProductDetail(id: string) {
    return axios.axiosInstanceWithLoading
      .get(`/admin/gifticon/products/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch:', error);
        throw error;
      });
  }

  async updateProductStatus(id: string, isActive: boolean) {
    return axios.axiosInstanceWithLoading
      .patch(`/admin/gifticon/products/${id}/status`, { isActive })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to update status:', error);
        throw error;
      });
  }

  async bulkImportProducts(fileName: string, importType: string, products: any[]) {
    const payload = {
      fileName,
      importType,
      details: products.map((product) => ({
        code: product.code.toString(),
        name: product.name,
        description: product.description,
      })),
    };

    return axios.axiosInstanceWithLoading
      .post('/admin/gifticon/bulk-import', payload)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to import products:', error);
        throw error;
      });
  }

  async getImportHistory(page: number, pageSize: number) {
    return axios.axiosInstanceWithLoading
      .get('/admin/gifticon/import-history', { params: { page, pageSize } })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch import history:', error);
        throw error;
      });
  }

  async getImportHistoryDetail(id: string) {
    return axios.axiosInstanceWithLoading
      .get(`/admin/gifticon/import-history/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to fetch import history detail:', error);
        throw error;
      });
  }

  async changeProductImage(productId: string, imageFile: File) {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('image', imageFile);
    return axios.axiosInstanceWithLoading
      .post('/admin/gifticon/change-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Failed to change product image:', error);
        throw error;
      });
  }
}
