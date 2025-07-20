import { useParams, useNavigate ,Link} from "react-router"

import { useTraining } from "@/hooks/useTraining"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowLeft, Clock, User, Calendar, Edit } from "lucide-react"
import { Role, useAuth } from "@/hooks/useAuth"



const  TrainingDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { getModule } = useTraining()
  const navigate = useNavigate()

  const module = getModule(id as string)

  if (!user) {
    navigate("/login")
    return null
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Module Not Found</CardTitle>
            <CardDescription className="text-center">The requested training module could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/training">Back to Training</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const canEdit = [Role.Admin, Role.Trainer].includes(user.role)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-blue-100 text-blue-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      case "Essential":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">

              
              <div className="flex items-center space-x-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
                  <p className="text-gray-600">{module.description}</p>
                </div>
              </div>
           
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
           <div className="flex items-center justify-between space-x-4">
            <Button  size="sm" asChild>
                <Link to="/training">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Link>
              </Button>
            {canEdit && (
              <Button className="bg-green-600 text-white hover:bg-green-700"asChild>
                <Link to={`/training/edit/${module.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Module
                </Link>
              </Button>
            )}
           </div>
          {/* Module Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">{module.category}</Badge>
                  <Badge className={getLevelColor(module.level)}>{module.level}</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {module.duration}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Created by: {module.createdBy}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created: {new Date(module.createdAt).toLocaleDateString()}
                </div>
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
              {/* <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {module.content}
            </div> */}
             <div
              className="prose prose-lg prose-rose max-w-none"
              dangerouslySetInnerHTML={{ __html: module.content }}
            />
            </CardContent>
          </Card>

          {/* Actions */}
          {/* <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center space-x-4">
                <Button className="bg-green-600 hover:bg-green-700">Mark as Completed</Button>
                <Button variant="outline">Download for Offline</Button>
                <Button variant="outline" asChild>
                  <Link to="/training">Back to Training Center</Link>
                </Button>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}


export default TrainingDetails





