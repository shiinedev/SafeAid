import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, UserPlus, Trash2, Shield, Calendar } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { Role, useAuthStore } from "@/lib/store/authStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/apiClient"
import { errorExtractMessage } from "@/utils/errorExtract"


interface User {
  _id: string
  username: string;
  email: string;
  role: Role,
  isActive: boolean
  password: ""
  createdAt: string

}

interface UpdateStatusInput {
  id: string;
  isActive: boolean;
}

export default function UsersPage() {
  const { user } = useAuthStore()

  const [searchTerm, setSearchTerm] = useState("")
  const router = useNavigate()

  if (!user) {
    router("/login")
    return null
  }

  if (user.role !== Role.Admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">Only administrators can manage users.</CardDescription>
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


  const queryClient = useQueryClient();

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/users");
      return response.data;
    },
    retry: 1
  })

  const updateStatusMutation = useMutation({
    mutationFn: async (data: UpdateStatusInput) => {
      const response = await api.patch(`/users/status/${data.id}`, {
        isActive: data.isActive,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id:string) => {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  });


  const filteredUsers = users?.filter(
    (u: User) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    updateStatusMutation.mutate({ id, isActive });
  }

  const handleDeleteUser = async (id:string) =>{

    deleteMutation.mutate(id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center ">
        <div className="flex justify-center items-center">
          <p className="text-gray-500 text-2xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center ">
        <div className="flex justify-center items-center">
          <p className="text-gray-500 text-2xl">{errorExtractMessage(isError)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">Manage user accounts and permissions</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto  space-y-6">
          <div className="flex items-center justify-between ">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/users/new">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative max-w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm ? "No matching users found" : "No users found"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "Start by adding your first user"}
                  </p>
                  {!searchTerm && (
                    <Button asChild>
                      <Link to="/users/new">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add First User
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map((u: User) => (
                <Card key={u._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{u.username}</span>
                          <Badge className={getRoleColor(u.role)}>{u.role.replace("_", " ").toUpperCase()}</Badge>
                          <Badge variant={u.isActive ? "secondary" : "default"}>
                            {u.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex flex-col sm:flex-row sm:items-center space-x-4 mt-2">
                          <span>{u.email}</span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Joined: {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="hidden sm:flex items-center justify-end space-x-2">
                        <Badge className="bg-green-100 text-green-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Encrypted
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2 sm:flex-row justify-between">
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>User ID:</strong> {u._id}
                        </p>
                      </div>
                      <div className="flex space-x-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(u._id, !u.isActive)}
                          className={
                            u.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"
                          }
                          disabled={updateStatusMutation.isPending}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
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
              <span>All user data is encrypted and stored locally for security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
