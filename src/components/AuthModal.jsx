import React, { useState } from 'react';
import { X, Mail, Lock, User, Github } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { loginUser, registerUser } from '../utils/api';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (isSignUp && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (isSignUp && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                let response;
                if (isSignUp) {
                    response = await registerUser(formData);
                } else {
                    response = await loginUser({
                        email: formData.email,
                        password: formData.password
                    });
                }

                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }

                if (onLoginSuccess && response.data.user) {
                    onLoginSuccess(response.data.user);
                } else {
                    onClose();
                }
            } catch (error) {
                console.error('Auth error:', error);
                setErrors(prev => ({
                    ...prev,
                    submit: error.response?.data?.error || error.response?.data?.message || 'Authentication failed. Please try again.'
                }));
            }
        }
    };

    const handleSocialAuth = (provider) => {
        console.log(`Authenticating with ${provider}`);
        // Handle social authentication logic here
    };

    const switchMode = () => {
        setIsSignUp(!isSignUp);
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors z-10"
                >
                    <X size={20} className="text-stone-500" />
                </button>

                {/* Header */}
                <div className="p-8 pb-6">
                    <h2 className="text-2xl font-bold text-black mb-2">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-stone-500 text-sm">
                        {isSignUp
                            ? 'Sign up to get started with Contractify'
                            : 'Sign in to continue to Contractify'}
                    </p>
                </div>

                {/* Social Auth Buttons */}
                {/* <div className="px-8 pb-6">
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleSocialAuth('google')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-stone-200 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all duration-200 active:scale-95"
                        >
                            <FcGoogle size={20} />
                            <span className="text-sm font-medium text-black">Google</span>
                        </button>
                        <button
                            onClick={() => handleSocialAuth('github')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black border-2 border-black rounded-xl hover:bg-stone-800 transition-all duration-200 active:scale-95"
                        >
                            <Github size={20} className="text-white" />
                            <span className="text-sm font-medium text-white">GitHub</span>
                        </button>
                    </div>
                </div> */}

                {/* Divider */}
                {/* <div className="px-8 pb-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white text-stone-500">Or continue with email</span>
                        </div>
                    </div>
                </div> */}

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 pb-8">
                    <div className="space-y-4">
                        {/* Name Field (Sign Up Only) */}
                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.name
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-stone-200 focus:border-black'
                                            }`}
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.email
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-stone-200 focus:border-black'
                                        }`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.password
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-stone-200 focus:border-black'
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field (Sign Up Only) */}
                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.confirmPassword
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-stone-200 focus:border-black'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        )}

                        {/* Forgot Password (Sign In Only) */}
                        {!isSignUp && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-black hover:underline font-medium"
                                >
                                    {/* Forgot password? */}
                                </button>
                            </div>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {errors.submit}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-stone-800 transition-all duration-200 active:scale-95"
                    >
                        {isSignUp ? 'Create Account' : 'Sign In'}
                    </button>

                    {/* Switch Mode */}
                    <p className="text-center text-sm text-stone-600 mt-4">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            onClick={switchMode}
                            className="text-black font-semibold hover:underline"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
