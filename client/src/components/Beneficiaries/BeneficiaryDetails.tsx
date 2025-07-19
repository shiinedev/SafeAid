import { useParams, useNavigate, Link } from "react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, ArrowLeft, Calendar, Edit, Phone, MapPin, AlertTriangle, FileText, UserCheck } from "lucide-react"
import { useBeneficiaries } from "@/hooks/useBeneficiaries"
import { useEffect } from "react"
import { Role, useAuthStore } from "@/lib/store/authStore"


export default function BeneficiaryDetailsPage() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const { getBeneficiary, loading: beneficiariesLoading } = useBeneficiaries()
  const navigate = useNavigate()

 

  const beneficiary = getBeneficiary(id as string)

  console.log(beneficiary)

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

 const canEdit = user ? [Role.Admin, Role.Trainer].includes(user.role) : false;
  

  if ( beneficiariesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading…</p>
      </div>
    )
  }
  

  if (!beneficiary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Beneficiary Not Found</CardTitle>
            <CardDescription className="text-center">The requested beneficiary could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/beneficiaries">Back to Beneficiaries</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className=" flex items-center space-x-4">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{beneficiary.name}</h1>
              <p className="text-sm text-gray-600">Beneficiary Profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">

        <div className="max-w-4xl mx-auto space-y-6">
          <div className=" flex items-center justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link to="/beneficiaries">
                <ArrowLeft className="h-4 w-4 mr-2" />
                 Beneficiaries
              </Link>
            </Button>
            {canEdit && (
              <Button variant="outline" asChild>
                <Link to={`/beneficiaries/edit/${beneficiary.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Beneficiary
                </Link>
              </Button>
            )}
          </div>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Full Name</p>
                      <p className="text-sm text-gray-600">{beneficiary.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Age</p>
                      <p className="text-gray-500 text-sm">{beneficiary.age} years old</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contact Number</p>
                      <p className="text-sm text-gray-600">{beneficiary.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{beneficiary.location || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Emergency Contact</span>
              </CardTitle>
              <CardDescription>Contact information for emergency situations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {beneficiary.emergencyContact || "No emergency contact information provided"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          {beneficiary.medicalInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Medical Information</span>
                </CardTitle>
                <CardDescription>Important medical details and health information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{beneficiary.medicalInfo}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          {beneficiary.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
                <CardDescription>Additional information and observations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{beneficiary.notes}</div>
              </CardContent>
            </Card>
          )}

          {/* Status and Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Actions</CardTitle>
              <CardDescription>Current status and available actions for this beneficiary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-6">

                {beneficiary.registeredAt && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Registered: {beneficiary.registeredAt}
                  </div>
                )}
                {beneficiary.registeredBy && (
                  <div className="flex items-center text-sm text-gray-600">
                    <UserCheck className="h-4 w-4 mr-1" />
                    By: {beneficiary.registeredBy}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {canEdit && (
                  <>
                    <Button variant="outline" asChild>
                      <Link to={`/beneficiaries/edit/${beneficiary.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                  
                  </>
                )}
                <Button variant="outline" asChild>
                  <Link to="/beneficiaries">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to List
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
