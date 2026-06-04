
import api from './index';

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', {
            email,
            password,
        });

        localStorage.setItem('token', response.data.token);
        router.push('/board');
        return null;
    } catch ({ error }) {
        return err.response?.data?.error || 'Login failed';
    }
}