import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Edit2, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const ResumePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<any>(null);

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setResume(data);
      setEditedContent(data.generated_content);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load resume",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ generated_content: editedContent })
        .eq('id', id);

      if (error) throw error;

      setResume({ ...resume, generated_content: editedContent });
      setEditing(false);
      toast({
        title: "Success",
        description: "Resume updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    // Simple text export for now - can be enhanced with proper PDF generation
    const content = editedContent || resume?.generated_content;
    if (!content) return;

    let textContent = `${content.contact?.name || ''}\n`;
    textContent += `${content.contact?.email || ''} | ${content.contact?.phone || ''}\n`;
    textContent += `${content.contact?.location || ''}\n\n`;
    
    if (content.summary) {
      textContent += `PROFESSIONAL SUMMARY\n${content.summary}\n\n`;
    }

    if (content.experience?.length) {
      textContent += `EXPERIENCE\n`;
      content.experience.forEach((exp: any) => {
        textContent += `\n${exp.position} | ${exp.company}\n`;
        textContent += `${exp.startDate} - ${exp.endDate} | ${exp.location}\n`;
        exp.bullets?.forEach((bullet: string) => {
          textContent += `• ${bullet}\n`;
        });
      });
      textContent += `\n`;
    }

    if (content.education?.length) {
      textContent += `EDUCATION\n`;
      content.education.forEach((edu: any) => {
        textContent += `${edu.degree} in ${edu.field}\n`;
        textContent += `${edu.institution} | ${edu.graduationDate}\n`;
      });
      textContent += `\n`;
    }

    if (content.skills) {
      textContent += `SKILLS\n`;
      if (content.skills.technical?.length) {
        textContent += `Technical: ${content.skills.technical.join(', ')}\n`;
      }
      if (content.skills.tools?.length) {
        textContent += `Tools: ${content.skills.tools.join(', ')}\n`;
      }
      textContent += `\n`;
    }

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.contact?.name || 'resume'}_resume.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Resume exported as text file",
    });
  };

  const updateField = (path: string[], value: any) => {
    const newContent = { ...editedContent };
    let current = newContent;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setEditedContent(newContent);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading resume...</p>
      </div>
    );
  }

  const content = editedContent || resume?.generated_content;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {editing ? (
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8 shadow-elevated">
          {/* Contact Information */}
          <div className="text-center mb-6 pb-4 border-b-2">
            {editing ? (
              <Input
                className="text-2xl font-bold text-center mb-2"
                value={content.contact?.name || ''}
                onChange={(e) => updateField(['contact', 'name'], e.target.value)}
              />
            ) : (
              <h1 className="text-2xl font-bold mb-2">{content.contact?.name}</h1>
            )}
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              {editing ? (
                <div className="flex flex-wrap gap-2 justify-center">
                  <Input className="w-48" value={content.contact?.email || ''} onChange={(e) => updateField(['contact', 'email'], e.target.value)} placeholder="Email" />
                  <Input className="w-48" value={content.contact?.phone || ''} onChange={(e) => updateField(['contact', 'phone'], e.target.value)} placeholder="Phone" />
                  <Input className="w-48" value={content.contact?.location || ''} onChange={(e) => updateField(['contact', 'location'], e.target.value)} placeholder="Location" />
                </div>
              ) : (
                <>
                  <span>{content.contact?.email}</span>
                  <span>•</span>
                  <span>{content.contact?.phone}</span>
                  <span>•</span>
                  <span>{content.contact?.location}</span>
                </>
              )}
            </div>
          </div>

          {/* Summary */}
          {content.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2 text-primary">PROFESSIONAL SUMMARY</h2>
              {editing ? (
                <Textarea
                  value={content.summary}
                  onChange={(e) => updateField(['summary'], e.target.value)}
                />
              ) : (
                <p className="text-sm">{content.summary}</p>
              )}
            </div>
          )}

          {/* Experience */}
          {content.experience?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-primary">EXPERIENCE</h2>
              {content.experience.map((exp: any, idx: number) => (
                <div key={idx} className="mb-4">
                  {editing ? (
                  <div className="space-y-2">
                    <Input value={exp.position} onChange={(e) => updateField(['experience', idx, 'position'], e.target.value)} placeholder="Position" />
                    <Input value={exp.company} onChange={(e) => updateField(['experience', idx, 'company'], e.target.value)} placeholder="Company" />
                  </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold">{exp.position}</h3>
                        <span className="text-sm text-muted-foreground">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{exp.company} | {exp.location}</p>
                      {exp.bullets?.map((bullet: string, bidx: number) => (
                        <p key={bidx} className="text-sm ml-4 mb-1">• {bullet}</p>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {content.education?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-primary">EDUCATION</h2>
              {content.education.map((edu: any, idx: number) => (
                <div key={idx} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                    <span className="text-sm text-muted-foreground">{edu.graduationDate}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {content.skills && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-primary">SKILLS</h2>
              <div className="space-y-2 text-sm">
                {content.skills.technical?.length > 0 && (
                  <p><span className="font-semibold">Technical:</span> {content.skills.technical.join(', ')}</p>
                )}
                {content.skills.tools?.length > 0 && (
                  <p><span className="font-semibold">Tools:</span> {content.skills.tools.join(', ')}</p>
                )}
              </div>
            </div>
          )}

          {/* Projects */}
          {content.projects?.length > 0 && content.projects[0].name && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-primary">PROJECTS</h2>
              {content.projects.map((proj: any, idx: number) => (
                <div key={idx} className="mb-3">
                  <h3 className="font-semibold">{proj.name}</h3>
                  <p className="text-sm">{proj.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {content.certifications?.length > 0 && content.certifications[0].name && (
            <div>
              <h2 className="text-lg font-bold mb-3 text-primary">CERTIFICATIONS</h2>
              {content.certifications.map((cert: any, idx: number) => (
                <p key={idx} className="text-sm mb-1">
                  <span className="font-semibold">{cert.name}</span> - {cert.issuer} ({cert.date})
                </p>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default ResumePreview;
