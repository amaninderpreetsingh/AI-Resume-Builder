import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Plus, X, Loader2 } from "lucide-react";

interface ManualDataEntryProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

const ManualDataEntry = ({ initialData, onSubmit, loading }: ManualDataEntryProps) => {
  const [formData, setFormData] = useState({
    contact_info: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
    },
    work_experience: [{ company: "", position: "", location: "", startDate: "", endDate: "", description: "" }],
    education: [{ institution: "", degree: "", field: "", location: "", graduationDate: "", gpa: "" }],
    skills: { technical: [], tools: [], soft: [] },
    projects: [{ name: "", description: "", technologies: [] }],
    certifications: [{ name: "", issuer: "", date: "" }],
  });

  const [skillsInput, setSkillsInput] = useState({ technical: "", tools: "", soft: "" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        contact_info: initialData.contact_info || formData.contact_info,
        work_experience: initialData.work_experience || formData.work_experience,
        education: initialData.education || formData.education,
        skills: initialData.skills || formData.skills,
        projects: initialData.projects || formData.projects,
        certifications: initialData.certifications || formData.certifications,
      });
    }
  }, [initialData]);

  const handleContactChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      contact_info: { ...formData.contact_info, [field]: value },
    });
  };

  const handleArrayChange = (section: string, index: number, field: string, value: string) => {
    const newArray = [...(formData as any)[section]];
    newArray[index] = { ...newArray[index], [field]: value };
    setFormData({ ...formData, [section]: newArray });
  };

  const addArrayItem = (section: string, template: any) => {
    setFormData({
      ...formData,
      [section]: [...(formData as any)[section], template],
    });
  };

  const removeArrayItem = (section: string, index: number) => {
    setFormData({
      ...formData,
      [section]: (formData as any)[section].filter((_: any, i: number) => i !== index),
    });
  };

  const handleSkillsChange = (category: string, value: string) => {
    setSkillsInput({ ...skillsInput, [category]: value });
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [category]: value.split(',').map(s => s.trim()).filter(s => s),
      },
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.contact_info.name}
                onChange={(e) => handleContactChange('name', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact_info.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.contact_info.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.contact_info.location}
                onChange={(e) => handleContactChange('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={formData.contact_info.linkedin}
                onChange={(e) => handleContactChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio/Website</Label>
              <Input
                id="portfolio"
                value={formData.contact_info.portfolio}
                onChange={(e) => handleContactChange('portfolio', e.target.value)}
                placeholder="johndoe.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Work Experience</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('work_experience', {
              company: "", position: "", location: "", startDate: "", endDate: "", description: ""
            })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.work_experience.map((exp, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              {formData.work_experience.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeArrayItem('work_experience', index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => handleArrayChange('work_experience', index, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position *</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => handleArrayChange('work_experience', index, 'position', e.target.value)}
                    placeholder="Job Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => handleArrayChange('work_experience', index, 'location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Start (MM/YYYY)</Label>
                    <Input
                      value={exp.startDate}
                      onChange={(e) => handleArrayChange('work_experience', index, 'startDate', e.target.value)}
                      placeholder="01/2020"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End (MM/YYYY)</Label>
                    <Input
                      value={exp.endDate}
                      onChange={(e) => handleArrayChange('work_experience', index, 'endDate', e.target.value)}
                      placeholder="Present"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => handleArrayChange('work_experience', index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={4}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('education', {
              institution: "", degree: "", field: "", location: "", graduationDate: "", gpa: ""
            })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.education.map((edu, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              {formData.education.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeArrayItem('education', index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Institution *</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                    placeholder="University Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                    placeholder="Bachelor of Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field of Study *</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => handleArrayChange('education', index, 'field', e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={edu.location}
                    onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Graduation (MM/YYYY)</Label>
                  <Input
                    value={edu.graduationDate}
                    onChange={(e) => handleArrayChange('education', index, 'graduationDate', e.target.value)}
                    placeholder="05/2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GPA (Optional)</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Technical Skills (comma-separated)</Label>
            <Input
              value={skillsInput.technical}
              onChange={(e) => handleSkillsChange('technical', e.target.value)}
              placeholder="React, TypeScript, Node.js, Python"
            />
          </div>
          <div className="space-y-2">
            <Label>Tools & Technologies (comma-separated)</Label>
            <Input
              value={skillsInput.tools}
              onChange={(e) => handleSkillsChange('tools', e.target.value)}
              placeholder="Git, Docker, AWS, Figma"
            />
          </div>
          <div className="space-y-2">
            <Label>Soft Skills (comma-separated)</Label>
            <Input
              value={skillsInput.soft}
              onChange={(e) => handleSkillsChange('soft', e.target.value)}
              placeholder="Leadership, Communication, Problem Solving"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Projects (Optional)</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('projects', { name: "", description: "", technologies: [] })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.projects.map((project, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeArrayItem('projects', index)}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)}
                  placeholder="My Awesome Project"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                  placeholder="Brief description of the project..."
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Certifications (Optional)</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('certifications', { name: "", issuer: "", date: "" })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.certifications.map((cert, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeArrayItem('certifications', index)}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Certification Name</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
                    placeholder="AWS Certified Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issuer</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date (MM/YYYY)</Label>
                  <Input
                    value={cert.date}
                    onChange={(e) => handleArrayChange('certifications', index, 'date', e.target.value)}
                    placeholder="06/2023"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Resume...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Resume
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ManualDataEntry;
