import { Clock, Shield, Users, Zap } from "lucide-react"
import LandingPageAuth from "./landing-page-auth"

const landingPageHero = () => {
  return (
    <div>
         <div className="container mx-auto px-4 py-16 mb-5">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">Modern Time Tracking</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            Streamline your workforce management with our intuitive check-in and check-out system. Built for modern
            teams who value simplicity and efficiency.
          </p>
        </div>
        <LandingPageAuth/>
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 my-16 ">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Lightning Fast</h3>
            <p className="text-slate-600">Check in and out with a single click. No complicated processes.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure & Reliable</h3>
            <p className="text-slate-600">Your data is protected with enterprise-grade security.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Team Focused</h3>
            <p className="text-slate-600">Built for teams of all sizes, from startups to enterprises.</p>
          </div>
        </div>
    </div>
    </div>
  )
}

export default landingPageHero