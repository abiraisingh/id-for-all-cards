import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you within 24 hours.");
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@identityfirst.org", "support@identityfirst.org"],
      description: "Send us an email for general inquiries or support"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 98765 43211"],
      description: "Speak directly with our team during business hours"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Service Street", "New Delhi, India 110001"],
      description: "Visit our main office for in-person assistance"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM"],
      description: "Our regular operating hours for assistance"
    }
  ];

  const faqs = [
    {
      question: "How can I get an ID card?",
      answer: "Visit our ID Generator section, fill out the form with your details, capture your photo and biometrics, and download your card."
    },
    {
      question: "Is the ID card legally valid?",
      answer: "Our ID cards are recognized by partner organizations and service providers to help access essential services."
    },
    {
      question: "How can I help as a volunteer?",
      answer: "Visit our Volunteer page to see opportunities and fill out the volunteer registration form."
    },
    {
      question: "Are donations tax-deductible?",
      answer: "Yes, we are a registered non-profit organization. You will receive a receipt for tax purposes."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Get in <span className="text-accent">Touch</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Have questions, need support, or want to learn more about our mission? 
              We're here to help and would love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">How to Reach Us</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose the most convenient way to contact us
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <CardTitle className="text-lg">{method.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {method.details.map((detail, idx) => (
                          <p key={idx} className="font-medium text-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {method.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    Send us a Message
                  </h3>
                  <Card>
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input id="firstName" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input id="lastName" required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" type="email" required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <select 
                            id="subject" 
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                            required
                          >
                            <option value="">Select a subject</option>
                            <option value="id-card">ID Card Assistance</option>
                            <option value="volunteer">Volunteer Inquiry</option>
                            <option value="donation">Donation Information</option>
                            <option value="partnership">Partnership Opportunity</option>
                            <option value="support">Technical Support</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea 
                            id="message" 
                            placeholder="Please describe how we can help you..."
                            rows={6}
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-primary" />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-2 text-foreground">
                            {faq.question}
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-xl font-bold mb-4">Emergency Support</h3>
            <p className="mb-4">
              If you're in immediate need of assistance or facing an emergency situation:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="yellow" size="lg">
                Call Emergency Hotline: +91 98765 43299
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;