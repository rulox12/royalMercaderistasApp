import axios from 'axios';
import { API_URL } from '../config';

const apiUrl = API_URL;

export class UserService {
    async update(userId: string, update: any) {
        try {
            const response = await axios.put(`${apiUrl}/users/${userId}`, update);

            if (response.status === 200) {
                return response.data;
            } else {
                return response.data;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            return false;
        }
    }
}
