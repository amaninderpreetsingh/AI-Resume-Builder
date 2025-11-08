import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileUp, Loader2, Sparkles } from "lucide-react";
import ManualDataEntry from "@/components/ManualDataEntry";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    checkAuth();
    loadUserData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (data) {
        setUserData(data);
      }
    } catch (error) {
      console.log("No existing user data found");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    toast({
      title: "File uploaded",
      description: "Click 'Parse Resume' to extract your information",
    });
  };

  const handleParseResume = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;

        const { data, error } = await supabase.functions.invoke('parse-resume', {
          body: {
            fileContent: content,
            fileName: uploadedFile.name,
          }
        });

        if (error) throw error;

        if (data.success) {
          const parsedData = data.data;
          
          // Save to user_data table
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { error: saveError } = await supabase
              .from('user_data')
              .upsert({
                user_id: session.user.id,
                contact_info: parsedData.contact_info,
                work_experience: parsedData.work_experience,
                education: parsedData.education,
                skills: parsedData.skills,
                projects: parsedData.projects,
                certifications: parsedData.certifications,
                raw_resume_text: content,
              });

            if (saveError) throw saveError;
          }

          setUserData(parsedData);
          setActiveTab("manual");
          toast({
            title: "Success!",
            description: "Resume parsed successfully. Review and edit below.",
          });
        }
      };

      reader.readAsText(uploadedFile);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to parse resume",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (formData: any) => {
    if (!jobTitle.trim()) {
      toast({
        title: "Job title required",
        description: "Please enter a target job title",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Save user data first if from manual entry
      if (activeTab === "manual") {
        const { error: saveError } = await supabase
          .from('user_data')
          .upsert({
            user_id: session.user.id,
            ...formData,
          });

        if (saveError) throw saveError;
      }

      // Generate resume with AI
      const { data, error } = await supabase.functions.invoke('generate-resume', {
        body: {
          userData: formData || userData,
          jobTitle,
          jobDescription,
        }
      });

      if (error) throw error;

      if (data.success) {
        // Save generated resume
        const { data: resumeData, error: resumeError } = await supabase
          .from('resumes')
          .insert({
            user_id: session.user.id,
            job_title: jobTitle,
            job_description: jobDescription,
            generated_content: data.content,
          })
          .select()
          .single();

        if (resumeError) throw resumeError;

        toast({
          title: "Resume generated!",
          description: "Your tailored resume is ready",
        });

        navigate(`/preview/${resumeData.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate resume",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Resume</h1>
          <p className="text-muted-foreground">
            Upload your existing resume or enter your information manually
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Target Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description (Optional)</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the job description here for better keyword optimization..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardContent className="pt-6">
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <FileUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports PDF, DOC, and DOCX files up to 10MB
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                  {uploadedFile && (
                    <div className="mt-4">
                      <p className="text-sm text-foreground mb-3">
                        Selected: {uploadedFile.name}
                      </p>
                      <Button onClick={handleParseResume} disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Parsing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Parse Resume with AI
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <ManualDataEntry 
              initialData={userData}
              onSubmit={handleGenerate}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ResumeBuilder;
