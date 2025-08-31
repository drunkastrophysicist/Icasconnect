import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  feature: string;
}

export default function PlaceholderPage({ feature }: PlaceholderPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Construction className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">{feature} Coming Soon</CardTitle>
            <CardDescription className="text-lg">
              We're working hard to bring you this feature. It will be available soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              The {feature} section is currently under development. We're building amazing
              features to enhance your campus experience.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Want to help us prioritize? Let us know what features matter most to you.
              </p>
              <Button asChild>
                <Link to="/">Explore Other Features</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
