import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Phone, Mail, Download, MapPin, Fingerprint } from "lucide-react";
import { toast } from "sonner";
import CameraCapture from "./CameraCapture";
import BiometricCapture from "./BiometricCapture";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface IDCardData {
  name: string;
  fatherName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  photo: string;
  biometricId: string;
  idNumber: string;
}

const IDCardGenerator = () => {
  const [formData, setFormData] = useState<IDCardData>({
    name: "",
    fatherName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    photo: "",
    biometricId: "",
    idNumber: ""
  });
  
  const [generatedCard, setGeneratedCard] = useState<IDCardData | null>(null);

  const generateIDNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `IDF${timestamp.slice(-6)}${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.fatherName || !formData.dateOfBirth || !formData.city || !formData.state) {
      toast.error("Please fill all required fields");
      return;
    }

    const cardData = {
      ...formData,
      idNumber: generateIDNumber()
    };
    
    setGeneratedCard(cardData);
    toast.success("ID Card generated successfully!");
  };

  const handleInputChange = (field: keyof IDCardData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoCapture = (imageData: string) => {
    handleInputChange('photo', imageData);
  };

  const handleBiometricCapture = (biometricId: string) => {
    handleInputChange('biometricId', biometricId);
  };

  const downloadCard = async () => {
    if (!generatedCard) return;
    
    try {
      const cardElement = document.getElementById('id-card');
      if (!cardElement) return;
      
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // Standard credit card size
      });
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
      
      pdf.save(`IdentityFirst_ID_${generatedCard.idNumber}.pdf`);
      toast.success("ID Card downloaded successfully!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download ID card. Please try again.");
    }
  };

  return (
    <section id="id-generator" className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Generate Your ID Card</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create a unique identification card that provides access to essential services and restores dignity
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's/Guardian's Name *</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    placeholder="Enter father's/guardian's name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                {/* Address Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter state"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode/ZIP</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>

                {/* Photo Capture */}
                <div className="space-y-2">
                  <Label>Photo Capture</Label>
                  <CameraCapture onCapture={handlePhotoCapture} currentImage={formData.photo} />
                </div>

                {/* Biometric Capture */}
                <div className="space-y-2">
                  <Label>Biometric Verification</Label>
                  <BiometricCapture onCapture={handleBiometricCapture} currentBiometric={formData.biometricId} />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Generate ID Card
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Generated ID Card */}
          {generatedCard && (
            <Card id="id-card" className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-accent">IdentityFirst</h3>
                  <p className="text-sm opacity-90">Unique Identity Card</p>
                </div>

                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 bg-primary-foreground/20 rounded-lg flex items-center justify-center overflow-hidden">
                    {generatedCard.photo ? (
                      <img 
                        src={generatedCard.photo} 
                        alt="ID Photo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-primary-foreground/60" />
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-sm opacity-75">Name</p>
                      <p className="font-bold text-lg">{generatedCard.name}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-75">Father's/Guardian's Name</p>
                      <p className="font-medium">{generatedCard.fatherName}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="opacity-75 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Date of Birth
                    </p>
                    <p className="font-medium">{generatedCard.dateOfBirth}</p>
                  </div>
                  {generatedCard.phone && (
                    <div>
                      <p className="opacity-75 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Phone
                      </p>
                      <p className="font-medium">{generatedCard.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="opacity-75 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Location
                    </p>
                    <p className="font-medium">{generatedCard.city}, {generatedCard.state}</p>
                  </div>
                  {generatedCard.biometricId && (
                    <div>
                      <p className="opacity-75 flex items-center gap-1">
                        <Fingerprint className="w-3 h-3" />
                        Biometric ID
                      </p>
                      <p className="font-medium text-xs">{generatedCard.biometricId}</p>
                    </div>
                  )}
                  {generatedCard.email && (
                    <div className="col-span-2">
                      <p className="opacity-75 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </p>
                      <p className="font-medium">{generatedCard.email}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-primary-foreground/20 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-75">ID Number</p>
                      <p className="font-bold text-lg text-accent">{generatedCard.idNumber}</p>
                    </div>
                    <Button variant="yellow" size="sm" onClick={downloadCard}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default IDCardGenerator;