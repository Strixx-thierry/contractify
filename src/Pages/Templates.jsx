import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, FileText, ArrowRight, Share2, Bookmark, Zap, AlertCircle } from 'lucide-react';
import templatesData from '../data/templates.json';
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import Header from '../components/Header';

// Template Generator Component
const TemplateGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setError('');

        const apiKey = import.meta.env.VITE_OPEN_ROUTER_API_KEY;

        if (!apiKey) {
            setError('API key not configured. Please set VITE_OPEN_ROUTER_API_KEY in your .env file');
            setIsGenerating(false);
            return;
        }

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'mistralai/mixtral-8x7b-instruct',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert legal contract drafter. Create professional, detailed, and legally sound contracts based on user requirements. Output ONLY the contract text, no conversational filler.'
                        },
                        {
                            role: 'user',
                            content: `Write a professional contract for: ${prompt}. Include standard clauses for this type of agreement.`
                        }
                    ]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Generation failed');
            }

            setGeneratedContent(data.choices[0].message.content);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const splitText = doc.splitTextToSize(generatedContent, 180);

        let y = 20;
        doc.setFontSize(12);

        splitText.forEach(line => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, 15, y);
            y += 7;
        });

        doc.save('generated-contract.pdf');
    };

    const downloadDOCX = () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: generatedContent.split('\n').map(line =>
                    new Paragraph({
                        children: [new TextRun(line)],
                        spacing: { after: 200 }
                    })
                )
            }]
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, 'generated-contract.docx');
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 max-w-4xl mx-auto my-12">
             
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-stone-900">
                        Describe your contract needs
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g., I need a freelance web design contract for a client named ABC Corp, project fee $5000, 50% upfront..."
                        className="w-full h-32 px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-black text-white h-12 rounded-xl font-medium hover:bg-stone-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Drafting Contract...
                        </>
                    ) : (
                        <>
                            <Zap className="w-5 h-5" />
                            Generate Contract
                        </>
                    )}
                </button>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {generatedContent && (
                    <div className="mt-8 pt-8 border-t border-stone-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Generated Contract</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={downloadPDF}
                                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-sm font-medium transition flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    PDF
                                </button>
                                <button
                                    onClick={downloadDOCX}
                                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-sm font-medium transition flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    DOCX
                                </button>
                            </div>
                        </div>

                        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 max-h-[500px] overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                            {generatedContent}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

function Templates() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showGenerator, setShowGenerator] = useState(false);

    const categories = ['All', 'Business', 'Employment', 'Real Estate', 'Services', 'Legal'];

    // Load templates from JSON file
    const templates = templatesData;

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
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header />

            <div className="w-full bg-black text-white py-12 max-md:py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <h1 className="text-3xl max-md:text-2xl font-medium mb-3">Contract Templates</h1>
                    <p className="text-lg max-md:text-base text-white/80 max-w-[700px]">
                        Browse our collection of legally vetted contract templates, or use our AI generator to create a custom agreement.
                    </p>
                </div>
            </div>


            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">


                {/* Search and Filter Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 rounded-xl border border-stone-300 focus:outline-none focus:border-black transition bg-white text-black"
                            />
                        </div>

                        {/* Category Filter & Generator Toggle */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar items-center">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${selectedCategory === category
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black border border-stone-300 hover:border-black'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}

                            <div className="w-px h-8 bg-stone-200 mx-2"></div>

                            <button
                                onClick={() => setShowGenerator(!showGenerator)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex items-center gap-2 ${showGenerator
                                    ? 'bg-black text-white shadow-lg shadow-black/20'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                            >
                                <Zap size={14} />
                                {showGenerator ? 'Close Generator' : 'AI Generator'}
                            </button>
                        </div>
                    </div>

                    {!showGenerator && (
                        <div className="mt-4 pt-4 border-t border-stone-100">
                            <p className="text-sm text-stone-600">
                                Showing {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                {showGenerator ? (
                    <TemplateGenerator />
                ) : (
                    <div className="w-full bg-white rounded-2xl border border-stone-200 p-8 min-h-[400px]">
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
                                        className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg transition flex flex-col justify-between group"
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
                                            <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-stone-600 transition-colors">
                                                {template.title}
                                            </h3>
                                            <p className="text-sm text-black/60 mb-4 leading-relaxed line-clamp-2">
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
                )}
            </div>

            {/* Info Banner */}
            <div className="w-full bg-stone-100 py-12 px-10 max-md:px-4 mt-12">
                <div className="max-w-[1200px] mx-auto text-center">
                    <h2 className="text-2xl font-semibold text-black mb-3">Need Help with Your Contract?</h2>
                    <p className="text-black/70 mb-6 max-w-[600px] mx-auto">
                        After downloading, use our Contract Scanner to analyze your customized template for any potential risks or issues.
                    </p>
                    <Link to="/app/scanner">
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-stone-800 transition active:scale-95">
                            Open Contract Scanner
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full text-sm py-9 bg-white text-black/40 flex items-center justify-center flex-wrap text-center px-4 border-t border-stone-200">
                Contractify does not store your data. By using this tool, you agree to our{' '}
                <Link to="/terms" className="hover:underline text-black/70 pl-1">
                    Terms of Service
                </Link>
            </div>
        </div>
    );
}

export default Templates;
