
import { useBeneficiaries } from "@/hooks/useBeneficiaries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Shield, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Beneficiary, BeneficiarySchema } from "@/schemas/schemas"
import { useParams } from "react-router"
import { useEffect } from "react"
import { Role, useAuthStore } from "@/lib/store/authStore"

export default function AddBeneficiariesForm() {


  const { user } = useAuthStore()
  const { addBeneficiary, getBeneficiary, updateBeneficiary } = useBeneficiaries()
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(BeneficiarySchema),
    defaultValues: {
      name: "",
      contact: "",
      emergencyContact: "",
      location: "",
      medicalInfo: "",
      notes: ""
    }
  })
  const { id } = useParams();
  const Beneficiary = getBeneficiary(id as string);


  useEffect(() => {
    if (Beneficiary) {
      form.setValue("name", Beneficiary.name)
      form.setValue("age", Beneficiary.age)
      form.setValue("contact", Beneficiary.contact)
      form.setValue("emergencyContact", Beneficiary.emergencyContact)
      form.setValue("medicalInfo", Beneficiary.medicalInfo)
      form.setValue("location", Beneficiary.location)
      form.setValue("notes", Beneficiary.notes)

    }
  }, [Beneficiary, id])

  const { isSubmitSuccessful, isSubmitting } = form.formState;

  if (!user) {
    navigate("/login")
    return null
  }

  if (![Role.Admin, Role.Field_agent].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You don't have permission to register beneficiaries.
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

  const onSubmit: SubmitHandler<Beneficiary> = async (data) => {
    console.log(data);
    try {

      if (Beneficiary) {
        await updateBeneficiary(Beneficiary.id, data);
        navigate("/beneficiaries")
      } else {
        await addBeneficiary({
          ...data,
          registeredBy: user.email,
          registeredAt: new Date().toDateString()
        });
        setTimeout(() => {
          navigate("/beneficiaries")
        }, 2000)
      }

    } catch (error) {

    }

  }

  if (isSubmitSuccessful && !Beneficiary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Beneficiary Registered</CardTitle>
            <CardDescription>The beneficiary has been successfully registered and encrypted locally.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/beneficiaries">View All Beneficiaries</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">

          <div className="flex items-center space-x-4">
            <UserPlus className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{Beneficiary ? 'Update' : "Registered"} Beneficiary</h1>
              <p className="text-gray-600">{Beneficiary ? "Update" : "Add a new"} beneficiary to the secure database</p>
            </div>
          </div>

        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        <div className="max-w-2xl mx-auto">
           <Button  size="sm" className="mb-4" asChild>
              <Link to="/beneficiaries">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Link>
            </Button>
            
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              All beneficiary data will be encrypted and stored locally for security. This information will only be
              accessible to authorized personnel.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Beneficiary Information</CardTitle>
              <CardDescription>
                Please fill in all required fields. All data is encrypted automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                {...field}
                                placeholder="Enter full name"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>

                    <div className="space-y-2">
                      <FormField
                        name="age"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel>Age *</FormLabel>
                            <FormControl>
                              <Input
                                type={"number"}
                                placeholder="Enter age"
                                {...field}
                                 value={field.value as number | string}
                              />

                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormField
                        name="contact"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel>Contact Information *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Phone number or contact method"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">

                      <FormField
                        name="emergencyContact"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel>Emergency Contact *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Emergency contact information"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">

                    <FormField
                      name="location"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Current location or address"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      name="medicalInfo"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel>Medical Information</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Any relevant medical information, allergies, or conditions"
                              rows={3}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">

                    <FormField
                      name="notes"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Any additional notes or observations"
                              rows={3}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                      {Beneficiary ? isSubmitting ? "Updating..." : "Update Beneficiary" : isSubmitting ? "Registering..." : "Register Beneficiary"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link to="/beneficiaries">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
