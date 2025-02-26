import axios from 'axios';
import { API_URL } from '../config';

const apiUrl = API_URL;

export class CityService {

    async getAll() {
        try {
            const response = await axios.get(`${apiUrl}/cities`);

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
