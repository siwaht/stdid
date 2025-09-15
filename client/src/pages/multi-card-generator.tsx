import { useCallback, useRef, useState } from 'react';
import { useCardTemplate } from '@/hooks/use-card-template';
import { TemplateSelector } from '@/components/template-selector';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Download, RotateCcw, Upload, Trash2, QrCode, Save, Wand2, Sparkles, CheckCircle, AlertCircle, Home } from 'lucide-react';
import QRCode from 'qrcode';
import { generateEnhancedDummyData, validateCompliance } from '@/lib/dummy-data-generator';
import { generateSignature } from '@/lib/logo-signature-generator';
import { Link } from 'wouter';

export default function MultiCardGenerator() {
  const {
    templates,
    selectedTemplate,
    cardData,
    photo,
    selectedTheme,
    currentTheme,
    selectTemplate,
    updateField,
    changeTheme,
    setPhoto,
    resetCard,
  } = useCardTemplate();

  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [showQR, setShowQR] = useState(true);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [complianceStatus, setComplianceStatus] = useState<{ isValid: boolean; errors: string[] }>({ isValid: false, errors: [] });
  const [organizationLogo, setOrganizationLogo] = useState<{ svg: string; backgroundColor: string } | null>(null);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [userSignature, setUserSignature] = useState<{ svg: string } | null>(null);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);

  // Check compliance whenever data changes
  useCallback(() => {
    const status = validateCompliance(cardData, selectedTemplate);
    setComplianceStatus(status);
  }, [cardData, selectedTemplate]);

  // Generate dummy data
  const handleGenerateDummy = useCallback(() => {
    const enhancedData = generateEnhancedDummyData(selectedTemplate);
    
    // Set form fields
    Object.entries(enhancedData.data).forEach(([key, value]) => {
      updateField(key, value);
    });
    
    // Set logo if generated
    if (enhancedData.logo) {
      setOrganizationLogo(enhancedData.logo);
    }
    
    // Set signature if generated
    if (enhancedData.signature) {
      setUserSignature(enhancedData.signature);
    }
    
    toast({
      title: "Sample data generated",
      description: "Form filled with realistic test data, logo, and signature",
    });
  }, [selectedTemplate, updateField, toast]);

  // Generate QR code data
  const generateQRCode = useCallback(async () => {
    try {
      const qrData = JSON.stringify({
        type: selectedTemplate.type,
        ...cardData,
        timestamp: new Date().toISOString(),
      });
      
      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 150,
        margin: 1,
        color: {
          dark: currentTheme.primary.replace('hsl(', '').replace(')', '').split(',').join(' '),
          light: '#FFFFFF',
        },
      });
      
      setQrCodeData(qrCodeUrl);
    } catch (error) {
      console.error('QR generation error:', error);
    }
  }, [cardData, selectedTemplate, currentTheme]);

  // Generate QR code when data changes
  useCallback(() => {
    if (showQR && Object.values(cardData).some(v => v)) {
      generateQRCode();
    }
  }, [cardData, showQR, generateQRCode]);

  const handlePhotoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhoto(result);
      toast({
        title: "Photo uploaded",
        description: "Your photo has been added to the card",
      });
    };
    reader.readAsDataURL(file);
  }, [setPhoto, toast]);

  const handleRemovePhoto = useCallback(() => {
    setPhoto(undefined);
    toast({
      title: "Photo removed",
      description: "Photo has been removed from the card",
    });
  }, [setPhoto, toast]);

  const handleResetForm = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
      resetCard();
      setQrCodeData('');
      setOrganizationLogo(null);
      setUploadedLogo(null);
      setUserSignature(null);
      setUploadedSignature(null);
      toast({
        title: "Form reset",
        description: "All fields have been cleared",
      });
    }
  }, [resetCard, toast]);

  // Handle logo upload
  const handleLogoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedLogo(result);
      setOrganizationLogo(null); // Clear generated logo when uploading custom
      toast({
        title: "Logo uploaded",
        description: "Your custom logo has been added",
      });
    };
    reader.readAsDataURL(file);
  }, [toast]);

  // Handle signature upload
  const handleSignatureUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedSignature(result);
      setUserSignature(null); // Clear generated signature when uploading custom
      toast({
        title: "Signature uploaded",
        description: "Your custom signature has been added",
      });
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const downloadAsImage = useCallback(async (format: 'png' | 'pdf') => {
    if (!cardRef.current) return;

    try {
      toast({
        title: `Generating ${format.toUpperCase()}...`,
        description: "Please wait while we process your card",
      });

      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `${selectedTemplate.type}-card-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'in',
          format: [3.375, 2.125]
        });
        
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 3.375, 2.125);
        pdf.save(`${selectedTemplate.type}-card-${Date.now()}.pdf`);
      }

      toast({
        title: "Download complete",
        description: `Your ${selectedTemplate.name} has been downloaded!`,
      });
    } catch (error) {
      console.error(`${format} download error:`, error);
      toast({
        title: "Download failed",
        description: `Error generating ${format.toUpperCase()} file`,
        variant: "destructive"
      });
    }
  }, [selectedTemplate, toast]);

  const renderCardPreview = () => {
    const defaultPhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400";
    
    return (
      <div
        ref={cardRef}
        className="id-card-container relative overflow-hidden"
        style={{
          background: currentTheme.gradient || `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
        }}
        data-testid="multi-card-preview"
      >
        {/* Pattern overlay */}
        {selectedTemplate.design.pattern && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {selectedTemplate.design.pattern === 'dots' && (
              <div className="w-full h-full" style={{
                backgroundImage: `radial-gradient(circle, ${currentTheme.primary} 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }} />
            )}
            {selectedTemplate.design.pattern === 'lines' && (
              <div className="w-full h-full" style={{
                backgroundImage: `repeating-linear-gradient(45deg, ${currentTheme.primary}, ${currentTheme.primary} 1px, transparent 1px, transparent 15px)`,
              }} />
            )}
          </div>
        )}

        {/* Card content */}
        <div className="relative z-10 flex h-full">
          {/* Photo section */}
          <div className="w-[35%] h-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <img
              src={photo || defaultPhoto}
              alt="Card Photo"
              className={`w-full h-full object-cover ${!photo ? 'opacity-50 grayscale' : ''}`}
              data-testid="card-photo"
            />
          </div>

          {/* Info section */}
          <div className="w-[65%] p-3 bg-white/95 backdrop-blur-sm flex flex-col">
            {/* Header with logo and title */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {/* Organization Logo - Display uploaded or generated */}
                {uploadedLogo ? (
                  <img 
                    src={uploadedLogo}
                    className="w-10 h-10 rounded-md object-contain"
                    alt="Organization Logo"
                  />
                ) : organizationLogo ? (
                  <div 
                    className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: organizationLogo.backgroundColor }}
                    dangerouslySetInnerHTML={{ __html: organizationLogo.svg }}
                  />
                ) : (
                  <span className="text-2xl">{selectedTemplate.icon}</span>
                )}
                <div>
                  <p className="text-[8px] font-semibold text-gray-600 uppercase tracking-wider">
                    {cardData[selectedTemplate.fields[0]?.key] || 'Organization Name'}
                  </p>
                  <p className="text-[11px] font-bold" style={{ color: currentTheme.primary }}>
                    {selectedTemplate.name.toUpperCase()}
                  </p>
                </div>
              </div>
              {showQR && qrCodeData && (
                <img
                  src={qrCodeData}
                  alt="QR Code"
                  className="w-12 h-12"
                  data-testid="card-qr-code"
                />
              )}
            </div>

            {/* Dynamic fields based on template */}
            <div className="flex-1 space-y-1">
              {selectedTemplate.fields.slice(1, 5).map((field) => (
                <div key={field.key} className="text-[7px]">
                  <p className="text-gray-500 font-semibold uppercase tracking-wider">
                    {field.label}
                  </p>
                  <p className="text-[9px] font-medium text-gray-800">
                    {cardData[field.key] || `Enter ${field.label.toLowerCase()}`}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer with additional fields and signature */}
            <div className="mt-auto pt-2 border-t border-gray-200">
              <div className="flex items-end justify-between">
                <div className="grid grid-cols-2 gap-x-3 text-[6px] flex-1">
                  {selectedTemplate.fields.slice(5, 7).map((field) => (
                    <div key={field.key}>
                      <p className="text-gray-500 font-semibold uppercase tracking-wider">
                        {field.label}
                      </p>
                      <p className="text-[7px] font-medium text-gray-800">
                        {cardData[field.key] || 'Not specified'}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Signature - Display uploaded or generated */}
                {(uploadedSignature || userSignature) && (
                  <div className="w-16 h-8 mr-2">
                    {uploadedSignature ? (
                      <img 
                        src={uploadedSignature}
                        className="w-full h-full object-contain"
                        alt="Signature"
                      />
                    ) : (
                      <div 
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: userSignature?.svg || '' }}
                      />
                    )}
                    <p className="text-[5px] text-gray-500 text-center border-t border-gray-300 mt-0.5">
                      Signature
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Navigation Bar */}
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Wand2 className="w-10 h-10 text-primary" />
            Creative ID Card Studio
          </h1>
          <p className="text-lg text-muted-foreground">
            Design professional ID cards with multiple templates and themes
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel: Editor */}
          <Card className="p-6">
            <Tabs defaultValue="template" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="template">Template & Theme</TabsTrigger>
                <TabsTrigger value="details">Card Details</TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="space-y-6 mt-6">
                <TemplateSelector
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  selectedTheme={selectedTheme}
                  onSelectTemplate={selectTemplate}
                  onSelectTheme={changeTheme}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-6">
                {/* Logo and Signature Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Logo & Signature</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Logo Options */}
                    <div className="space-y-2">
                      <Label className="text-xs">Organization Logo</Label>
                      <div className="flex gap-2">
                        <FileUpload onFileSelect={handleLogoUpload}>
                          <Button variant="outline" size="sm" className="w-full" type="button">
                            <Upload className="w-3 h-3 mr-1" />
                            Upload Logo
                          </Button>
                        </FileUpload>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedTemplate) {
                              const enhanced = generateEnhancedDummyData(selectedTemplate);
                              if (enhanced.logo) {
                                setOrganizationLogo(enhanced.logo);
                                setUploadedLogo(null);
                                toast({ title: "Logo generated", description: "Random logo created" });
                              }
                            }
                          }}
                          type="button"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          Generate
                        </Button>
                      </div>
                      {(uploadedLogo || organizationLogo) && (
                        <div className="flex items-center gap-2">
                          {uploadedLogo ? (
                            <img src={uploadedLogo} className="w-12 h-12 object-contain rounded" alt="Logo" />
                          ) : organizationLogo ? (
                            <div
                              className="w-12 h-12 rounded"
                              style={{ backgroundColor: organizationLogo.backgroundColor }}
                              dangerouslySetInnerHTML={{ __html: organizationLogo.svg }}
                            />
                          ) : null}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUploadedLogo(null);
                              setOrganizationLogo(null);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Signature Options */}
                    <div className="space-y-2">
                      <Label className="text-xs">Signature</Label>
                      <div className="flex gap-2">
                        <FileUpload onFileSelect={handleSignatureUpload}>
                          <Button variant="outline" size="sm" className="w-full" type="button">
                            <Upload className="w-3 h-3 mr-1" />
                            Upload Sign
                          </Button>
                        </FileUpload>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const name = cardData[selectedTemplate.fields.find(f => 
                              ['studentName', 'memberName', 'employeeName', 'visitorName'].includes(f.key)
                            )?.key || ''] || 'John Doe';
                            const sig = generateSignature(name);
                            setUserSignature(sig);
                            setUploadedSignature(null);
                            toast({ title: "Signature generated", description: "Random signature created" });
                          }}
                          type="button"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          Generate
                        </Button>
                      </div>
                      {(uploadedSignature || userSignature) && (
                        <div className="flex items-center gap-2">
                          {uploadedSignature ? (
                            <img src={uploadedSignature} className="h-8 object-contain" alt="Signature" />
                          ) : userSignature ? (
                            <div
                              className="h-8 w-20"
                              dangerouslySetInnerHTML={{ __html: userSignature.svg }}
                            />
                          ) : null}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUploadedSignature(null);
                              setUserSignature(null);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compliance Status */}
                <div className={`p-4 rounded-lg border ${complianceStatus.isValid ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex items-center gap-2">
                    {complianceStatus.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                    <h3 className="font-semibold text-sm">
                      {complianceStatus.isValid ? 'Document Requirements Met' : 'Requirements Checklist'}
                    </h3>
                  </div>
                  {!complianceStatus.isValid && complianceStatus.errors.length > 0 && (
                    <ul className="mt-2 text-xs space-y-1">
                      {complianceStatus.errors.map((error, idx) => (
                        <li key={idx} className="text-yellow-700">• {error}</li>
                      ))}
                    </ul>
                  )}
                  {complianceStatus.isValid && (
                    <p className="mt-2 text-xs text-green-700">
                      ✓ Full name present • ✓ Institution name present • ✓ Valid date included
                    </p>
                  )}
                </div>

                {/* Generate Sample Data Button */}
                <Button 
                  onClick={handleGenerateDummy} 
                  variant="outline" 
                  className="w-full"
                  data-testid="generate-dummy-button"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Sample Data
                </Button>

                {/* Photo Upload */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Photo</Label>
                  <FileUpload onFileSelect={handlePhotoUpload}>
                    <div className="space-y-2 py-4">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm font-medium">Drop photo or click to browse</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                    </div>
                  </FileUpload>
                  
                  {photo && (
                    <div className="mt-3 flex items-center gap-3">
                      <img src={photo} className="w-20 h-20 object-cover rounded-lg" alt="Uploaded" />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemovePhoto}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                {/* Dynamic Fields */}
                <div className="space-y-4">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.key}>
                      <Label htmlFor={field.key} className="text-sm">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      
                      {field.type === 'select' && field.options ? (
                        <Select
                          value={cardData[field.key] || ''}
                          onValueChange={(value) => updateField(field.key, value)}
                        >
                          <SelectTrigger id={field.key} className="w-full">
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.key}
                          type={field.type || 'text'}
                          value={cardData[field.key] || ''}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          maxLength={field.maxLength}
                          className="w-full"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* QR Code Toggle */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <Label htmlFor="qr-toggle" className="text-sm font-medium cursor-pointer">
                    Include QR Code
                  </Label>
                  <Button
                    id="qr-toggle"
                    variant={showQR ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowQR(!showQR)}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    {showQR ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={handleResetForm}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button variant="outline" onClick={() => generateQRCode()}>
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Right Panel: Preview */}
          <Card className="p-6 bg-muted/30">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Live Preview</h2>
                <Badge className="px-3 py-1" style={{ background: currentTheme.gradient }}>
                  {currentTheme.name}
                </Badge>
              </div>

              {/* Card Preview */}
              <div className="flex items-center justify-center p-8">
                {renderCardPreview()}
              </div>

              {/* Download Options */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => downloadAsImage('png')} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download PNG
                </Button>
                <Button onClick={() => downloadAsImage('pdf')} variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="gap-2" disabled>
                  <Save className="w-4 h-4" />
                  Save to Library
                </Button>
              </div>

              {/* Card Info */}
              <div className="text-center text-sm text-muted-foreground">
                <p>Standard ID card size: 3.375" × 2.125"</p>
                <p className="text-xs mt-1">ISO/IEC 7810 ID-1 format</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}