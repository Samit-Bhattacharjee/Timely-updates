import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Clock, MapPin, Calendar, TrendingUp, LogIn, LogOut } from "lucide-react"
import { useAuth } from "../contexts/auth-contexts"
import { DashboardHeader } from "./dashboard-header"
import { toast } from "sonner"

interface BackendAttendanceRecord {
  id: number;
  userId: number;
  checkInTime: string;
  checkOutTime: string | null;
  user: {
    name: string | null;
    email: string;
  }
}

export function Dashboard() {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [records, setRecords] = useState<BackendAttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const token = localStorage.getItem('token')

  const fetchRecords = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/attendance/daily`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch records");
      const data = await res.json()
      setRecords(data)
    } catch (err) {
      toast.error("Failed to load attendance records")
    }
  }

  useEffect(() => {
    fetchRecords()
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckIn = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/attendance/check-in`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Check-in failed');
      }
      toast.success("Checked in successfully")
      fetchRecords()
    } catch (err: any) {
      toast.error(err.message || "Check-in failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckOut = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/attendance/check-out`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Check-out failed');
      }
      toast.success("Checked out successfully")
      fetchRecords()
    } catch (err: any) {
      toast.error(err.message || "Check-out failed")
    } finally {
      setIsLoading(false)
    }
  }

  const todaysRecord = records.find(r => r.userId.toString() == user?.id);
  const isCheckedIn = !!todaysRecord && !todaysRecord.checkOutTime;

  let lastAction: "check-in" | "check-out" | null = null;
  let lastActionTime: string | null = null;

  if (todaysRecord) {
    if (todaysRecord.checkOutTime) {
      lastAction = 'check-out';
      lastActionTime = new Date(todaysRecord.checkOutTime).toLocaleTimeString();
    } else if (todaysRecord.checkInTime) {
      lastAction = 'check-in';
      lastActionTime = new Date(todaysRecord.checkInTime).toLocaleTimeString();
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTotalHoursToday = () => {
    if (!todaysRecord || !todaysRecord.checkInTime) return "0h 0m"
    
    const checkInTime = new Date(todaysRecord.checkInTime).getTime()
    const checkOutTime = todaysRecord.checkOutTime ? new Date(todaysRecord.checkOutTime).getTime() : currentTime.getTime()

    if (isNaN(checkInTime)) return "0h 0m";

    const totalMinutes = (checkOutTime - checkInTime) / (1000 * 60)
    
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.floor(totalMinutes % 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Good {currentTime.getHours() < 12 ? "morning" : currentTime.getHours() < 18 ? "afternoon" : "evening"},{" "}
            {user?.name?.split(" ")[0]}!
          </h2>
          <p className="text-slate-600">{formatDate(currentTime)}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Check In/Out Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-2xl">Current Time</CardTitle>
                <div className="text-4xl font-mono font-bold text-slate-900 my-4">{formatTime(currentTime)}</div>
                <CardDescription className="flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Office - Main Building</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <Badge variant={isCheckedIn ? "default" : "secondary"} className="px-4 py-2">
                    {isCheckedIn ? "Checked In" : "Checked Out"}
                  </Badge>
                  {lastAction && (
                    <span className="text-sm text-slate-500">
                      Last action: {lastAction} at {lastActionTime}
                    </span>
                  )}
                </div>

                <div className="flex space-x-4 justify-center">
                  <Button onClick={handleCheckIn} disabled={isCheckedIn || isLoading} size="lg" className="flex-1 max-w-xs">
                    <LogIn className="w-5 h-5 mr-2" />
                    {isLoading && !isCheckedIn ? "Checking In..." : "Check In"}
                  </Button>
                  <Button
                    onClick={handleCheckOut}
                    disabled={!isCheckedIn || isLoading}
                    variant="outline"
                    size="lg"
                    className="flex-1 max-w-xs bg-transparent"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    {isLoading && isCheckedIn ? "Checking Out..." : "Check Out"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Today's Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Hours</span>
                  <span className="font-semibold">{getTotalHoursToday()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Check-ins</span>
                  <span className="font-semibold">{todaysRecord ? 1 : 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Status</span>
                  <Badge variant={isCheckedIn ? "default" : "secondary"}>{isCheckedIn ? "Active" : "Offline"}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Today's Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaysRecord ? (
                    <>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div className="flex-1">
                          <div className="font-medium capitalize">Check In</div>
                          <div className="text-slate-500 text-xs">{new Date(todaysRecord.checkInTime).toLocaleString()}</div>
                        </div>
                      </div>
                      {todaysRecord.checkOutTime && (
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <div className="flex-1">
                            <div className="font-medium capitalize">Check Out</div>
                            <div className="text-slate-500 text-xs">{new Date(todaysRecord.checkOutTime).toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-500 text-sm text-center py-4">No activity yet today</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
