import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, FileText, Shield, DollarSign, CreditCard, Banknote, Smartphone } from "lucide-react";
import { toast } from "sonner";

const Donate = () => {
  const handleDonation = (amount: string) => {
    toast.success(`Thank you for your ${amount} donation! Redirecting to payment...`);
    // Here you would integrate with a payment processor
  };

  const impactItems = [
    {
      icon: FileText,
      amount: "₹500",
      impact: "Provides 5 ID cards for homeless individuals"
    },
    {
      icon: Users,
      amount: "₹1,000",
      impact: "Supports outreach services for 10 people"
    },
    {
      icon: Shield,
      amount: "₹2,500",
      impact: "Funds biometric equipment for secure ID creation"
    },
    {
      icon: Heart,
      amount: "₹5,000",
      impact: "Sponsors a mobile registration unit for one day"
    }
  ];

  const paymentMethods = [
    { icon: CreditCard, name: "Credit/Debit Card", description: "Secure online payment" },
    { icon: Banknote, name: "Bank Transfer", description: "Direct bank account transfer" },
    { icon: Smartphone, name: "UPI/Digital Wallet", description: "PayTM, GPay, PhonePe, etc." },
    { icon: DollarSign, name: "Cryptocurrency", description: "Bitcoin, Ethereum accepted" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Make a <span className="text-accent">Difference</span> Today
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
              Your donation helps provide dignity and access to essential services for homeless individuals. 
              Every contribution, no matter the size, creates real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="yellow" size="lg" className="text-lg px-8">
                Donate Now
              </Button>
              <Button variant="yellow-outline" size="lg" className="text-lg px-8">
                Learn About Impact
              </Button>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Your Impact</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                See how your donation directly helps homeless individuals rebuild their lives
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {impactItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <CardTitle className="text-2xl font-bold text-accent">
                        {item.amount}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.impact}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Donation Form */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">Make a Donation</CardTitle>
                    <p className="text-muted-foreground text-center">
                      Choose your donation amount and payment method
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Quick Amount Buttons */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Quick Amounts</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["₹500", "₹1,000", "₹2,500", "₹5,000"].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            onClick={() => handleDonation(amount)}
                            className="h-12 text-lg font-semibold hover:bg-primary hover:text-primary-foreground"
                          >
                            {amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="customAmount">Custom Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                        <Input
                          id="customAmount"
                          type="number"
                          placeholder="Enter amount"
                          className="pl-8"
                          min="100"
                        />
                      </div>
                    </div>

                    {/* Donation Type */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Donation Type</Label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="donationType" value="one-time" defaultChecked />
                          <span>One-time donation</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="donationType" value="monthly" />
                          <span>Monthly recurring donation</span>
                        </label>
                      </div>
                    </div>

                    {/* Donor Information */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="donorFirstName">First Name</Label>
                          <Input id="donorFirstName" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="donorLastName">Last Name</Label>
                          <Input id="donorLastName" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="donorEmail">Email Address</Label>
                        <Input id="donorEmail" type="email" placeholder="For donation receipt" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="donorPhone">Phone Number (Optional)</Label>
                        <Input id="donorPhone" type="tel" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">I want to remain anonymous</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Send me updates about IdentityFirst's work</span>
                      </label>
                    </div>

                    <Button className="w-full" size="lg">
                      Proceed to Payment
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-8">
                  {/* Payment Methods */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {paymentMethods.map((method, index) => {
                          const Icon = method.icon;
                          return (
                            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                              <Icon className="w-6 h-6 text-primary" />
                              <div>
                                <p className="font-medium">{method.name}</p>
                                <p className="text-sm text-muted-foreground">{method.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security & Trust */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Security & Trust</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">SSL Encrypted</p>
                          <p className="text-xs text-muted-foreground">All transactions are secure</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Tax Deductible</p>
                          <p className="text-xs text-muted-foreground">Registered 501(c)(3) non-profit</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Heart className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">100% Impact</p>
                          <p className="text-xs text-muted-foreground">Direct support to beneficiaries</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Other Ways to Help */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Other Ways to Help</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        Volunteer Your Time
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Corporate Partnership
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Spread Awareness
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Thank You Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-4">Thank You for Your Generosity</h3>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Every donation brings us closer to a world where everyone has access to identification 
              and the dignity that comes with it. Together, we're making a real difference.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Donate;
