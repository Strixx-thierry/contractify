# Contractify

A modern, AI-powered contract management platform that helps you analyze contracts for risks and generate custom legal agreements.

## Features

### 🔍 Contract Scanner
- **AI-Powered Analysis**: Upload or paste contracts to identify risks, obligations, and key timeframes
- **Multiple File Formats**: Supports PDF, DOCX, and TXT files
- **Drag & Drop**: Easy file upload with drag-and-drop functionality
- **Detailed Insights**: Get comprehensive analysis including:
  - Business impact summary
  - Key obligations and responsibilities
  - Risk assessment with severity levels
  - Time-bound deadlines and milestones

### 📄 Template Library
- **Pre-built Templates**: Access professionally crafted contract templates
- **Category Filtering**: Browse by Business, Employment, Real Estate, Services, and Legal
- **Instant Downloads**: Download templates as PDF files
- **Search Functionality**: Quickly find the template you need

### ✨ AI Template Generator
- **Custom Contract Creation**: Describe your needs and let AI draft a professional contract
- **Multiple Export Formats**: Download generated contracts as PDF or DOCX
- **Powered by OpenRouter**: Uses advanced AI models for high-quality output

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: React Awesome Reveal
- **PDF Processing**: PDF.js
- **DOCX Processing**: Mammoth.js
- **Document Generation**: jsPDF, docx, file-saver
- **AI Integration**: OpenRouter API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key (for AI features)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Contractify.git
cd Contractify
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_OPEN_ROUTER_API_KEY=your_openrouter_api_key_here
```

**Getting an OpenRouter API Key:**
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the key to your `.env.local` file

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
Contractify/
├── src/
│   ├── components/          # Reusable components
│   │   └── Header.jsx       # Navigation header with share/bookmark
│   ├── Pages/               # Main application pages
│   │   ├── Home.jsx         # Landing page
│   │   ├── Templates.jsx    # Template library & AI generator
│   │   └── ContractScanner.jsx  # Contract analysis tool
│   ├── data/                # Static data files
│   │   └── templates.json   # Template metadata
│   ├── content/             # Template PDF files
│   ├── App.jsx              # Main app component with routing
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── .env.local              # Environment variables (create this)
└── package.json            # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage

### Analyzing a Contract

1. Navigate to the **Scanner** page
2. Upload a contract file (PDF, DOCX, or TXT) or paste text directly
3. Optionally specify your main concerns (e.g., "payment terms")
4. Click **"Scan for Contract Red Flags"**
5. Review the analysis across different tabs:
   - **Summary**: Overview of key points
   - **Risks**: Detailed risk assessment
   - **Time**: Deadlines and timeframes
   - **Impact**: Business obligations

### Using Templates

1. Navigate to the **Templates** page
2. Browse or search for templates
3. Filter by category if needed
4. Click **"Download Template"** to get the PDF

### Generating Custom Contracts

1. Navigate to the **Templates** page
2. Click the **"AI Generator"** button
3. Describe your contract requirements
4. Click **"Generate Contract"**
5. Review the generated text
6. Download as PDF or DOCX

## Features in Detail

### Share & Bookmark
- **Share**: Copy the current page URL or share to social media platforms
- **Bookmark**: Quick instructions for bookmarking pages (Ctrl+D / Cmd+D)

### Responsive Design
- Fully responsive layout optimized for desktop, tablet, and mobile devices
- Modern UI with gradients and glassmorphism effects

### Privacy-First
- All document processing happens client-side
- No data is stored on servers
- Your contracts remain private

## Environment Variables

| Variable                   | Description                        | Required              |
|----------------------------|------------------------------------|-----------------------|
| `VITE_OPEN_ROUTER_API_KEY` | OpenRouter API key for AI features | Yes (for AI features) |

## Troubleshooting

### PDF Upload Issues
- Ensure the PDF contains actual text (not scanned images)
- Check browser console (F12) for detailed error messages
- Try converting to DOCX or pasting text directly

### API Errors
- Verify your OpenRouter API key is correct
- Check that you have sufficient API credits
- Ensure the `.env.local` file is in the root directory

### Build Errors
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`
- Ensure you're using Node.js v16 or higher

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
