# AI Resume Builder - Project Prompt

## Project Overview
Create a modern, user-friendly AI-powered resume builder web application that helps users generate tailored, professional one-page resumes optimized for specific job applications using the Gemini API. The website is going to be an ai resume builder using gemini api. The should have an area where the user can upload their old resume or manual add their job history and other aspects that would go a resume like skills, classes, project, ... Then the user should should be able to add a job title and job optional job description and the ai would would generate a one page resume that fits the role and job description from their past history.

## Core Functionality

### 1. User Authentication
- Implement Google Sign-In for user authentication
- Allow users to save their profile information and generated resumes
- Maintain user sessions securely

### 2. Resume Information Input
The application should support two methods for users to input their information:

#### A. File Upload
- Support upload of existing resumes in the following formats:
  - PDF (.pdf)
  - Microsoft Word (.doc, .docx)
- Automatically extract and parse information from uploaded resumes using AI
- Populate the user's profile with extracted data

#### B. Manual Entry
Allow users to manually input the following sections:
- **Contact Information**: Name, Email, Phone, Location, LinkedIn, Portfolio/Website
- **Work Experience**: Job Title, Company, Start Date, End Date, Description/Responsibilities
- **Education**: Degree, Institution, Graduation Date, GPA (optional), Relevant Coursework
- **Skills**: Technical skills, soft skills, tools, languages
- **Projects**: Project Name, Description, Technologies Used, Links
- **Certifications**: Certification Name, Issuing Organization, Date

**Date Format**: Use MM/YYYY format for consistency (e.g., "01/2020 - 12/2023" or "01/2020 - Present")

### 3. Job-Specific Resume Generation
- Provide input fields for:
  - **Target Job Title** (required)
  - **Job Description** (optional)
- When user clicks "Generate Resume":
  - Send user's complete profile data along with the target job title and description to Gemini API
  - AI should analyze the job requirements and select/prioritize the most relevant experiences, skills, and projects from the user's history
  - AI should tailor bullet points and descriptions to match job requirements
  - AI should optimize keywords for ATS (Applicant Tracking Systems)
  - Ensure the output fits on one page

### 4. Resume Rendering & Export
- Use **LaTeX** to generate professional-looking resumes
- Create a standard, clean LaTeX template that the application will populate with AI-generated content
- The AI should only provide the content (text, sections, bullet points), not create new formatting
- Display a live preview of the generated resume
- Allow users to edit the generated content before finalizing:
  - Edit text inline
  - Add/remove bullet points
  - Reorder sections
- Export final resume as PDF

### 5. Resume Management
- Allow users to save multiple versions of their resumes
- Display a dashboard showing previously generated resumes with:
  - Job title it was created for
  - Date created
  - Quick preview
- Allow users to download, edit, or delete saved resumes

## Technical Requirements

### Frontend
- Modern, responsive design that works on desktop and mobile
- Clean and intuitive user interface
- Simple, modern design with a consistent color scheme (choose professional, calming colors like blues/grays or a modern palette)
- Smooth user experience with loading states and error handling

### Backend & APIs
- Integrate **Gemini API** for:
  - Parsing uploaded resumes
  - Analyzing job descriptions
  - Generating tailored resume content
- Secure API key management
- Handle file uploads efficiently
- Store user data securely

### LaTeX Integration
- Implement LaTeX rendering for resume generation
- Use a standard, professional LaTeX resume template
- Ensure template is ATS-friendly (no complex formatting that confuses parsers)
- Convert LaTeX to PDF for download

### Database
- Store user profiles and resume data
- Store multiple resume versions per user
- Ensure data privacy and security

## User Flow

1. **Sign Up/Sign In**: User signs in with Google
2. **Profile Setup**: User either:
   - Uploads existing resume (auto-populated)
   - Manually enters information
3. **Job Input**: User enters target job title and optionally pastes job description
4. **AI Generation**: Click "Generate Resume" → AI analyzes and creates tailored content
5. **Preview & Edit**: User reviews the generated resume in preview, makes edits if needed
6. **Export**: User downloads the final resume as PDF
7. **Save**: Resume is automatically saved to user's dashboard

## Design Guidelines

- **Modern & Minimalist**: Clean layouts, plenty of white space, clear typography
- **Consistent Color Scheme**: Choose 2-3 primary colors and use throughout
- **Professional**: Should feel trustworthy and professional
- **Intuitive Navigation**: Clear CTAs, logical flow, breadcrumbs where needed
- **Responsive**: Must work well on all screen sizes
- **Accessibility**: Follow WCAG guidelines for accessibility

## AI Prompt Guidelines for Gemini API

When sending requests to Gemini API for resume generation, structure prompts like:

```
You are an expert resume writer and career coach. Given the following user information and target job, create a tailored, professional one-page resume.

USER PROFILE:
[Insert all user data: work experience, education, skills, projects, certifications]

TARGET JOB:
Title: [Job Title]
Description: [Job Description if provided]

INSTRUCTIONS:
1. Analyze the job requirements and prioritize the most relevant experiences and skills
2. Tailor bullet points to highlight achievements that match the job needs
3. Use action verbs and quantify achievements where possible
4. Optimize for ATS with relevant keywords from the job description
5. Ensure content fits on one page
6. Return ONLY the content in structured sections, not LaTeX formatting

OUTPUT FORMAT:
Return a JSON object with these sections:
- contact_info
- professional_summary (2-3 sentences)
- work_experience (array of jobs with bullet points)
- education (array)
- skills (array)
- projects (array, if relevant)
- certifications (array, if relevant)
```

## Success Criteria

- Users can easily input or upload their information
- AI generates relevant, tailored resumes in under 30 seconds
- Generated resumes are professional, ATS-friendly, and fit on one page
- Users can edit and save multiple resume versions
- Application is secure, fast, and reliable
- Design is modern, intuitive, and consistent

## Future Enhancements (Optional)
- Multiple LaTeX template options
- Cover letter generation
- Resume scoring/feedback
- Job application tracking
- Browser extension for one-click application
- LinkedIn profile import

---

**Note**: Ensure all AI-generated content respects user privacy and data is handled securely. Implement proper error handling and user feedback throughout the application.
