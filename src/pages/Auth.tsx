import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/User/login' : '/api/User/register';
        
        try {
            const response = await fetch(`https://notenest-22y7.onrender.com${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                authService.setToken(data.token);
                navigate('/'); 
            } else {
                alert(data.message || 'Помилка авторизації');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>{isLogin ? 'Login to NoteNest' : 'Create Account'}</h2>
                <input 
                    type="user" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
                
                <p onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer'}}>
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </p>
            </form>
        </div>
    );
}