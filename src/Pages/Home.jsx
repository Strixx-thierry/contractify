import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, FileText, ArrowRight, Share2, Bookmark, Shield, Zap, Clock, CheckCircle, ChevronDown } from 'lucide-react';
import { FiArrowRight } from "react-icons/fi";
import { FaCaretDown } from "react-icons/fa6";
import { Faqs } from '../content/data'
import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import templatesData from '../data/templates.json';
import Header from '../components/Header';

// Custom reveal animation
const customAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

function Templates() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeIndex, setActiveIndex] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showContent, setShowContent] = useState(false);

    const categories = ['All', 'Business', 'Employment', 'Real Estate', 'Services', 'Legal'];

    // Load templates from JSON file
    const templates = templatesData;

    const faqs = [
        {
            question: 'Are these contract templates legally binding?',
            answer: 'Yes, all our templates are professionally drafted to be legally sound. However, we recommend having them reviewed by a legal professional before use, as laws vary by jurisdiction.'
        },
        {
            question: 'Can I customize the downloaded templates?',
            answer: 'Absolutely! All templates are provided in editable PDF format, allowing you to customize them to fit your specific needs and circumstances.'
        },
        {
            question: 'Do I need to create an account to download templates?',
            answer: 'No account is required. You can download any template instantly and for free. We prioritize your privacy and don\'t store any personal information.'
        },
        {
            question: 'How often are templates updated?',
            answer: 'Our legal team regularly reviews and updates templates to ensure they comply with current laws and best practices. Major updates are made quarterly.'
        },
        {
            question: 'Can I use the Contract Scanner with these templates?',
            answer: 'Yes! After customizing your template, you can upload it to our Contract Scanner to identify potential risks and ensure comprehensive protection.'
        }
    ];

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDownload = (template) => {
        // Create a link element and trigger download of the actual PDF file
        const link = document.createElement('a');
        link.href = template.filePath;
        link.download = template.fileName;
        link.target = '_blank'; // Open in new tab as fallback
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('Downloading:', template.fileName);
    };

    const handleShare = () => {
        alert('Share functionality would be implemented here');
    };

    const handleBookmark = () => {
        alert('Bookmark functionality would be implemented here');
    };

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setShowContent(true), 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 30);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-col items-start justify-start bg-white">
            {/* Navigation */}
            <Header />
            <div className="w-full bg-black text-white relative overflow-hidden">
                {/* <div className="absolute top-[-200px] left-[-200px] aspect-square h-[800px] w-[600px] bg-stone-500/45 rounded-full blur-[130px]"></div> */}


                {/* Hero Section */}
                <div className="max-w-[1200px] mx-auto px-10 max-md:px-4 pt-10 pb-16 max-md:pb-10 relative ">
                    <div className="flex flex-col items-center justify-center gap-5 text-center">
                        <h1 className="text-4xl max-md:text-3xl font-medium max-w-[700px]">
                            Contract Templates & AI Scanner
                        </h1>
                        <p className="text-lg max-md:text-base text-white/80 max-w-[700px]">
                            Download professionally drafted contract templates or scan your existing contracts with AI. Get risk analysis, safety scores, and identify problematic clauses instantly.
                        </p>



                        <div className="flex items-center gap-4 max-md:flex-col max-md:w-full">
                            <Link to="/app/Templates" className="h-fit select-none rounded-xl text-sm font-normal">
                                <button
                                    onClick={() => handleDownload('Legal-Contract-Templates')}
                                    className="h-11 select-none min-w-[160px] rounded-xl text-base font-semibold px-6 flex items-center justify-center gap-2 bg-white transition active:scale-95 text-black"
                                >
                                    Browse Templates
                                    <Download className="w-4 h-4" />
                                </button>
                            </Link>
                            <Link to="/app/scanner" className="h-fit select-none rounded-xl text-sm font-normal">


                                <button className="h-11 select-none min-w-[160px] rounded-xl text-base font-semibold px-6 flex items-center justify-center gap-2 bg-transparent border border-white/55 transition active:scale-95 text-white hover:bg-white/10">
                                    Scan Contract
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className='mx-auto '>
                <Reveal triggerOnce keyframes={customAnimation}>
                    <div className="w-full bg-white py-20 max-md:py-10 px-10 max-md:px-4">
                        <div className="max-w-[1200px] flex flex-col ">
                            <div className="text-center mb-12">
                                <p className="text-sm font-normal text-black/70 mb-2">Why Choose Our Templates</p>
                                <h2 className="text-3xl max-md:text-2xl font-medium text-black mb-4">
                                    Professional Templates, Zero Cost
                                </h2>
                                <p className="text-base text-black/70 max-w-[600px] mx-auto">
                                    Get access to legally sound contract templates crafted by professionals, completely free.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="p-6 rounded-2xl bg-stone-100 flex flex-col items-start gap-3">
                                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-black">Legally Vetted</h3>
                                    <p className="text-sm text-black/70">
                                        this templates are not legally vetted so when using the template .
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-stone-100 flex flex-col items-start gap-3">
                                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-black">Instant Download</h3>
                                    <p className="text-sm text-black/70">
                                        No signup required. Click download and get your template immediately in editable format.
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-stone-100 flex flex-col items-start gap-3">
                                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-black">Easy Customization</h3>
                                    <p className="text-sm text-black/70">
                                        All templates are fully editable, allowing you to tailor them to your specific needs.
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-stone-100 flex flex-col items-start gap-3">
                                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-black">Regular Updates</h3>
                                    <p className="text-sm text-black/70">
                                        Our templates are updated quarterly to reflect current laws and best practices.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>

            </div>

            {/* Search and Filter Section */}
            <div className=' w-full'>
                <Reveal triggerOnce keyframes={customAnimation}>
                    <div className="w-full  bg-stone-50 py-8 px-10 max-md:px-4 border-y border-stone-200">
                        <div className="max-w-[1200px] mx-auto items-center flex flex-col gap-6">
                            <div className="relative w-full max-w-[600px]">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-stone-300 focus:outline-none focus:border-black transition bg-white text-black"
                                />
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === category
                                            ? 'bg-black text-white'
                                            : 'bg-white text-black border border-stone-300 hover:border-black'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <p className="text-sm text-stone-600">
                                Showing {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
                            </p>
                        </div>
                    </div>

                </Reveal>

            </div>

            {/* Templates Grid */}
            <div className="w-full py-12 px-10 max-md:px-4 bg-white">
                <div className="max-w-[1200px] mx-auto">
                    {filteredTemplates.length === 0 ? (
                        <div className="text-center py-16">
                            <FileText className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                            <p className="text-lg text-stone-500">No templates found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg transition flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs font-medium px-3 py-1 bg-stone-100 text-black rounded-full">
                                                    {template.category}
                                                </span>
                                                {template.popular && (
                                                    <span className="text-xs font-medium px-3 py-1 bg-black text-white rounded-full">
                                                        Popular
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-black mb-2">
                                            {template.title}
                                        </h3>
                                        <p className="text-sm text-black/60 mb-4 leading-relaxed">
                                            {template.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-black/50 mb-4">
                                            <span>{template.fileType}</span>
                                            <span>•</span>
                                            <span>{template.downloads} downloads</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(template)}
                                        className="w-full h-11 bg-black text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-stone-800 transition active:scale-95"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Template
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* FAQs Section */}
            <div className="w-full bg-stone-100 py-20 max-md:py-10 px-10 max-md:px-4">
                <Reveal triggerOnce keyframes={customAnimation} className='w-full'>
                    <div className="max-w-[900px] mx-auto">
                        <div className="text-center mb-10">
                            <p className="text-sm font-normal text-black/70 mb-2">FAQs</p>
                            <h2 className="text-3xl max-md:text-2xl font-medium text-black mb-3">
                                Common Questions
                            </h2>
                            <p className="text-base text-black/70 max-w-[540px] mx-auto">
                                If you cannot find the information you are looking for, please contact us for further assistance.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="py-4 px-5 bg-white rounded-xl flex justify-between items-start gap-5"
                                >
                                    <div className="flex flex-col items-start justify-start flex-1">
                                        <h3 className="font-normal text-base leading-5 min-h-[30px] w-full flex items-center">
                                            {faq.question}
                                        </h3>
                                        <p
                                            className={`text-sm text-black/50 leading-5 font-normal transition-all duration-500 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-96 mt-2' : 'max-h-0'
                                                }`}
                                        >
                                            {faq.answer}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleAnswer(index)}
                                        className="h-[30px] aspect-square rounded-full transition duration-150 active:scale-90 text-black hover:bg-stone-200 flex items-center justify-center flex-shrink-0"
                                    >
                                        <ChevronDown
                                            className={`w-5 h-5 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Footer */}
            <div className="w-full text-sm py-9 bg-white text-black/40 flex items-center justify-center flex-wrap text-center px-4">
                Contractify does not store your data. By using this tool, you agree to our{' '}
                <Link to="/terms" className="hover:underline text-black/70 pl-1">
                    Terms of Service
                </Link>
            </div>
        </div>
    );
}

export default Templates;
