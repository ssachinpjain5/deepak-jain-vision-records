
import React from "react";
import LoginForm from "@/components/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/20 to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary">DEEPAK P JAIN</CardTitle>
            <p className="text-gray-500">Vision Records</p>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
