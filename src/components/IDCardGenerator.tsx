import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Phone, Mail, Download } from "lucide-react";
import { toast } from "sonner";

interface IDCardData {
  name: string;
  fatherName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  photo: string;
  idNumber: string;
}

const IDCardGenerator = () => {
  const [formData, setFormData] = useState<IDCardData>({
    name: "",
    fatherName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    photo: "",
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
    
    if (!formData.name || !formData.fatherName || !formData.dateOfBirth || !formData.phone) {
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('photo', e.target?.result as string);
      };
      reader.readAsDataURL(file);
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
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    required
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

                <div className="space-y-2">
                  <Label htmlFor="photo">Photo Upload</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent file:text-accent-foreground"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Generate ID Card
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Generated ID Card */}
          {generatedCard && (
            <Card className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground">
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
                  <div>
                    <p className="opacity-75 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Phone
                    </p>
                    <p className="font-medium">{generatedCard.phone}</p>
                  </div>
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
                    <Button variant="yellow" size="sm">
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