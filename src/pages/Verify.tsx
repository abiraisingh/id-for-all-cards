import { useState, type FormEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyIDCard } from "@/lib/api";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const [idNumber, setIdNumber] = useState(searchParams.get("id") ?? "");
  const [result, setResult] = useState<{
    valid: boolean;
    maskedName?: string;
    issuedAt?: string;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedID = idNumber.trim().toUpperCase();
    setIdNumber(normalizedID);
    setResult(null);
    setIsChecking(true);

    try {
      setResult(await verifyIDCard(normalizedID));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not verify this ID card.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="bg-gradient-hero py-14 text-primary-foreground sm:py-20">
          <div className="container mx-auto px-4 text-center sm:px-6">
            <h1 className="text-3xl font-bold sm:text-5xl">Verify an ID Card</h1>
            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">
              Confirm an IdentityFirst card and see a masked name. Contact details and address remain private.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <Card className="mx-auto max-w-xl">
            <CardHeader>
              <CardTitle>Enter the ID number</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verification-id">ID Number</Label>
                  <Input
                    id="verification-id"
                    value={idNumber}
                    onChange={(event) => {
                      setIdNumber(event.target.value);
                      setResult(null);
                    }}
                    placeholder="IDF..."
                    autoComplete="off"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isChecking}>
                  {isChecking ? "Checking..." : "Verify Card"}
                </Button>
              </form>

              {result && (
                <div
                  className={`mt-6 rounded-md border p-4 ${
                    result.valid ? "border-primary/40 bg-primary/10" : "border-destructive/40 bg-destructive/10"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  <p className="font-semibold">
                    {result.valid ? "Valid active ID card" : "ID card not found or inactive"}
                  </p>
                  {result.valid && result.maskedName && (
                    <p className="mt-2 text-sm">
                      Cardholder: <span className="font-medium">{result.maskedName}</span>
                    </p>
                  )}
                  {result.valid && result.issuedAt && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Issued {new Date(result.issuedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Verify;
