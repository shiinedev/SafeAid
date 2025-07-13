
import { Shield, Users, Heart, BookOpen } from "lucide-react"
import { Card ,CardDescription, CardHeader, CardTitle} from "../components/ui/card"
import { Button } from "../components/ui/button"

 const  Home =  () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-red-600 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900">SafeAid</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure, offline-first aid data management platform for humanitarian organizations operating in challenging
            environments. Protect beneficiaries and field teams with encrypted, role-based data collection.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Secure by Design</CardTitle>
              <CardDescription>
                AES encryption, role-based access, and panic wipe functionality protect sensitive data under hostile
                conditions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Offline-First</CardTitle>
              <CardDescription>
                Works entirely offline with local data storage. Optional sync when network conditions are safe and
                secure.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Humanitarian Focus</CardTitle>
              <CardDescription>
                Built specifically for NGOs and humanitarian organizations working in surveillance-heavy or
                connectivity-denied zones.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <div className="space-x-4">
            <Button size="lg" >
              Access Platform
            </Button>
            <Button size="lg" variant="outline" >
              <BookOpen className="mr-2 h-5 w-5" />
              Training Resources
            </Button>
          </div>

          <div className="text-sm text-gray-500 max-w-2xl mx-auto">
            <p className="mb-2">
              <strong>Supported Roles:</strong> Admin, Field Agent, Medical Staff, Trainer
            </p>
            <p>
              This platform operates offline-first to ensure data security and accessibility in challenging field
              conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home