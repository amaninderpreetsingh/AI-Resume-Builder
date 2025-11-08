# AI Resume Builder

An intelligent resume builder that uses AI to create tailored, ATS-optimized resumes for specific job applications. Upload your existing resume or manually enter your career history, then generate professional, one-page resumes optimized for any job description.

## Features

- **AI-Powered Resume Generation** - Uses Google Gemini API to tailor resumes to specific job descriptions
- **Multiple Input Methods** - Upload existing resume (PDF/DOC/DOCX) or manually enter information
- **ATS Optimization** - AI optimizes content with relevant keywords for Applicant Tracking Systems
- **Resume Management** - Save and manage multiple resume versions for different job applications
- **Live Preview & Editing** - Preview and edit generated resumes before downloading
- **User Authentication** - Secure Google Sign-In and email/password authentication
- **Professional Templates** - Clean, modern resume layouts
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Comprehensive component library with 50+ components
- **React Router 6.30** - Client-side routing
- **TanStack React Query 5.83** - Server state management
- **React Hook Form 7.61** - Form management
- **Zod 3.25** - Schema validation

### Backend & Services
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication (Email/Password + Google OAuth)
  - Row Level Security (RLS)
  - Edge Functions (Deno runtime)
- **Google Gemini 2.5 Flash** - AI model for resume generation and parsing

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **next-themes** - Dark mode support

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (comes with Node.js)
- **Supabase Account** - [Sign up at supabase.com](https://supabase.com)

## Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd AI-Resume-Builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

   Then fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the database migrations from `supabase/migrations/`
   - Set up authentication providers (Google OAuth)
   - Deploy edge functions from `supabase/functions/`
   - Configure environment variables in Supabase dashboard

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:8080`

## Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: If deploying edge functions separately
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important:** Never commit the `.env` file to version control. It's already in `.gitignore`.

## Available Scripts

- `npm run dev` - Start development server (port 8080)
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
AI-Resume-Builder/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui component library
│   │   ├── ManualDataEntry.tsx
│   │   └── NavLink.tsx
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Third-party integrations
│   │   └── supabase/       # Supabase client & types
│   ├── lib/                # Utility functions
│   ├── pages/              # Application pages/routes
│   │   ├── Index.tsx       # Landing page
│   │   ├── Auth.tsx        # Authentication
│   │   ├── Dashboard.tsx   # Resume management
│   │   ├── ResumeBuilder.tsx
│   │   └── ResumePreview.tsx
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── supabase/
│   ├── functions/          # Edge functions
│   │   ├── generate-resume/
│   │   └── parse-resume/
│   └── migrations/         # Database migrations
├── public/                 # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Database Schema

### Tables
- **profiles** - User profile information
- **user_data** - User's career history (work experience, education, skills, etc.)
- **resumes** - Generated resume versions

All tables use Row Level Security (RLS) to ensure users can only access their own data.

## How It Works

1. **Sign Up/Sign In** - Users authenticate with email/password or Google OAuth
2. **Input Career Information** - Users can:
   - Upload an existing resume (AI parses and extracts information)
   - Manually enter work experience, education, skills, projects, and certifications
3. **Enter Job Details** - Provide target job title and optional job description
4. **Generate Resume** - AI analyzes job requirements and creates tailored content
5. **Preview & Edit** - Review generated resume and make edits inline
6. **Download** - Export resume as PDF (feature in progress)
7. **Save & Manage** - All resumes are saved to the dashboard for future access

## Features in Development

- LaTeX-based PDF generation
- Multiple resume templates
- Resume scoring and feedback
- Cover letter generation
- Skills gap analysis

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com)
- Backend powered by [Supabase](https://supabase.com)
- AI capabilities by [Google Gemini](https://deepmind.google/technologies/gemini)

---

**Note:** This project is in active development. Some features may be incomplete or subject to change.
