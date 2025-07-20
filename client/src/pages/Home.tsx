
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Lock, Database, ArrowRight } from "lucide-react"
import { Link } from "react-router"

export default function Home() {
 

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SecureAid</h1>
          </div>
          <div className="flex items-center space-x-4">
          <Link to="/login">
             <Button  >
             Login
            </Button>
          </Link> 
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Secure Beneficiary Data Management for NGOs
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Collect, encrypt, and manage sensitive beneficiary data with client-side encryption. All data stays on
              your device - no servers, no cloud storage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login"><Button size="lg"  className="text-lg px-8 py-3">
                Start Collecting Data
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Built for Privacy & Security</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Every feature designed with data protection and privacy in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Lock className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <CardTitle>Client-Side Encryption</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  AES-GCM encryption using Web Crypto API. Data is encrypted before being stored locally.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Database className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <CardTitle>Local Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  All data stays on your device. No servers, no cloud storage, complete data sovereignty.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <CardTitle>Beneficiary Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete CRUD operations with search, filtering, and pagination for managing beneficiary records.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <CardTitle>Form Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Robust form validation using Zod schemas to ensure data integrity and completeness.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

     
      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Beneficiary Data?</h2>
          <p className="text-xl mb-8 opacity-90">Start managing sensitive data with complete privacy and security</p>
         <Link to="/">
         <Button size="lg" variant="secondary"  className="text-lg px-8 py-3">
            Try Demo Now
          </Button>
          </Link> 
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-6 w-6" />
              <span className="text-xl font-bold">SecureAid</span>
            </div>
            <p className="text-gray-400 mb-4">Secure beneficiary data management for humanitarian organizations.</p>
            <p className="text-gray-500 text-sm">
              &copy; 2025 SecureAid. All rights reserved. No data leaves your device.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
