import { useState } from "react"
import { Role, useAuth } from "@/hooks/useAuth"
import { useBeneficiaries } from "@/hooks/useBeneficiaries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, UserPlus, Eye, Edit, Shield, Calendar, MapPin, Trash2 } from "lucide-react"
import {Link, useNavigate} from "react-router"


export default function BeneficiariesPage() {
  const { user } = useAuth()
  const { beneficiaries, deleteBeneficiary } = useBeneficiaries()
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  if (!user) {
    navigate("/login")
    return null
  }

  // Check if user has access to beneficiaries
  if (![Role.Admin, Role.Field_agent, Role.Medical_staff].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You don't have permission to view beneficiary records.
            </CardDescription>
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

  const filteredBeneficiaries = beneficiaries.filter(
    (beneficiary) =>
      beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Beneficiary Records</h1>
                <p className="text-gray-600">Manage and view beneficiary information</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {(user.role === Role.Admin || user.role === Role.Field_agent) && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/beneficiaries/new">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Beneficiary
                  </Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative max-w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search beneficiaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredBeneficiaries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No matching beneficiaries found" : "No beneficiaries registered"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Start by registering your first beneficiary"}
                </p>
                {!searchTerm && (user.role === Role.Admin || user.role === Role.Field_agent) && (
                  <Button asChild>
                    <Link to="/beneficiaries/new">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register First Beneficiary
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredBeneficiaries.map((beneficiary) => (
              <Card key={beneficiary.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{beneficiary.name}</span>
                        <Badge variant="outline">ID: {beneficiary.id}</Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Age: {beneficiary.age}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {beneficiary.location}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Encrypted
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Contact:</strong> {beneficiary.contact}
                      </p>
                      <p>
                        <strong>Emergency Contact:</strong> {beneficiary.emergencyContact}
                      </p>
                      {beneficiary.medicalInfo && (
                        <p>
                          <strong>Medical Notes:</strong> {beneficiary.medicalInfo.substring(0, 50)}...
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/beneficiaries/${beneficiary.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      {(user.role === Role.Admin || user.role === Role.Field_agent) && (
                        <>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/beneficiaries/${beneficiary.id}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteBeneficiary(beneficiary.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                      </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border">
            <Shield className="h-4 w-4 text-green-600" />
            <span>All data is encrypted and stored locally for security</span>
          </div>
        </div>
      </div>
    </div>
  )
}
