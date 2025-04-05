
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface PatientListProps {
  patients: any[];
}

const PatientList = ({ patients }: PatientListProps) => {
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  if (patients.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No records found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No patient records match your search criteria or no records have been added yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead className="hidden sm:table-cell">Frame Price</TableHead>
              <TableHead className="hidden sm:table-cell">Glass Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id || patient.mobile}>
                <TableCell>{patient.date}</TableCell>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.mobile}</TableCell>
                <TableCell className="hidden sm:table-cell">₹{patient.framePrice}</TableCell>
                <TableCell className="hidden sm:table-cell">₹{patient.glassPrice}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Patient Details Dialog */}
      <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        {selectedPatient && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedPatient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-medium">{selectedPatient.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedPatient.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-medium">
                    ₹{Number(selectedPatient.framePrice) + Number(selectedPatient.glassPrice)}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Right Eye</h3>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">SPH</p>
                    <Badge variant="outline">{selectedPatient.rightEye.sphere || "-"}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">CYL</p>
                    <Badge variant="outline">{selectedPatient.rightEye.cylinder || "-"}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">AXIS</p>
                    <Badge variant="outline">{selectedPatient.rightEye.axis || "-"}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">ADD</p>
                    <Badge variant="outline">{selectedPatient.rightEye.add || "-"}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Left Eye</h3>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">SPH</p>
                    <Badge variant="outline">{selectedPatient.leftEye.sphere || "-"}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">CYL</p>
                    <Badge variant="outline">{selectedPatient.leftEye.cylinder || "-"}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">AXIS</p>
                    <Badge variant="outline">{selectedPatient.leftEye.axis || "-"}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">ADD</p>
                    <Badge variant="outline">{selectedPatient.leftEye.add || "-"}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Pricing</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Frame Price</p>
                    <Badge variant="outline" className="text-green-600">₹{selectedPatient.framePrice}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">Glass Price</p>
                    <Badge variant="outline" className="text-green-600">₹{selectedPatient.glassPrice}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Remarks</h3>
                <p className="text-sm bg-gray-50 p-3 rounded">{selectedPatient.remarks}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default PatientList;
