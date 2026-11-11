import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, User } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { postSubmission } from "@/lib/api";
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
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name || !formData.fatherName || !formData.dateOfBirth || !formData.city || !formData.state) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!formData.photo) {
      toast.error("Please capture a photo before generating the ID card.");
      return;
    }

    const form = e.currentTarget;
    const formDataFromForm = new FormData(form);
    if (formDataFromForm.get("cardStorageConsent") !== "on") {
      toast.error("Please consent to storing the card details for later verification.");
      return;
    }
    if (formDataFromForm.get("publicNameConsent") !== "on") {
      toast.error("Please consent to showing your masked name in public verification.");
      return;
    }

    setIsGenerating(true);
    try {
      const { idNumber } = await postSubmission<{ idNumber: string }>("id-cards", {
        name: formData.name,
        fatherName: formData.fatherName,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        consentAccepted: true,
        publicNameConsentAccepted: true,
      });

      setGeneratedCard({ ...formData, idNumber });
      toast.success("ID card created and registered for verification.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not register the ID card.");
    } finally {
      setIsGenerating(false);
    }
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
      if (!cardElement) {
        toast.error("Unable to find the ID card to download.");
        return;
      }
      
      const canvas = await html2canvas(cardElement, {
        scale: 3,
        backgroundColor: null,
        logging: false,
      });
      
      if (!canvas.width || !canvas.height) {
        throw new Error("The ID card could not be rendered for download.");
      }

      const cardWidthMm = 85.6;
      const cardHeightMm = cardWidthMm * canvas.height / canvas.width;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [cardWidthMm, cardHeightMm]
      });
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, cardWidthMm, cardHeightMm);
      
      pdf.save(`IdentityFirst_ID_${generatedCard.idNumber}.pdf`);
      toast.success("ID Card downloaded successfully!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download ID card. Please try again.");
    }
  };

  return (
    <section id="id-generator" className="scroll-mt-20 py-16 lg:py-24 bg-secondary/30">
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
                  <Label>
                    Photo Capture <span className="text-destructive">*</span>
                  </Label>
                  <CameraCapture onCapture={handlePhotoCapture} currentImage={formData.photo} />
                  <p className="text-xs text-muted-foreground" aria-live="polite">
                    A photo is required to generate your ID card.
                  </p>
                </div>

                {/* Biometric Capture */}
                <div className="space-y-2">
                  <Label>Biometric Verification</Label>
                  <BiometricCapture onCapture={handleBiometricCapture} currentBiometric={formData.biometricId} />
                </div>

                <div className="flex items-start gap-2 rounded-md border p-3">
                  <input
                    id="cardStorageConsent"
                    name="cardStorageConsent"
                    type="checkbox"
                    required
                    className="mt-1"
                  />
                  <Label htmlFor="cardStorageConsent" className="text-sm leading-relaxed">
                    I consent to storing my card details (name, date of birth, and contact/address information)
                    in the database so this card can be verified later. My photo and biometric ID will not be stored.
                  </Label>
                </div>

                <div className="flex items-start gap-2 rounded-md border p-3">
                  <input
                    id="publicNameConsent"
                    name="publicNameConsent"
                    type="checkbox"
                    required
                    className="mt-1"
                  />
                  <Label htmlFor="publicNameConsent" className="text-sm leading-relaxed">
                    I separately consent to showing my masked name (for example, A***** S*****) when someone verifies
                    this card. My full name and other personal details will not be public.
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
                  {isGenerating ? "Registering ID Card..." : "Generate ID Card"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Generated ID Card */}
          {generatedCard && (
            <Card
              id="id-card"
              className="flex aspect-auto min-h-[290px] w-full self-start flex-col overflow-hidden bg-gradient-to-br from-primary to-primary-dark text-primary-foreground md:aspect-[85.6/53.98] md:min-h-0"
            >
              <CardContent className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
                <div className="flex items-center justify-between border-b border-primary-foreground/20 pb-2">
                  <div>
                    <h3 className="text-base font-bold text-accent sm:text-lg">IdentityFirst</h3>
                    <p className="text-[9px] opacity-90 sm:text-[10px]">Unique Identity Card</p>
                  </div>
                  <p className="text-[9px] font-semibold tracking-wider opacity-75 sm:text-[10px]">
                    IDENTITY
                  </p>
                </div>

                <div className="flex min-h-0 flex-1 gap-3 py-2 sm:gap-4 sm:py-3">
                  <div className="aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md bg-primary-foreground/20 sm:w-20">
                    <img
                      src={generatedCard.photo}
                      alt="ID Photo"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="grid min-w-0 flex-1 grid-cols-2 content-center gap-x-3 gap-y-1 sm:gap-y-1.5">
                    <div className="min-w-0">
                      <p className="text-[9px] leading-tight opacity-75">Name</p>
                      <p className="line-clamp-2 break-words text-[10px] font-bold leading-tight sm:text-xs" title={generatedCard.name}>
                        {generatedCard.name}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] leading-tight opacity-75">Father's/Guardian's Name</p>
                      <p className="line-clamp-2 break-words text-[10px] font-medium leading-tight sm:text-xs" title={generatedCard.fatherName}>
                        {generatedCard.fatherName}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] leading-tight opacity-75">Date of Birth</p>
                      <p className="line-clamp-2 break-words text-[10px] font-medium leading-tight sm:text-xs">{generatedCard.dateOfBirth}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] leading-tight opacity-75">Location</p>
                      <p
                        className="line-clamp-2 break-words text-[10px] font-medium leading-tight sm:text-xs"
                        title={`${generatedCard.city}, ${generatedCard.state}`}
                      >
                        {generatedCard.city}, {generatedCard.state}
                      </p>
                    </div>
                    {generatedCard.phone && (
                      <div className="min-w-0">
                        <p className="text-[9px] leading-tight opacity-75">Phone</p>
                        <p className="line-clamp-2 break-words text-[10px] font-medium leading-tight sm:text-xs">{generatedCard.phone}</p>
                      </div>
                    )}
                    {generatedCard.country && (
                      <div className="min-w-0">
                        <p className="text-[9px] leading-tight opacity-75">Country</p>
                        <p className="line-clamp-2 break-words text-[10px] font-medium leading-tight sm:text-xs">{generatedCard.country}</p>
                      </div>
                    )}
                    {generatedCard.pincode && (
                      <div className="min-w-0">
                        <p className="text-[9px] leading-tight opacity-75">Pincode/ZIP</p>
                        <p className="line-clamp-2 break-words text-[10px] font-medium leading-tight sm:text-xs">{generatedCard.pincode}</p>
                      </div>
                    )}
                    {generatedCard.email && (
                      <div className="min-w-0">
                        <p className="text-[9px] leading-tight opacity-75">Email</p>
                        <p className="line-clamp-2 break-all text-[10px] font-medium leading-tight sm:text-xs" title={generatedCard.email}>{generatedCard.email}</p>
                      </div>
                    )}
                    {generatedCard.biometricId && (
                      <div className="min-w-0">
                        <p className="text-[9px] leading-tight opacity-75">Biometric ID</p>
                        <p className="line-clamp-2 break-all text-[10px] font-medium leading-tight sm:text-xs" title={generatedCard.biometricId}>{generatedCard.biometricId}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-primary-foreground/20 pt-2">
                  <div>
                    <p className="text-[9px] opacity-75">ID Number</p>
                    <p className="text-xs font-bold text-accent sm:text-sm">{generatedCard.idNumber}</p>
                    <Link
                      to={`/verify?id=${encodeURIComponent(generatedCard.idNumber)}`}
                      className="mt-1 inline-block text-[9px] underline underline-offset-2"
                      data-html2canvas-ignore="true"
                    >
                      Verify this card
                    </Link>
                  </div>
                  <Button
                    variant="yellow"
                    size="sm"
                    onClick={downloadCard}
                    data-html2canvas-ignore="true"
                    className="h-8 px-2 text-[10px] sm:px-3 sm:text-xs"
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Download
                  </Button>
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