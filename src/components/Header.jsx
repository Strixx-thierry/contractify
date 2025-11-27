import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Share2, Bookmark, X, Copy, Check, Facebook, Twitter, Linkedin } from 'lucide-react';
import AuthModal from './AuthModal';
import { getCurrentUser, logoutUser } from '../utils/api';
import { div } from 'framer-motion/client';

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    // eslint-disable-next-line
    const [showShareModal, setShowShareModal] = useState(false);
    // eslint-disable-next-line
    const [showBookmarkToast, setShowBookmarkToast] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getCurrentUser();
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                }
            } catch (error) {
                setUser(null);
            }
        };
        fetchUser();
    }, [location]);

    const handleLogout = async () => {
        try {
            await logoutUser();
            setUser(null);
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };



    const handleShare = () => {
        setShowShareModal(true);
    };

    const handleBookmark = () => {
        setShowBookmarkToast(true);
        setTimeout(() => setShowBookmarkToast(false), 3000);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setShowAuthModal(false);
    };

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <>
            <div className="w-full bg-black backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-white to-stone-700 rounded-xl flex items-center justify-center shadow-lg shadow-white/10 group-hover:scale-105 transition-transform duration-300">
                                <img src="/favicon.ico" alt="" className="w-6 h-6 opacity-90" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Contractify</span>
                        </Link>

                        {/* Navigation */}
                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 max-md:hidden backdrop-blur-sm">
                            <Link
                                to="/"
                                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive('/')
                                    ? 'bg-white text-black shadow-lg'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/app/scanner"
                                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive('/app/scanner')
                                    ? 'bg-white text-black shadow-lg'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Scanner
                            </Link>
                            <Link
                                to="/app/templates"
                                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive('/app/templates')
                                    ? 'bg-white text-black shadow-lg'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Templates
                            </Link>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-white/90 rounded-xl text-sm font-semibold transition-all duration-300">
                                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
                                        {user.username}
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 hidden group-hover:block">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (

                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-white/90 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Sign In
                                </button>
                            )}
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 max-md:hidden"
                            >
                                <Share2 size={16} />
                                <span className="max-md:hidden">Share</span>
                            </button>
                            <button
                                onClick={handleBookmark}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 max-md:hidden"
                            >
                                <Bookmark size={16} />
                                <span className="max-md:hidden">Bookmark</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowShareModal(false)}
                    />
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowShareModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-stone-500" />
                        </button>

                        <h3 className="text-xl font-bold mb-2">Share this page</h3>
                        <p className="text-stone-500 mb-6">Share this link with your team or friends.</p>

                        <div className="flex gap-4 mb-6 justify-center">
                            <button className="p-4 bg-[#1877F2]/10 text-[#1877F2] rounded-xl hover:scale-110 transition-transform">
                                <Facebook size={24} />
                            </button>
                            <button className="p-4 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-xl hover:scale-110 transition-transform">
                                <Twitter size={24} />
                            </button>
                            <button className="p-4 bg-[#0A66C2]/10 text-[#0A66C2] rounded-xl hover:scale-110 transition-transform">
                                <Linkedin size={24} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
                            <input
                                type="text"
                                value={window.location.href}
                                readOnly
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-stone-600 px-2"
                            />
                            <button
                                onClick={copyToClipboard}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${copied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-black text-white hover:bg-stone-800'
                                    }`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bookmark Toast */}
            {showBookmarkToast && (
                <div className="fixed top-24 right-6 z-[100] bg-black text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-300">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Bookmark size={20} className="fill-white" />
                    </div>
                    <div>
                        <p className="font-bold">Bookmark this page</p>
                        <p className="text-sm text-white/70">Press <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">Ctrl + D</kbd> to save</p>
                    </div>
                    <button
                        onClick={() => setShowBookmarkToast(false)}
                        className="ml-2 hover:bg-white/20 p-1 rounded-full transition"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Auth Modal */}
            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
};

export default Header;
