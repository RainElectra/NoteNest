export const authService = {
    setToken: (token: string) => {
        localStorage.setItem('token', token);
    },
    getToken: () => {
        return localStorage.getItem('token');
    },
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/auth'; 
    },
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    }
};