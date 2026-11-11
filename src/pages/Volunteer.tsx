import { useState, type FormEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Clock, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { postSubmission } from "@/lib/api";

const Volunteer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await postSubmission("volunteer", {
        ...Object.fromEntries(formData.entries()),
        interests: formData.getAll("interests"),
      });
      toast.success("Thank you for your interest in volunteering! We'll contact you soon.");
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const opportunities = [
    {
      icon: Users,
      title: "Field Outreach",
      description: "Help us connect with homeless individuals in the community and assist with ID card registration.",
      time: "Weekends, 4-6 hours"
    },
    {
      icon: Heart,
      title: "Support Services",
      description: "Provide emotional support and guidance to individuals during the registration process.",
      time: "Flexible, 2-4 hours"
    },
    {
      icon: Clock,
      title: "Administrative Support",
      description: "Assist with data entry, documentation, and office tasks to keep our operations running smoothly.",
      time: "Weekdays, 3-5 hours"
    },
    {
      icon: MapPin,
      title: "Mobile Registration",
      description: "Join our mobile units to bring ID card services directly to homeless communities.",
      time: "Various shifts available"
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
              Join Our Mission as a <span className="text-accent">Volunteer</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Help us restore dignity to homeless individuals by volunteering your time and skills. 
              Every hour you contribute makes a real difference in someone's life.
            </p>
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Volunteer Opportunities</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose from various ways to contribute your time and make a meaningful impact
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {opportunities.map((opportunity, index) => {
                const Icon = opportunity.icon;
                return (
                  <Card
                    key={index}
                    className="card-motion"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <CardHeader className="text-center">
                      <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {opportunity.description}
                      </p>
                      <div className="text-xs text-primary font-medium">
                        {opportunity.time}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Volunteer Registration Form */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Volunteer Registration</CardTitle>
                  <p className="text-muted-foreground text-center">
                    Fill out this form to get started as a volunteer
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" name="firstName" autoComplete="given-name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" name="lastName" autoComplete="family-name" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" autoComplete="email" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" name="phone" type="tel" autoComplete="tel" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability *</Label>
                      <select 
                        id="availability" 
                        name="availability"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        required
                      >
                        <option value="">Select your availability</option>
                        <option value="weekdays">Weekdays</option>
                        <option value="weekends">Weekends</option>
                        <option value="both">Both weekdays and weekends</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interests">Areas of Interest</Label>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="interests" value="outreach" />
                          <span>Field Outreach</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="interests" value="support" />
                          <span>Support Services</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="interests" value="admin" />
                          <span>Administrative</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="interests" value="mobile" />
                          <span>Mobile Registration</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Previous Volunteer Experience</Label>
                      <Textarea 
                        id="experience" 
                        name="experience"
                        placeholder="Tell us about any previous volunteer experience (optional)"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="motivation">Why do you want to volunteer?</Label>
                      <Textarea 
                        id="motivation" 
                        name="motivation"
                        placeholder="Share your motivation for volunteering with us"
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Volunteer Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold mb-6">Questions About Volunteering?</h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <span>volunteer@identityfirst.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Volunteer;