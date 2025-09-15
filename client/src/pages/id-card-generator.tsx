import { useCallback, useRef } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIdCard } from '@/hooks/use-id-card';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Eye, Download, RotateCcw, Upload, Trash2 } from 'lucide-react';

export default function IdCardGenerator() {
  const { cardData, updateField, setPhoto, removePhoto, resetForm } = useIdCard();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhoto(result);
    };
    reader.readAsDataURL(file);
  }, [setPhoto]);

  const handleRemovePhoto = useCallback(() => {
    removePhoto();
    toast({
      title: "Photo removed",
      description: "Student photo has been removed from the card",
    });
  }, [removePhoto, toast]);

  const handleResetForm = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
      resetForm();
      toast({
        title: "Form reset",
        description: "All fields have been cleared",
      });
    }
  }, [resetForm, toast]);

  const downloadAsImage = useCallback(async (format: 'png' | 'pdf') => {
    if (!cardRef.current) return;

    try {
      toast({
        title: `Generating ${format.toUpperCase()}...`,
        description: "Please wait while we process your card",
      });

      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      if (format === 'png') {
        // Download as PNG
        const link = document.createElement('a');
        link.download = `student-id-card-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        // Download as PDF
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'in',
          format: [3.375, 2.125]
        });
        
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 3.375, 2.125);
        pdf.save(`student-id-card-${Date.now()}.pdf`);
      }

      toast({
        title: "Download complete",
        description: `${format.toUpperCase()} file has been downloaded successfully!`,
      });
    } catch (error) {
      console.error(`${format} download error:`, error);
      toast({
        title: "Download failed",
        description: `Error generating ${format.toUpperCase()} file`,
        variant: "destructive"
      });
    }
  }, [toast]);

  const defaultPhotoUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=400";

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8" data-testid="id-card-generator">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2" data-testid="page-title">
            Student ID Card Generator
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="page-description">
            Create professional student ID cards with live preview
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 bg-card rounded-lg shadow-lg overflow-hidden">
          
          {/* Left Panel: Editor */}
          <div className="p-6 lg:p-8 space-y-6 border-r border-border overflow-y-auto" style={{maxHeight: '85vh'}} data-testid="editor-panel">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground" data-testid="editor-title">Card Editor</h2>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-4">
              <Label className="block text-sm font-semibold text-foreground" data-testid="photo-label">
                Student Photo
              </Label>
              
              <FileUpload onFileSelect={handlePhotoUpload} data-testid="photo-upload">
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Drop photo here or click to browse</p>
                    <p className="text-muted-foreground text-sm">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </FileUpload>

              {cardData.photo && (
                <div className="flex items-center gap-3" data-testid="photo-preview">
                  <img 
                    src={cardData.photo} 
                    className="w-24 h-24 object-cover rounded-lg border border-border" 
                    alt="Uploaded photo"
                    data-testid="uploaded-photo"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleRemovePhoto}
                    data-testid="remove-photo-button"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove photo
                  </Button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="universityName" data-testid="university-label">University Name</Label>
                  <Input
                    id="universityName"
                    value={cardData.universityName}
                    onChange={(e) => updateField('universityName', e.target.value)}
                    placeholder="Enter university name"
                    className="form-input"
                    data-testid="input-university"
                  />
                </div>
                
                <div>
                  <Label htmlFor="studentName" data-testid="name-label">Student Name</Label>
                  <Input
                    id="studentName"
                    value={cardData.studentName}
                    onChange={(e) => updateField('studentName', e.target.value)}
                    placeholder="Enter student name"
                    className="form-input"
                    data-testid="input-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="studentId" data-testid="id-label">Student ID</Label>
                  <Input
                    id="studentId"
                    value={cardData.studentId}
                    onChange={(e) => updateField('studentId', e.target.value)}
                    placeholder="Enter student ID"
                    className="form-input"
                    data-testid="input-student-id"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth" data-testid="dob-label">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    value={cardData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    placeholder="Enter date of birth"
                    className="form-input"
                    data-testid="input-dob"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" data-testid="phone-label">Phone Number</Label>
                  <Input
                    id="phone"
                    value={cardData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="form-input"
                    data-testid="input-phone"
                  />
                </div>
                
                <div>
                  <Label htmlFor="academicYear" data-testid="academic-year-label">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={cardData.academicYear}
                    onChange={(e) => updateField('academicYear', e.target.value)}
                    placeholder="Enter academic year"
                    className="form-input"
                    data-testid="input-academic-year"
                  />
                </div>
                
                <div>
                  <Label htmlFor="department" data-testid="department-label">Department</Label>
                  <Input
                    id="department"
                    value={cardData.department}
                    onChange={(e) => updateField('department', e.target.value)}
                    placeholder="Enter department"
                    className="form-input"
                    data-testid="input-department"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="address" data-testid="address-label">Address</Label>
                  <Input
                    id="address"
                    value={cardData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Enter address"
                    className="form-input"
                    data-testid="input-address"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <button 
                  onClick={handleResetForm} 
                  className="modern-button"
                  data-testid="button-reset"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Form
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Preview */}
          <div className="p-6 lg:p-8 bg-muted/30 flex flex-col items-center justify-center" data-testid="preview-panel">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground" data-testid="preview-title">Live Preview</h2>
            </div>

            {/* ID Card Preview */}
            <div className="mb-8">
              <div ref={cardRef} className="id-card-container" data-testid="id-card-preview">
                {/* Photo Section */}
                <div className="photo-section">
                  <img 
                    src={cardData.photo || defaultPhotoUrl} 
                    alt="Student Photo" 
                    className={cardData.photo ? '' : 'grayscale opacity-50'}
                    data-testid="card-photo"
                  />
                </div>
                
                {/* Info Section */}
                <div className="info-section">
                  {/* University Header */}
                  <div className="flex items-start gap-1 mb-1">
                    <svg className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                    </svg>
                    <p className="font-medium text-primary text-[7px] leading-tight" data-testid="card-university">
                      {cardData.universityName || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="bg-accent text-accent-foreground px-1 py-0.5 rounded text-[9px] font-bold text-center mb-1">
                    STUDENT ID CARD
                  </div>
                  
                  <p className="text-[11px] font-bold text-foreground mb-1 leading-tight" data-testid="card-name">
                    {cardData.studentName || 'Not specified'}
                  </p>

                  <hr className="border-border mb-1" />

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[6px] flex-grow">
                    <div>
                      <p className="text-muted-foreground font-semibold tracking-wider">STUDENT ID</p>
                      <p className="text-foreground font-medium text-[7px]" data-testid="card-student-id">
                        {cardData.studentId || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold tracking-wider">DOB</p>
                      <p className="text-foreground font-medium text-[7px]" data-testid="card-dob">
                        {cardData.dateOfBirth || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold tracking-wider">PHONE</p>
                      <p className="text-foreground font-medium text-[7px]" data-testid="card-phone">
                        {cardData.phone || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold tracking-wider">DEPT</p>
                      <p className="text-foreground font-medium text-[7px]" data-testid="card-department">
                        {cardData.department || 'Not specified'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground font-semibold tracking-wider">ADDRESS</p>
                      <p className="text-foreground font-medium text-[7px] leading-tight" data-testid="card-address">
                        {cardData.address || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Academic Year */}
                  <div className="text-[6px] mt-auto pt-1 border-t border-border">
                    <p className="text-muted-foreground font-semibold tracking-wider">ACADEMIC YEAR</p>
                    <p className="text-foreground font-medium text-[7px]" data-testid="card-academic-year">
                      {cardData.academicYear || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Options */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => downloadAsImage('png')} 
                className="modern-button"
                data-testid="button-download-png"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
              <button 
                onClick={() => downloadAsImage('pdf')} 
                className="modern-button"
                data-testid="button-download-pdf"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            {/* Card Info */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm" data-testid="card-dimensions">
                Card dimensions: 3.375" × 2.125"
              </p>
              <p className="text-muted-foreground text-xs">Standard ID card size</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
