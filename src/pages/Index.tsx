import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Target, Download, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AI Resume Builder</span>
          </div>
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Create Professional Resumes with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Generate tailored, ATS-optimized resumes in minutes. Let AI help you land your dream job.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              <Sparkles className="w-5 h-5 mr-2" />
              Start Building
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <div className="bg-card p-6 rounded-lg shadow-card">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Job-Targeted Content</h3>
            <p className="text-sm text-muted-foreground">
              AI analyzes job descriptions and tailors your resume to match requirements perfectly
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-card">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">ATS-Optimized</h3>
            <p className="text-sm text-muted-foreground">
              Beat applicant tracking systems with keyword-optimized, professionally formatted resumes
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-card">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Export</h3>
            <p className="text-sm text-muted-foreground">
              Download professional PDF resumes ready to send to employers
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-elevated">
          <h2 className="text-2xl font-bold mb-4 text-center">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Upload or Enter Your Information</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your existing resume or manually enter your career details
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Specify Your Target Job</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the job title and description you're applying for
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI Generates Your Resume</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI creates a tailored, professional resume optimized for your target role
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Review, Edit & Download</h3>
                <p className="text-sm text-muted-foreground">
                  Fine-tune your resume with inline editing and export as PDF
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started Now
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 AI Resume Builder. Powered by Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
