
import { Role, useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, BookOpen, Settings, Shield, Database, AlertTriangle, Activity } from "lucide-react"
import {Link} from "react-router"
import { useNavigate } from "react-router"
import { useBeneficiaries } from "@/hooks/useBeneficiaries"
import { useOfflineStatus } from "@/hooks/useOfflineStatus"


const  Dashboard = () =>{
  const { user, logout } = useAuth()
  const { beneficiaries } = useBeneficiaries()
  const isOffline = useOfflineStatus()
  const navigate = useNavigate()

  if (!user) {
    navigate("/login")
    return null
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case Role.Admin:
        return "bg-red-100 text-red-800"
      case Role.Field_agent:
        return "bg-blue-100 text-blue-800"
      case Role.Medical_staff:
        return "bg-green-100 text-green-800"
      case Role.Trainer:
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getQuickActions = () => {
    const actions = []

    if (user.role === Role.Admin || user.role === Role.Field_agent) {
      actions.push({
        title: "Register Beneficiary",
        description: "Add new beneficiary record",
        icon: UserPlus,
        href: "/beneficiaries/new",
        color: "bg-blue-600 hover:bg-blue-700",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      })
    }

    if (user.role === Role.Admin || user.role === Role.Field_agent || user.role === Role.Medical_staff) {
      actions.push({
        title: "View Beneficiaries",
        description: "Manage beneficiary records",
        icon: Users,
        href: "/beneficiaries",
        color: "bg-green-600 hover:bg-green-700",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      })
    }

    actions.push({
      title: "Training Center",
      description: "Access training resources",
      icon: BookOpen,
      href: "/training",
      color: "bg-purple-600 hover:bg-purple-700",
      iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
    })

    if (user.role === Role.Admin) {
      actions.push({
        title: "User Management",
        description: "Manage user accounts and roles",
        icon: Users,
        href: "/users",
        color: "bg-indigo-600 hover:bg-indigo-700",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
      })
    }

    if (user.role === Role.Admin) {
      actions.push({
        title: "Sync Center",
        description: "Manage data synchronization",
        icon: Database,
        href: "/sync",
        color: "bg-rose-600 hover:bg-rose-700",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
      })
    }

    return actions
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="sm:h-8 sm:w-8 text-red-600" />
              <div>
                <h1 className="sm:text-2xl font-bold text-gray-900">SafeAid Dashboard</h1>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleColor(user.role)}>{user.role.replace("_", " ").toUpperCase()}</Badge>
                  <Badge variant={isOffline ? "destructive" : "secondary"}>{isOffline ? "OFFLINE" : "ONLINE"}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link to="/settings">
                  <Settings />
                  Settings
                </Link>
              </Button>
              <Button  onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Beneficiaries</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{beneficiaries.length}</div>
              <p className="text-xs text-muted-foreground">Stored locally</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Secure</div>
              <p className="text-xs text-muted-foreground">Data encrypted locally</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connection</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isOffline ? "text-red-600" : "text-green-600"}`}>
                {isOffline ? "Offline" : "Online"}
              </div>
              <p className="text-xs text-muted-foreground">{isOffline ? "Working offline" : "Connected to network"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">Panic wipe available</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getQuickActions().map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.iconBg} ${action.iconColor}`}>
                    <action.icon className="h-6 w-6 " />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className={`w-full  ${action.color}`}>
                  <Link to={action.href}>Access {action.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {isOffline && (
          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-yellow-800">Offline Mode Active</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">
                You are currently working offline. All data is being stored locally and encrypted. Data synchronization
                will be available when you return online and access the Sync Center.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


export default Dashboard
