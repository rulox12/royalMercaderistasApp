import axios from 'axios';
import { API_URL } from '@/config';
interface User {
    id: string;
    email: string;
}

const apiUrl = API_URL;

export class AuthService {
    private currentUser: User | null = null;

    async login(email: string, password: string) {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, {
                email: email,
                password: password
            });

            if (response.status === 200) {
                const userJson = JSON.stringify(response.data.user);
                localStorage.setItem('user', userJson);
                localStorage.setItem('token', response.data.token)
                return {
                    status: response.status,
                    error: response.statusText
                }
            } else {
                return {
                    status: response.status,
                    error: response.statusText
                }
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            return {
                status: false,
                error: error.response.data.error
            }
        }
    }

    async logout(): Promise<void> {
        this.currentUser = null;
    }

    async getCurrentUser(): Promise<User | null> {
        if (!this.currentUser) {

        }
        return this.currentUser;
    }

    private async setCurrentUser(user: User): Promise<void> {
        this.currentUser = user;
    }
}
