import { useParams, useNavigate ,Link} from "react-router"
import { Role, useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowLeft, Clock, User, Calendar, Edit } from "lucide-react"
import { useBeneficiaries } from "@/hooks/useBeneficiaries"


const  BeneficiaryDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { getBeneficiary } = useBeneficiaries()
  const navigate = useNavigate()

  const Beneficiary = getBeneficiary(id as string)
  console.log(Beneficiary);
  

  if (!user) {
    navigate("/login")
    return null
  }

  if (!Beneficiary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Beneficiary Not Found</CardTitle>
            <CardDescription className="text-center">The requested Beneficiary  could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/beneficiary">Back to Beneficiary</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const canEdit = [Role.Admin, Role.Trainer].includes(user.role)


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/training">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Training
                </Link>
              </Button>
              <div className="flex items-center space-x-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{Beneficiary.name}</h1>
                </div>
              </div>
            </div>
            {canEdit && (
              <Button variant="outline" asChild>
                <Link to={`/training/edit/${module.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Beneficiary
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Module Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">{Beneficiary.age}</Badge>
                  
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {Beneficiary.contact}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                
               
              </div>
            </CardContent>
          </Card>

          {/* Module Content */}
          <Card>
            <CardHeader>
              <CardTitle>Training Content</CardTitle>
              <CardDescription>
                Complete this module at your own pace. All content is available offline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {Beneficiary.emergencyContact}
            </div>
             
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center space-x-4">
                <Button className="bg-green-600 hover:bg-green-700">Mark as Completed</Button>
                <Button variant="outline">Download for Offline</Button>
                <Button variant="outline" asChild>
                  <Link to="/training">Back to Training Center</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


export default BeneficiaryDetails





