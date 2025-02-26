import axios from 'axios';
import { API_URL } from '../config';

const apiUrl = API_URL;

export class ShopService {

    async getAll(filters: any): Promise<boolean> {
        try {
            const response = await axios.get(`${apiUrl}/shops`, { params: filters });

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
