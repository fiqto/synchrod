# Synchrod

A modern JSON processing web application built with Next.js 15 that provides powerful tools for merging and transforming JSON files. Process files securely in your browser with a beautiful, responsive interface.

## ✨ Features

### 🔧 JSON Merge
- **Merge multiple JSON files** with compatible structures
- **Smart structure validation** with detailed error reporting  
- **Array and object merging** with automatic type detection
- **Real-time preview** of merged results

### 🔄 JSON Replacer
- **Field replacement** using reference data mapping
- **Advanced mapping rules** with preview functionality
- **Batch processing** with detailed statistics
- **Flexible transformation** options

### 🛡️ Privacy & Security
- **Client-side processing** - files never leave your browser
- **No data collection** - complete privacy protection
- **Secure file handling** with size limits and validation

### 🎨 Modern UI/UX
- **Dark theme** with custom color palette
- **Responsive design** optimized for all devices
- **Drag & drop** file upload with validation
- **Real-time feedback** and error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/synchrod.git
   cd synchrod
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS v4 with custom variables
- **State Management**: React hooks
- **File Processing**: Client-side JSON validation and processing

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── json-merge/        # JSON merge tool page
│   ├── json-replacer/     # JSON replacer tool page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── json-merge/       # JSON merge components
│   ├── json-replacer/    # JSON replacer components
│   ├── navigation/       # Navigation components
│   └── ui/              # Shared UI components
├── lib/                  # Core processing logic
│   ├── json-merger.ts   # JSON merge functionality
│   └── json-replacer.ts # JSON replacement functionality
└── types/               # TypeScript type definitions
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📖 Usage

### JSON Merge Tool
1. **Upload Files**: Drag & drop or select multiple JSON files
2. **Structure Validation**: Automatic compatibility checking
3. **Preview**: Review merged structure before download
4. **Download**: Get your unified JSON file

### JSON Replacer Tool
1. **Upload Files**: Upload entries file + assets reference file
2. **Select Fields**: Choose fields to replace with asset data
3. **Configure Mapping**: Set up field matching rules
4. **Process**: Transform and download results

## 🌐 Deployment

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/synchrod)

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy the `.next` folder to your hosting provider
```

### Environment Variables
No environment variables required - the app runs entirely client-side.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or run into issues, please:
- Check the [Issues](https://github.com/yourusername/synchrod/issues) section
- Create a new issue with detailed information
- Join the discussion in existing issues

## 🎯 Roadmap

- [ ] JSON Schema validation
- [ ] Data transformation templates  
- [ ] Export to multiple formats (CSV, XML)
- [ ] Advanced filtering options
- [ ] Batch processing improvements

---

Built with ❤️ using [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)