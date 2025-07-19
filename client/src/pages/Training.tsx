
import { useState } from "react"

import { Categories, useTraining } from "../hooks/useTraining"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { BookOpen, Heart, Shield, Users, Search, Play, Download, Clock, Plus, Edit, ArrowLeft } from "lucide-react"
import {Link} from "react-router"
import { useAuthStore } from "@/lib/store/authStore"

export default function Training() {
  const { user } = useAuthStore()
  const { modules, loading } = useTraining()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const categories = ["All",...Categories]

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || module.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const canManageTraining = user && ["admin", "trainer"].includes(user.role)

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "First Aid":
        return Heart
      case "Security":
      case "Data Security":
        return Shield
      case "Mental Health":
      case "Communication":
        return Users
      default:
        return BookOpen
    }
  }

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8  text-purple-600" />
              <div>
                <h1 className="text-2xl  font-bold text-gray-900">Training Center</h1>
                <p className="text-gray-600 sm:block hidden">Access offline training resources and materials</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <Badge variant="outline">{modules.length} Modules</Badge>
              {canManageTraining && (
                <Button asChild variant={"secondary"}>
                  <Link to="/training/new">
                    <Plus  />
                    Add Training
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
        <div className="mb-6 space-y-4">
           <div className="flex items-center justify-between space-x-2 sm:hidden">
                         
              <Button variant="outline" asChild>
                <Link to="/dashboard">
                <ArrowLeft /> 
                 Dashboard</Link>
              </Button>
               <Badge variant="outline">{modules.length} Modules</Badge>  
               {canManageTraining && (
                <Button asChild variant={"secondary"}>
                  <Link to="/training/new">
                  
                    Add Training
                  </Link>
                </Button>
              )}
            </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search training modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const IconComponent = getIconForCategory(module.category)
            return (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{module.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {module.category}
                          </Badge>
                          <Badge className={`text-xs ${getLevelColor(module.level)}`}>{module.level}</Badge>
                        </div>
                      </div>
                    </div>
                    {canManageTraining && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/training/edit/${module.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{module.description}</CardDescription>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {module.duration}
                    </div>
                    <div className="text-sm text-gray-600">Available offline</div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1" variant={"secondary"} size="sm" asChild>
                      <Link to={`/training/${module.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredModules.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No training modules found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search terms or category filter" : "No training modules available"}
              </p>
              {canManageTraining && !searchTerm && (
                <Button asChild>
                  <Link to="/training/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Training Module
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Offline Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 text-sm">
                All training materials are stored locally and accessible without internet connection.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Role-Based Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 text-sm">
                Training content is accessible to all roles, with management restricted to admins and trainers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Secure Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 text-sm">
                Training modules are encrypted and stored locally for security and offline access.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
