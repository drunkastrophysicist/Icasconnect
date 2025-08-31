import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Alumni() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Alumni Connect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Connect with alumni, find mentors, and explore career opportunities.
              </p>
              {/* Add alumni features/components here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
