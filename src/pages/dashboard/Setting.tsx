import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Shield, AlertTriangle, Trash2, Download, Upload, User, Lock, Database } from "lucide-react"
import { useBeneficiaries } from "@/hooks/useBeneficiaries"
import { useNavigate, Link } from "react-router"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showPanicConfirm, setShowPanicConfirm] = useState(false)
  const [settings, setSettings] = useState({
    autoSync: false,
    encryptionLevel: "high",
    offlineMode: true,
    dataRetention: "30",
  })

  const { beneficiaries } = useBeneficiaries()

  if (!user) {
    navigate("/login")
    return null
  }

  const handlePanicWipe = async () => {
    if (window.confirm("This will permanently delete ALL local data. This action cannot be undone. Continue?")) {
      try {
        // Clear all local storage
        localStorage.clear()
        sessionStorage.clear()

        // Clear IndexedDB
        if ("indexedDB" in window) {
          const databases = await indexedDB.databases()
          databases.forEach((db) => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name)
            }
          })
        }

        // Logout and redirect
        logout()
        navigate("/")

        alert("Panic wipe completed. All local data has been destroyed.")
      } catch (error) {
        console.error("Error during panic wipe:", error)
        alert("Error during panic wipe. Please try again.")
      }
    }
  }

  const handleExportData = () => {
    try {
      // Use the decrypted beneficiaries from the hook instead of parsing encrypted localStorage
      const data = {
        beneficiaries: beneficiaries, // This comes from useBeneficiaries hook and is already decrypted
        settings: settings,
        exportDate: new Date().toISOString(),
        user: {
          email: user.email,
          role: user.role,
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
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-gray-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your SafeAid preferences and security</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* User Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Profile
              </CardTitle>
              <CardDescription>Your account information and role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input value={user.email} disabled />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input value={user.role.replace("_", " ").toUpperCase()} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and encryption options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Offline Mode</Label>
                  <p className="text-sm text-gray-600">Work entirely offline for maximum security</p>
                </div>
                <Switch
                  checked={settings.offlineMode}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, offlineMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Auto-Sync</Label>
                  <p className="text-sm text-gray-600">Automatically sync data when connection is secure</p>
                </div>
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoSync: checked }))}
                />
              </div>

              <div>
                <Label>Data Retention (days)</Label>
                <Input
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) => setSettings((prev) => ({ ...prev, dataRetention: e.target.value }))}
                  className="max-w-32"
                />
                <p className="text-sm text-gray-600 mt-1">How long to keep data locally before requiring re-sync</p>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data Management
              </CardTitle>
              <CardDescription>Export and manage your local data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Button onClick={handleExportData} variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                {/* <Button variant="outline" className="w-full bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button> */}
              </div>
              <p className="text-sm text-gray-600">
                Export your data for backup or transfer to another device. All exported data remains encrypted.
              </p>
            </CardContent>
          </Card>

          {/* Emergency Actions */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Emergency Actions
              </CardTitle>
              <CardDescription>Critical security actions for emergency situations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Panic Wipe:</strong> Immediately destroys all local data to protect beneficiaries and field
                  workers if device is compromised. This action cannot be undone.
                </AlertDescription>
              </Alert>

              {!showPanicConfirm ? (
                <Button variant="destructive" onClick={() => setShowPanicConfirm(true)} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Initialize Panic Wipe
                </Button>
              ) : (
                <div className="space-y-3">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>WARNING:</strong> This will permanently delete ALL local data including beneficiary
                      records, training progress, and settings. This action cannot be undone.
                    </AlertDescription>
                  </Alert>
                  <div className="flex space-x-3">
                    <Button variant="destructive" onClick={handlePanicWipe} className="flex-1">
                      Confirm Panic Wipe
                    </Button>
                    <Button variant="outline" onClick={() => setShowPanicConfirm(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Only - Sync Center */}
          {user.role === "admin" && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Database className="h-5 w-5 mr-2" />
                  Admin Controls
                </CardTitle>
                <CardDescription>Administrative functions and data synchronization</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/sync">
                    <Database className="h-4 w-4 mr-2" />
                    Access Sync Center
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
