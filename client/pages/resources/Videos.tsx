import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Videos() {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Educational Videos</h1>
        <p className="text-muted-foreground">
          Access video lectures and educational content
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Video resources will be available soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We're working on bringing you high-quality educational videos.
            Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
