
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientForm from "@/components/PatientForm";
import SearchPatients from "@/components/SearchPatients";
import PatientList from "@/components/PatientList";
import ImportExport from "@/components/ImportExport";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<any[]>(() => {
    const storedPatients = localStorage.getItem("patients");
    return storedPatients ? JSON.parse(storedPatients) : [];
  });
  const [filteredPatients, setFilteredPatients] = useState<any[]>(patients);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Save patients data to localStorage whenever it changes
    localStorage.setItem("patients", JSON.stringify(patients));
    setFilteredPatients(patients);
  }, [patients]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const addPatient = (patient: any) => {
    // Check if mobile number already exists
    const mobileExists = patients.some(
      (p) => p.mobile === patient.mobile
    );

    if (mobileExists) {
      toast({
        title: "Error",
        description: "A patient with this mobile number already exists.",
        variant: "destructive",
      });
      return false;
    }

    setPatients([...patients, { ...patient, id: Date.now().toString() }]);
    toast({
      title: "Success",
      description: "Patient record has been added successfully.",
    });
    return true;
  };

  const handleSearch = (query: string, searchType: "name" | "mobile") => {
    if (!query.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter((patient) => {
      if (searchType === "name") {
        return patient.name.toLowerCase().includes(query.toLowerCase());
      } else {
        return patient.mobile.includes(query);
      }
    });

    setFilteredPatients(filtered);
  };

  const importPatients = (newPatients: any[]) => {
    // Filter out patients with duplicate mobile numbers
    const existingMobiles = new Set(patients.map((p) => p.mobile));
    const uniquePatients = newPatients.filter((p) => !existingMobiles.has(p.mobile));
    
    if (uniquePatients.length < newPatients.length) {
      toast({
        title: "Warning",
        description: `${newPatients.length - uniquePatients.length} records were skipped due to duplicate mobile numbers.`,
        variant: "default",
      });
    }

    if (uniquePatients.length > 0) {
      setPatients([...patients, ...uniquePatients]);
      toast({
        title: "Import Successful",
        description: `${uniquePatients.length} patient records were imported.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">DEEPAK P JAIN</h1>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Vision Records</span>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary"
              onClick={handleLogout}
            >
              <LogOutIcon className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <Tabs defaultValue="add" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="add">Add Patient</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="list">All Patients</TabsTrigger>
            <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Add New Patient Record</h2>
            <PatientForm onSubmit={addPatient} />
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Search Patient Records</h2>
            <SearchPatients onSearch={handleSearch} />
            <PatientList patients={filteredPatients} />
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">All Patient Records</h2>
            <PatientList patients={patients} />
          </TabsContent>
          
          <TabsContent value="import-export" className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Import/Export Records</h2>
            <ImportExport patients={patients} onImport={importPatients} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
