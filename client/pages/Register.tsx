import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Eye, EyeOff, Loader2, Shield, GraduationCap, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { register as apiRegister } from "../../shared/api";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("student");
  // Student fields
  const [course, setCourse] = useState("");
  const courseOptions = [
    "B.Sc Aeronautical Engineering",
    "B.Sc Computer science engineering",
    "B.Sc Mechanical Engineering",
    "B.Sc Mechatronics"
  ];
  // Remove semester, add year
  const [year, setYear] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  // Faculty field
  const [department, setDepartment] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    if (tab === "student" && !email.endsWith("@learner.manipal.edu")) {
      setError("Please use your student @learner.manipal.edu email address");
      setIsLoading(false);
      return;
    }
    if (tab === "faculty" && !email.endsWith("@manipal.edu")) {
      setError("Please use your faculty @manipal.edu email address");
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await apiRegister(name, email, password, tab);
      if (result.success) {
        toast({
          title: "Registration successful!",
          description: "You can now sign in with your credentials",
        });
        navigate("/login");
      } else {
        setError(result.error || "Registration failed");
        toast({
          title: "Registration failed",
          description: result.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      toast({
        title: "Registration failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 px-2 py-6 md:px-6 lg:px-8">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
  <Card className="shadow-lg border-0 md:border md:rounded-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center md:text-3xl lg:text-4xl">Register</CardTitle>
            <CardDescription className="text-center text-sm md:text-base lg:text-lg">
              Create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-2 md:px-6 lg:px-8">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Tabs defaultValue="student" value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 gap-2 md:gap-4">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="faculty" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Faculty
                </TabsTrigger>
              </TabsList>
              <TabsContent value="student" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-sm md:text-base"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Student Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.name@learner.manipal.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 text-sm md:text-base"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 text-sm md:text-base"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <select
                      id="course"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      disabled={isLoading}
                      className="w-full border rounded-md px-3 py-2 text-sm md:text-base text-foreground bg-background font-normal placeholder:text-muted-foreground focus:outline-none focus:ring focus:border-primary"
                      required
                    >
                      <option value="" disabled className="text-muted-foreground">Select your course</option>
                      {courseOptions.sort().map((c) => (
                        <option key={c} value={c} className="text-foreground font-normal">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <select
                      id="year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      disabled={isLoading}
                      className="w-full border rounded-md px-3 py-2 text-sm md:text-base text-foreground bg-background font-normal placeholder:text-muted-foreground focus:outline-none focus:ring focus:border-primary"
                      required
                    >
                      <option value="" disabled className="text-muted-foreground">Select your year</option>
                      <option value="1" className="text-foreground font-normal">1</option>
                      <option value="2" className="text-foreground font-normal">2</option>
                      <option value="3" className="text-foreground font-normal">3</option>
                      <option value="4" className="text-foreground font-normal">4</option>
                    </select>
                  </div>
                  {/* Academic year field removed as requested */}
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      type="text"
                      placeholder="e.g. 210123456"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="text-sm md:text-base"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 md:py-3 text-base md:text-lg"
                    size="lg"
                  >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <GraduationCap className="h-4 w-4 mr-2" />
                      )}
                    Register as Student
                  </Button>
                </form>
                <div className="text-xs md:text-sm text-muted-foreground text-center">
                  Use your official student @learner.manipal.edu email
                </div>
              </TabsContent>
              <TabsContent value="faculty" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Faculty Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.name@manipal.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 text-sm md:text-base"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 text-sm md:text-base"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      type="text"
                      placeholder="e.g. Computer Science"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="text-sm md:text-base"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 md:py-3 text-base md:text-lg"
                    size="lg"
                  >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Shield className="h-4 w-4 mr-2" />
                      )}
                    Register as Faculty
                  </Button>
                </form>
                <div className="text-xs md:text-sm text-muted-foreground text-center">
                  Use your official faculty @manipal.edu email
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
