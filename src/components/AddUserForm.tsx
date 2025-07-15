import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useUsers } from "@/hooks/useUsers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Shield, ArrowLeft } from "lucide-react"
import {Link, useNavigate} from "react-router"

export default function AddUsersForm() {
  const { user } = useAuth()
  const { addUser } = useUsers()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "field_agent" as "admin" | "field_agent" | "medical_staff" | "trainer",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!user) {
    navigate("/auth/login")
    return null
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">Only administrators can create users.</CardDescription>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addUser({
        ...formData,
        isActive: true,
        createdBy: user.email,
      })

      setSuccess(true)
      setTimeout(() => {
        navigate("/users")
      }, 2000)
    } catch (error) {
      console.error("Error creating user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-800">User Created Successfully</CardTitle>
            <CardDescription>The user account has been created and encrypted locally.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/users">View All Users</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/users">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center space-x-4">
              <UserPlus className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
                <p className="text-gray-600">Add a new user to the SafeAid platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              User accounts will be encrypted and stored locally. Users will need to be provided with login credentials
              separately for security.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Fill in the details for the new user account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="field_agent">Field Agent</option>
                    <option value="medical_staff">Medical Staff</option>
                    <option value="trainer">Trainer</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <p className="text-sm text-gray-600">
                    Choose the appropriate role based on the user's responsibilities and required access level.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Role Permissions:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Field Agent:</strong> Register beneficiaries, update records, offline storage
                    </p>
                    <p>
                      <strong>Medical Staff:</strong> View/add medical records for registered individuals
                    </p>
                    <p>
                      <strong>Trainer:</strong> Access and create training content
                    </p>
                    <p>
                      <strong>Administrator:</strong> Full access including user management and data sync
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Creating User..." : "Create User"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/users">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
