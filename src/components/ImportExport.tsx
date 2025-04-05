
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportExportProps {
  patients: any[];
  onImport: (patients: any[]) => void;
}

const ImportExport = ({ patients, onImport }: ImportExportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const exportToCSV = () => {
    if (patients.length === 0) {
      toast({
        title: "No Records",
        description: "There are no patient records to export.",
        variant: "destructive",
      });
      return;
    }

    // Define headers based on our patient object structure
    const headers = [
      "Date",
      "Name",
      "Mobile",
      "Right Eye Sphere",
      "Right Eye Cylinder",
      "Right Eye Axis",
      "Right Eye Add",
      "Left Eye Sphere",
      "Left Eye Cylinder",
      "Left Eye Axis",
      "Left Eye Add",
      "Frame Price",
      "Glass Price",
      "Remarks"
    ];

    // Map patient objects to CSV rows
    const rows = patients.map(patient => [
      patient.date,
      patient.name,
      patient.mobile,
      patient.rightEye.sphere,
      patient.rightEye.cylinder,
      patient.rightEye.axis,
      patient.rightEye.add,
      patient.leftEye.sphere,
      patient.leftEye.cylinder,
      patient.leftEye.axis,
      patient.leftEye.add,
      patient.framePrice,
      patient.glassPrice,
      patient.remarks
    ]);

    // Create CSV content
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        // Wrap fields in double quotes to handle commas in text
        `"${String(cell || "").replace(/"/g, '""')}"`
      ).join(','))
    ].join('\n');

    // Create a Blob and download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `deepak-vision-records-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `${patients.length} records have been exported to CSV.`,
    });
  };

  const importFromCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n');
        const headers = rows[0].split(',').map(header => 
          header.replace(/^"|"$/g, '').trim()
        );

        // Map CSV rows to patient objects
        const importedPatients = rows.slice(1).filter(row => row.trim()).map((row, index) => {
          // Parse CSV row considering quoted fields that may contain commas
          const values: string[] = [];
          let inQuote = false;
          let currentValue = '';
          
          for (let i = 0; i < row.length; i++) {
            const char = row[i];
            
            if (char === '"') {
              inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
              values.push(currentValue);
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          values.push(currentValue); // Add the last value
          
          // Clean up values (remove quotes)
          const cleanValues = values.map(val => val.replace(/^"|"$/g, ''));
          
          return {
            id: `imported-${Date.now()}-${index}`,
            date: cleanValues[0] || new Date().toISOString().split('T')[0],
            name: cleanValues[1] || '',
            mobile: cleanValues[2] || '',
            rightEye: {
              sphere: cleanValues[3] || '',
              cylinder: cleanValues[4] || '',
              axis: cleanValues[5] || '',
              add: cleanValues[6] || ''
            },
            leftEye: {
              sphere: cleanValues[7] || '',
              cylinder: cleanValues[8] || '',
              axis: cleanValues[9] || '',
              add: cleanValues[10] || ''
            },
            framePrice: cleanValues[11] || '0',
            glassPrice: cleanValues[12] || '0',
            remarks: cleanValues[13] || '',
            createdAt: new Date().toISOString()
          };
        });

        // Validate imported data
        const validPatients = importedPatients.filter(patient => {
          return patient.name && patient.mobile && patient.remarks && /^\d{10}$/.test(patient.mobile);
        });

        if (validPatients.length === 0) {
          toast({
            title: "Import Failed",
            description: "No valid patient records found in the CSV file.",
            variant: "destructive",
          });
          return;
        }

        if (validPatients.length < importedPatients.length) {
          toast({
            title: "Warning",
            description: `${importedPatients.length - validPatients.length} records were skipped due to invalid data.`,
            variant: "default",
          });
        }

        onImport(validPatients);

      } catch (error) {
        toast({
          title: "Import Failed",
          description: "There was an error processing the CSV file.",
          variant: "destructive",
        });
        console.error("Import error:", error);
      } finally {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.onerror = () => {
      toast({
        title: "Import Failed",
        description: "There was an error reading the CSV file.",
        variant: "destructive",
      });
    };

    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" /> Export Data
          </CardTitle>
          <CardDescription>
            Export all patient records to a CSV file that you can open in Excel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={exportToCSV} 
            className="w-full"
            disabled={patients.length === 0}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Export to Excel
          </Button>
          {patients.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              No records available to export.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" /> Import Data
          </CardTitle>
          <CardDescription>
            Import patient records from a CSV file exported from Excel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={importFromCSV}
              className="hidden"
              id="csv-upload"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Select CSV File
            </Button>
            <p className="text-xs text-gray-500">
              The CSV file should have columns for date, name, mobile number, eye details, prices, and remarks.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportExport;
