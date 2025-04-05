
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EyeDetails {
  sphere: string;
  cylinder: string;
  axis: string;
  add: string;
}

interface PatientFormProps {
  onSubmit: (patient: any) => boolean;
}

const PatientForm = ({ onSubmit }: PatientFormProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [rightEye, setRightEye] = useState<EyeDetails>({
    sphere: "",
    cylinder: "",
    axis: "",
    add: "",
  });
  const [leftEye, setLeftEye] = useState<EyeDetails>({
    sphere: "",
    cylinder: "",
    axis: "",
    add: "",
  });
  const [framePrice, setFramePrice] = useState("");
  const [glassPrice, setGlassPrice] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name || !mobile || !remarks) {
      alert("Please fill in all required fields: Name, Mobile Number, and Remarks");
      return;
    }

    // Validate mobile number format (10 digits)
    if (!/^\d{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const patient = {
      date: format(date, "yyyy-MM-dd"),
      name,
      mobile,
      rightEye,
      leftEye,
      framePrice: framePrice || "0",
      glassPrice: glassPrice || "0",
      remarks,
      createdAt: new Date().toISOString(),
    };

    const success = onSubmit(patient);
    
    if (success) {
      // Clear form after successful submission
      setName("");
      setMobile("");
      setRightEye({
        sphere: "",
        cylinder: "",
        axis: "",
        add: "",
      });
      setLeftEye({
        sphere: "",
        cylinder: "",
        axis: "",
        add: "",
      });
      setFramePrice("");
      setGlassPrice("");
      setRemarks("");
    }
  };

  const handleRightEyeChange = (field: keyof EyeDetails, value: string) => {
    setRightEye({ ...rightEye, [field]: value });
  };

  const handleLeftEyeChange = (field: keyof EyeDetails, value: string) => {
    setLeftEye({ ...leftEye, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Patient Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number <span className="text-red-500">*</span></Label>
          <Input
            id="mobile"
            type="tel"
            pattern="\d{10}"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>
      </div>

      {/* Eye Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right Eye */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Right Eye Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rightSphere">Sphere</Label>
                <Input
                  id="rightSphere"
                  value={rightEye.sphere}
                  onChange={(e) => handleRightEyeChange("sphere", e.target.value)}
                  placeholder="+/-"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rightCylinder">Cylinder</Label>
                <Input
                  id="rightCylinder"
                  value={rightEye.cylinder}
                  onChange={(e) => handleRightEyeChange("cylinder", e.target.value)}
                  placeholder="+/-"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rightAxis">Axis</Label>
                <Input
                  id="rightAxis"
                  type="number"
                  min="1"
                  max="180"
                  value={rightEye.axis}
                  onChange={(e) => handleRightEyeChange("axis", e.target.value)}
                  placeholder="1-180"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rightAdd">Add</Label>
                <Input
                  id="rightAdd"
                  value={rightEye.add}
                  onChange={(e) => handleRightEyeChange("add", e.target.value)}
                  placeholder="+/-"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Left Eye */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Left Eye Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leftSphere">Sphere</Label>
                <Input
                  id="leftSphere"
                  value={leftEye.sphere}
                  onChange={(e) => handleLeftEyeChange("sphere", e.target.value)}
                  placeholder="+/-"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leftCylinder">Cylinder</Label>
                <Input
                  id="leftCylinder"
                  value={leftEye.cylinder}
                  onChange={(e) => handleLeftEyeChange("cylinder", e.target.value)}
                  placeholder="+/-"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leftAxis">Axis</Label>
                <Input
                  id="leftAxis"
                  type="number"
                  min="1"
                  max="180"
                  value={leftEye.axis}
                  onChange={(e) => handleLeftEyeChange("axis", e.target.value)}
                  placeholder="1-180"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leftAdd">Add</Label>
                <Input
                  id="leftAdd"
                  value={leftEye.add}
                  onChange={(e) => handleLeftEyeChange("add", e.target.value)}
                  placeholder="+/-"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="framePrice">Frame Price (₹)</Label>
          <Input
            id="framePrice"
            type="number"
            min="0"
            value={framePrice}
            onChange={(e) => setFramePrice(e.target.value)}
            placeholder="Enter frame price"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="glassPrice">Glass Price (₹)</Label>
          <Input
            id="glassPrice"
            type="number"
            min="0"
            value={glassPrice}
            onChange={(e) => setGlassPrice(e.target.value)}
            placeholder="Enter glass price"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks <span className="text-red-500">*</span></Label>
        <Textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Additional notes about the patient"
          required
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full md:w-auto">Save Patient Record</Button>
    </form>
  );
};

export default PatientForm;
