<p align="center"><a href="https://discord.com/invite/dsvFgDTr6c"><img height="60px" src="https://user-images.githubusercontent.com/31022056/158916278-4504b838-7ecb-4ab9-a900-7dc002aade78.png" alt="Join our Discord!"></a></p>

# Logs Table

A modern, feature-rich logs interface built with Next.js for displaying and managing user logs with advanced filtering, sorting, and export capabilities.

## Features

- 📊 Interactive data table with sorting and filtering
- 🔍 Advanced filtering capabilities:
  - Date range filtering
  - Checkbox-based filtering
  - Additional custom filters
- 📋 Column visibility management
- 📥 CSV export functionality
- 📋 JSON preview for detailed log inspection
- 📱 Responsive design
- 🌓 Dark/Light mode support
- 🔄 Real-time data updates
- 📋 Copy functionality with tooltips
- 🏷️ Status badges for log states

## Tech Stack

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**:
  - Radix UI primitives
  - Shadcn components
  - Custom components
- **Data Management**:
  - TanStack Table (React Table v8)
  - TanStack Query
- **Date Handling**: Day.js
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (LTS version)
- pnpm 10.8.1 or later

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Meeting-Baas/logs-table
   cd logs-table
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in the required environment variables in `.env`. Details about the expected values for each key is documented in .env.example

### Development

Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

 ### Building for Production  
  
To build the application for production:  
  
```bash  
pnpm build  
```  
  
You can then start the production server:  
  
```bash  
pnpm start  
```  
  
For deployment to hosting platforms like Vercel or Netlify, refer to their respective documentation for Next.js deployments.  

## Project Structure

```text
├── app/                    # Next.js app directory
│   ├── api/                # Backend API routes  
│   │   ├── report-error/   # Error reporting endpoints 
├── components/             # React components
│   ├── logs-table/         # Main logs table components
│   ├── ui/                 # Reusable UI components
│   └── ...
├── contexts/               # React contexts
├── lib/                    # Utility functions and helpers
│   ├── api.ts              # API client functions
│   ├── utils.ts            # Utility functions
│   └── ...
├── public/                 # Static assets
└── next.config.ts          # Proxy for API routes and image host configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add error reporting dialog'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

