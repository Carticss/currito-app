import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { AuthRepository } from '../repositories/AuthRepository';

export const useLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

    const maskEmail = (email: string): string => {
        const [localPart, domain] = email.split('@');
        if (!localPart || !domain) return email;

        const [domainName, domainExt] = domain.split('.');
        const maskedLocal = localPart.substring(0, Math.min(3, localPart.length)) + '*******';
        const maskedDomain = domainName.charAt(0) + '***';

        return `${maskedLocal}@${maskedDomain}.${domainExt}`;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setUnverifiedEmail(null);
        setLoading(true);

        try {
            const response = await AuthRepository.login({ email, password });

            // Check if user email is confirmed
            if (!response.user.isUserConfirmed) {
                setUnverifiedEmail(maskEmail(response.user.email));
                setLoading(false);
                return;
            }

            // User is confirmed, proceed with login
            login(response.user, response.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        togglePasswordVisibility,
        handleLogin,
        error,
        loading,
        unverifiedEmail,
    };
};
