import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, FileText, ArrowRight, Upload, X } from 'lucide-react';
import Header from '../components/Header';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker - use local worker file to avoid CDN issues with Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

// Hero Section
const HeroSection = () => (
  <div className="w-full bg-black text-white py-12 max-md:py-8">
    <div className="max-w-6xl mx-auto px-6">
      <h1 className="text-3xl max-md:text-2xl font-medium mb-3">Contract Scanner</h1>
      <p className="text-lg max-md:text-base text-white/80 max-w-[700px]">
        AI-powered contract analysis to identify risks, obligations, and problematic clauses. Get instant insights on any legal agreement.
      </p>
    </div>
  </div>
);

// Contract Input Component with File Upload
const ContractInput = ({ contractText, onTextChange, concerns, onConcernsChange, uploadedFile, onFileUpload, onFileClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-900">
          Main Concerns (Optional)
        </label>
        <input
          type="text"
          value={concerns}
          onChange={(e) => onConcernsChange(e.target.value)}
          placeholder="e.g., payment terms, liability clauses..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-900">
          Contract Document
        </label>

        {/* File Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition ${isDragging
            ? 'border-black bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
            }`}
        >
          {uploadedFile ? (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={onFileClear}
                className="p-1 hover:bg-gray-200 rounded transition"
                title="Remove file"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Drag and drop your contract here, or
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="text-sm text-black font-medium cursor-pointer hover:underline">
                  browse files
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supports PDF, DOCX, and TXT files
              </p>
            </>
          )}
        </div>

        {/* Text Area */}
        <div className="mt-3">
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Or paste contract text directly
          </label>
          <textarea
            value={contractText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Paste your contract text here..."
            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );
};

// Tab Navigation
const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <div className="border-b border-gray-200">
    <div className="flex">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-6 py-3 text-sm font-medium transition ${activeTab === tab.id
            ? 'bg-black text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

// Risk Item Component
const RiskItem = ({ risk, index }) => (
  <div className="border-l-2 border-gray-200 pl-4">
    <div className="font-bold text-sm mb-2">{risk.title}</div>
    <div className="flex items-center gap-2 mb-2">
      <span className="px-3 py-1 text-xs rounded-full border border-gray-300 bg-white">
        Risk {index + 1}
      </span>
      <span
        className={`px-3 py-1 text-xs rounded-full ${risk.severity === 'high'
          ? 'bg-red-100 text-red-800'
          : risk.severity === 'medium'
            ? 'bg-orange-100 text-orange-800'
            : 'bg-yellow-100 text-yellow-800'
          }`}
      >
        {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
      </span>
    </div>
    <p className="text-sm text-gray-700 mb-2">{risk.explanation}</p>
    {risk.mitigation && (
      <div className="flex gap-2 items-start">
        <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={14} />
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-green-700">Mitigation:</span> {risk.mitigation}
        </p>
      </div>
    )}
  </div>
);

// Summary Tab - Overview of Everything
const SummaryOverview = ({ summary, obligations, risks, timeframes, onSeeAllRisks, onSeeAllTime }) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-bold text-base mb-3">Business Impact</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
    </div>

    <div>
      <h4 className="font-bold text-base mb-3">Key Obligations</h4>
      <ul className="space-y-2">
        {obligations.slice(0, 3).map((obligation, idx) => (
          <li key={idx} className="flex gap-2 text-sm text-gray-700">
            <span className="text-gray-400">•</span>
            <span>{obligation}</span>
          </li>
        ))}
      </ul>
    </div>

    {risks && risks.length > 0 && (
      <div>
        <h4 className="font-bold text-base mb-3">Top Risks</h4>
        <div className="space-y-3">
          {risks.slice(0, 2).map((risk, idx) => (
            <RiskItem key={idx} risk={risk} index={idx} />
          ))}
        </div>
        {risks.length > 2 && (
          <button
            onClick={onSeeAllRisks}
            className="mt-3 text-sm text-gray-600 hover:text-gray-900 underline"
          >
            see more
          </button>
        )}
      </div>
    )}

    <div>
      <h4 className="font-bold text-base mb-3">Time</h4>
      {timeframes && timeframes.length > 0 ? (
        <>
          <div className="space-y-3">
            {timeframes.slice(0, 2).map((item, idx) => (
              <div key={idx} className="border-l-2 border-blue-200 pl-4">
                <div className="font-medium text-sm text-gray-900 mb-1">{item.title}</div>
                <p className="text-sm text-gray-700">{item.description}</p>
                {item.deadline && (
                  <p className="text-xs text-blue-600 mt-1">⏱️ {item.deadline}</p>
                )}
              </div>
            ))}
          </div>
          {timeframes.length > 2 && (
            <button
              onClick={onSeeAllTime}
              className="mt-3 text-sm text-gray-600 hover:text-gray-900 underline"
            >
              see more
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-500 italic">
          No specific timeframes or deadlines identified in this contract.
        </p>
      )}
    </div>
  </div>
);

// All Risks Tab
const AllRisksTab = ({ risks }) => (
  <div>
    <h3 className="font-bold text-base mb-4">All Risks</h3>
    <div className="space-y-3">
      {risks.map((risk, idx) => (
        <RiskItem key={idx} risk={risk} index={idx} />
      ))}
    </div>
  </div>
);

// Time Tab
const TimeTab = ({ timeframes }) => (
  <div>
    <h3 className="font-bold text-base mb-4">Time-Bound Obligations</h3>
    {timeframes && timeframes.length > 0 ? (
      <div className="space-y-3">
        {timeframes.map((item, idx) => (
          <div key={idx} className="border-l-2 border-blue-200 pl-4">
            <div className="font-medium text-sm text-gray-900 mb-1">{item.title}</div>
            <p className="text-sm text-gray-700">{item.description}</p>
            {item.deadline && (
              <p className="text-xs text-blue-600 mt-1">⏱️ {item.deadline}</p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500 italic">
        No specific timeframes or deadlines identified in this contract.
      </p>
    )}
  </div>
);

// Impact Tab - Full Summary & Obligations
const ImpactTab = ({ summary, obligations }) => (
  <div>
    <h3 className="font-bold text-base mb-3">Business Impact</h3>
    <p className="text-gray-700 text-sm leading-relaxed mb-6">{summary}</p>

    <h4 className="font-bold text-base mb-3">All Obligations</h4>
    <ul className="space-y-2">
      {obligations.map((obligation, idx) => (
        <li key={idx} className="flex gap-2 text-sm text-gray-700">
          <span className="text-gray-400">•</span>
          <span>{obligation}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Analysis Results Component
const AnalysisResults = ({ results }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'risks', label: 'Risks' },
    { id: 'time', label: 'Time' },
    { id: 'impact', label: 'Impact' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="p-6">
        {results ? (
          <>
            {activeTab === 'summary' && (
              <SummaryOverview
                summary={results.summary}
                obligations={results.obligations}
                risks={results.risks}
                timeframes={results.timeframes}
                onSeeAllRisks={() => setActiveTab('risks')}
                onSeeAllTime={() => setActiveTab('time')}
              />
            )}
            {activeTab === 'risks' && (
              <AllRisksTab risks={results.risks} />
            )}
            {activeTab === 'time' && (
              <TimeTab timeframes={results.timeframes} />
            )}
            {activeTab === 'impact' && (
              <ImpactTab
                summary={results.summary}
                obligations={results.obligations}
              />
            )}
          </>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No analysis results yet. Upload a contract or paste text to get started.
          </p>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-600 border-t border-gray-200">
        this is not professional advice - just an ai powered summary of common redflags. consult a lawyer for additional guidance
      </div>
    </div>
  );
};

// Main Component
const ContractScanner = () => {
  const [contractText, setContractText] = useState('');
  const [concerns, setConcerns] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // File parsing functions with enhanced error handling
  const extractTextFromPDF = async (file) => {
    try {
      console.log('📄 Starting PDF extraction for:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      console.log('✓ ArrayBuffer loaded, size:', arrayBuffer.byteLength);

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      console.log('✓ PDF loaded successfully, pages:', pdf.numPages);

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
        console.log(`✓ Page ${i}/${pdf.numPages} extracted`);
      }

      console.log('✓ PDF extraction complete. Total text length:', fullText.length);
      return fullText;
    } catch (error) {
      console.error('❌ PDF extraction error:', error);
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
  };

  const extractTextFromDOCX = async (file) => {
    try {
      console.log('📄 Starting DOCX extraction for:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      console.log('✓ ArrayBuffer loaded, size:', arrayBuffer.byteLength);

      const result = await mammoth.extractRawText({ arrayBuffer });
      console.log('✓ DOCX extraction complete. Text length:', result.value.length);

      if (result.messages && result.messages.length > 0) {
        console.warn('⚠️ DOCX extraction warnings:', result.messages);
      }

      return result.value;
    } catch (error) {
      console.error('❌ DOCX extraction error:', error);
      throw new Error(`DOCX extraction failed: ${error.message}`);
    }
  };

  const extractTextFromTXT = async (file) => {
    try {
      console.log('📄 Starting TXT extraction for:', file.name);
      const text = await file.text();
      console.log('✓ TXT extraction complete. Text length:', text.length);
      return text;
    } catch (error) {
      console.error('❌ TXT extraction error:', error);
      throw new Error(`TXT extraction failed: ${error.message}`);
    }
  };

  const handleFileUpload = async (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();

    console.log('=== File Upload Started ===');
    console.log('File name:', file.name);
    console.log('File type:', fileExtension);
    console.log('File size:', file.size, 'bytes');

    // Validate file type
    if (!['pdf', 'docx', 'txt'].includes(fileExtension)) {
      alert('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Please upload a file smaller than 10MB.');
      return;
    }

    setUploadedFile(file);
    setIsProcessingFile(true);

    try {
      let extractedText = '';

      if (fileExtension === 'pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (fileExtension === 'docx') {
        extractedText = await extractTextFromDOCX(file);
      } else if (fileExtension === 'txt') {
        extractedText = await extractTextFromTXT(file);
      }

      // Check if we actually got any text
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the file. The file may be empty, contain only images, or be a scanned document.');
      }

      console.log('=== File Upload Successful ===');
      console.log('Extracted text length:', extractedText.length);
      console.log('First 100 characters:', extractedText.substring(0, 100));

      setContractText(extractedText);
    } catch (error) {
      console.error('=== File Upload Failed ===');
      console.error('Error details:', error);

      const errorMessage = error.message || 'Unknown error occurred';
      alert(`Failed to extract text from file:\n\n${errorMessage}\n\nPlease try again or paste the text directly.\n\nCheck the browser console (F12) for more details.`);
      setUploadedFile(null);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileClear = () => {
    console.log('Clearing uploaded file');
    setUploadedFile(null);
    setContractText('');
  };

  const analyzeContract = async () => {
    const apiKey = import.meta.env.VITE_OPEN_ROUTER_API_KEY;

    if (!apiKey) {
      alert('API key not configured. Please set VITE_OPEN_ROUTER_API_KEY in your .env file');
      return;
    }

    setIsAnalyzing(true);

    try {
      const maxTokens = 32768;
      const reservedTokens = 3000;
      const maxContractTokens = maxTokens - reservedTokens;

      let processedText = contractText;
      let truncationWarning = '';

      if (contractText.length > maxContractTokens * 4) {
        const keepFirst = Math.floor((maxContractTokens * 4) * 0.75);
        const keepLast = (maxContractTokens * 4) - keepFirst;

        processedText =
          contractText.substring(0, keepFirst) +
          '\n\n[...section removed...]\n\n' +
          contractText.substring(contractText.length - keepLast);

        const removedChars = contractText.length - keepFirst - keepLast;
        truncationWarning = `WARNING: Removed ${removedChars} characters (middle sections truncated). `;
      }

      const prompt = `${truncationWarning}Analyze this contract/agreement. ${concerns ? `Focus on: ${concerns}.` : ''
        }
      
      Return JSON with this exact structure:
      {
        "summary": "Brief overview of the agreement in 2-3 sentences",
        "obligations": ["responsibility 1", "responsibility 2", ...],
        "timeframes": [
          {
            "title": "Action or deliverable",
            "description": "What needs to happen and who is responsible",
            "deadline": "Time requirement (e.g., within 30 days, by Q4 2024)"
          }
        ],
        "risks": [
          {
            "title": "Risk name",
            "severity": "high|medium|low",
            "explanation": "Why this matters",
            "mitigation": "How to address it"
          }
        ]
      }
      
      For timeframes: Extract any time-bound obligations, deadlines, payment schedules, deliverable due dates, or performance milestones. Include who must do what and by when. If none exist, return empty array.
      
      Contract text: ${processedText}`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistralai/mixtral-8x7b-instruct',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Analysis failed');
      }

      const analysis = JSON.parse(data.choices[0].message.content);
      setResults(analysis);

    } catch (error) {
      console.error('Analysis error:', error);
      alert(`Failed to analyze: ${error.message}`);
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <HeroSection />

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto px-6 py-8">
        <div className="sticky top-6 self-start">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1">Input Contract</h2>
              <p className="text-sm text-gray-500">Upload a document or paste text</p>
            </div> */}

            <ContractInput
              contractText={contractText}
              onTextChange={setContractText}
              concerns={concerns}
              onConcernsChange={setConcerns}
              uploadedFile={uploadedFile}
              onFileUpload={handleFileUpload}
              onFileClear={handleFileClear}
            />

            {isProcessingFile && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Processing file... This may take a moment for large documents.
                </p>
              </div>
            )}

            <button
              onClick={analyzeContract}
              disabled={isAnalyzing || !contractText || isProcessingFile}
              className="w-full mt-6 bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isAnalyzing ? 'Analyzing...' : 'Scan for Contract Red Flags'}
            </button>
          </div>
        </div>

        <div>
          <AnalysisResults results={results} />
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-sm py-9 bg-white text-black/40 flex items-center justify-center flex-wrap text-center px-4 border-t border-gray-200 mt-12">
        Contractify does not store your data. By using this tool, you agree to our{' '}
        <button className="hover:underline text-black/70 pl-1">
          Terms of Service
        </button>
      </div>
    </div>
  );
};

export default ContractScanner;