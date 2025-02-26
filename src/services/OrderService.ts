import axios from 'axios';
import { API_URL } from '@/config';

const apiUrl = API_URL;

export class OrderService {
    async create(request: any): Promise<boolean> {
        try {
            const response = await axios.post(`${apiUrl}/orders`, request);

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
