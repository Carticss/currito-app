import { useLogin } from './hooks/useLogin';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { Checkbox } from './components/Checkbox';
import Header from './components/Header';
import HidePasswordEye from './components/HidePasswordEye';
import './LoginPage.css';

export const LoginPage = () => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        togglePasswordVisibility,
        rememberMe,
        setRememberMe,
        handleLogin,
        error,
        loading,
        unverifiedEmail,
    } = useLogin();

    return (
        <div className="login-container">
            <div className="login-card">
                <Header />

                <form onSubmit={handleLogin} className="login-form">
                    <Input
                        id="email"
                        type="email"
                        label="Email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        label="Contraseña"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        rightElement={
                            <HidePasswordEye
                                togglePasswordVisibility={togglePasswordVisibility}
                                showPassword={showPassword}
                            />
                        }
                    />

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {unverifiedEmail && (
                        <div className="verification-message">
                            Verifica tu cuenta antes de acceder, te hemos enviado un mensaje al correo {unverifiedEmail}
                        </div>
                    )}

                    <div className="form-actions">
                        <Checkbox
                            label="Recordarme"
                            checked={rememberMe}
                            onChange={setRememberMe}
                        />
                        <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                    </div>

                    <Button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>

                    <div className="register-link">
                        ¿No tienes una cuenta? <a href="#">Regístrate</a>
                    </div>
                </form>
            </div>
        </div>
    );
};
