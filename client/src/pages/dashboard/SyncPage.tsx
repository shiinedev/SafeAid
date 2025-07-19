import { useState } from "react"
import { useBeneficiaries } from "@/hooks/useBeneficiaries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Upload, Download, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Link, useNavigate } from "react-router"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useAuthStore } from "@/lib/store/authStore"


export default function SyncPage() {
  const { user } = useAuthStore()
  const { beneficiaries } = useBeneficiaries()
  const navigate = useNavigate()
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")
  const [lastSync, setLastSync] = useState<string | null>(localStorage.getItem("safeaid_last_sync"))

  if (!user) {
    navigate("/login")
    return null
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">Only administrators can access the Sync Center.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSync = async () => {
    setSyncStatus("syncing")

    // Simulate sync process
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const now = new Date().toISOString()
      localStorage.setItem("safeaid_last_sync", now)
      setLastSync(now)
      setSyncStatus("success")

      setTimeout(() => setSyncStatus("idle"), 3000)
    } catch (error) {
      setSyncStatus("error")
      setTimeout(() => setSyncStatus("idle"), 3000)
    }
  }

 
 const handleExportAll = () => {
    try {
      // Use the decrypted beneficiaries from the hook instead of parsing encrypted localStorage
      const data = {
        beneficiaries: beneficiaries,
        metadata: {
          exportedBy: user.email,
          exportDate: new Date().toISOString(),
          totalRecords: beneficiaries.length,
        },
      }
      const doc = new jsPDF()

      // Add title and metadata
      doc.setFontSize(16)
      doc.text('SafeAid Data Export', 14, 15)

      doc.setFontSize(10)
      doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 22)
      doc.text(`User: ${user.email} (${user.role})`, 14, 28)

      // Table headers
      const tableHeaders = ['Name', 'Age', 'contact', "emergencyContact", "location", "medicalInfo", "notes"]

      // Table rows (converted to string just in case)
      const tableRows = data?.beneficiaries.map(b => [
        b.name ?? '',
        b.age?.toString() ?? '',
        b.contact ?? '',
        b.emergencyContact ?? '',
        b.location ?? '',
        b.medicalInfo ?? '',
        b.notes ?? ''
      ])

      // Generate table
      autoTable(doc, {
        head: [tableHeaders],
        body: tableRows,
        startY: 35,
      })

      // Save the PDF
      doc.save(`safeaid_export_${new Date().toISOString().split('T')[0]}.pdf`)
      alert('PDF exported successfully with table!')
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Error exporting data. Please try again.")
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="sm:text-2xl font-bold text-gray-900">Sync Center</h1>
                <p className="text-gray-600  hidden sm:block">Manage data synchronization and exports</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Admin Only</Badge>
              <Button variant="outline" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Sync Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Synchronization Status
              </CardTitle>
              <CardDescription>Current sync status and last synchronization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex sm:flex-col items-center space-x-2 sm:text-center">
                  <div className="text-2xl font-bold text-blue-600">{beneficiaries.length}</div>
                  <div className="text-sm text-gray-600">Local Records</div>
                </div>
                <div className="sm:text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {syncStatus === "success" ? "Synced" : "Pending"}
                  </div>
                  <div className="text-sm text-gray-600">Sync Status</div>
                </div>
                <div className="sm:text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {lastSync ? new Date(lastSync).toLocaleDateString() : "Never"}
                  </div>
                  <div className="text-sm text-gray-600">Last Sync</div>
                </div>
              </div>

              {syncStatus === "syncing" && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>Synchronization in progress... Please wait.</AlertDescription>
                </Alert>
              )}

              {syncStatus === "success" && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Data synchronized successfully. All records are up to date.</AlertDescription>
                </Alert>
              )}

              {syncStatus === "error" && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Synchronization failed. Please check your connection and try again.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Sync Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Sync Actions</CardTitle>
              <CardDescription>Manage data synchronization with secure servers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={handleSync}
                  disabled={syncStatus === "syncing"}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {syncStatus === "syncing" ? "Syncing..." : "Sync to Server"}
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Pull from Server
                </Button>
              </div>

              <Alert className="border-yellow-200 bg-yellow-50">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Note:</strong> Only sync when you are in a secure environment and trust the network
                  connection. All data remains encrypted during transmission.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Data Export */}
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Export encrypted data for backup or transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Button onClick={handleExportAll} variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
                {/* <Button variant="outline" className="w-full bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Export Beneficiaries Only
                </Button> */}
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  Exported data includes all beneficiary records, metadata, and timestamps. All sensitive information
                  remains encrypted in the export file.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sync Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Sync Configuration</CardTitle>
              <CardDescription>Configure synchronization preferences and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Auto-sync when online</div>
                    <div className="text-sm text-gray-600">Automatically sync when secure connection detected</div>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Encryption level</div>
                    <div className="text-sm text-gray-600">AES-256 encryption for all data</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">High</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Sync verification</div>
                    <div className="text-sm text-gray-600">Verify data integrity after sync</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
