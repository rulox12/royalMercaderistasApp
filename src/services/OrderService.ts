import axios from 'axios';

const apiUrl = "https://mercaderista.royalfruit.com.co/api";

export class OrderService {
    async create(request: any): Promise<boolean> {
        try {
            const response = await axios.post(`${apiUrl}/orders`, request);
            console.log(response);
            if (response.status === 200) {
                return response.data;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            return false;
        }
    }
    async getOrdersByDateAndShop(shopId: any, dates: any): Promise<boolean> {
        try {
            const response = await axios.post(`${apiUrl}/orders/get-orders-by-dates-and-shop`, { shopId, dates });
            console.log(response);
            if (response.status === 200) {
                return response.data;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            return false;
        }
    }

    async getAll(filters: any): Promise<boolean> {
        try {
            const response = await axios.get(`${apiUrl}/orders`, { params: filters });
            if (response.status === 200) {
                return response.data;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            return false;
        }
    }


}
