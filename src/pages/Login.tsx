import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { appConfig } from '../config/app.config';

export default function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: 'teste@teste.com',
        password: '',
    });
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login tentativa", appConfig.isDevelopment);
        
        try {
            const success = await login(formData.email, formData.password);
            if (success) {
                console.log("Login bem-sucedido");
                navigate('/', { replace: true });
            } else {
                console.log("Login falhou");
                alert('Credenciais inválidas');
            }
        } catch (error) {
            console.error("Erro no login:", error);
            alert('Erro ao realizar login');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-center w-full lg:p-12">
                    <div className="flex items-center xl:p-10">
                        <form onSubmit={handleSubmit} className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
                            <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">Entrar</h3>
                            <p className="mb-4 text-grey-700">Digite seu email e senha</p>
                            <a className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300">
                                <img className="h-5 mr-2" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png" alt="" />
                                <span>Sign in with Google</span>
                            </a>
                            <div className="flex items-center mb-3">
                                <hr className="h-0 border-b border-solid border-grey-500 grow" />
                                <p className="mx-4 text-grey-600">or</p>
                                <hr className="h-0 border-b border-solid border-grey-500 grow" />
                            </div>
                            <label className="mb-2 text-sm text-start text-grey-900">Email*</label>
                            <input 
                                id="email" 
                                type="email" 
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="seu@email.com" 
                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl" 
                            />
                            <label className="mb-2 text-sm text-start text-grey-900">Password*</label>
                            <input 
                                id="password" 
                                type="password" 
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Digite sua senha" 
                                className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl" 
                            />
                            <div className="flex flex-row justify-between mb-8">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                        Lembrar-me
                                    </label>
                                </div>
                                <a href="javascript:void(0)" className="mr-4 text-sm font-medium text-purple-blue-500">Forget password?</a>
                            </div>
                            <button 
                                type="submit"
                                className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 bg-blue-600"
                            >
                                Entrar
                            </button>
                            <p className="text-sm leading-relaxed text-grey-900">Not registered yet? <a href="javascript:void(0)" className="font-bold text-grey-700">Create an Account</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}