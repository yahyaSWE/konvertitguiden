import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { 
  User, 
  Mail, 
  Award, 
  BookOpen, 
  Flame,
  Calendar,
  Medal,
  Clock
} from "lucide-react";
import { formatDate } from "@/lib/utils";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AchievementBadge } from "@/components/achievements/achievement-badge";
import { mapRoleToLabel, mapRoleToColor } from "@/lib/utils";

export function UserProfile({ userId }: { userId?: string }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("achievements");
  
  // If no userId is provided, show the current user's profile
  const profileId = userId || user?.id?.toString();
  
  // Fetch user data if viewing another user's profile
  const { data: profileData } = useQuery({
    queryKey: [`/api/users/${profileId}`],
    enabled: !!userId && userId !== user?.id?.toString(),
  });
  
  // Use the current user's data if viewing own profile
  const profileUser = userId ? profileData : user;
  
  // Fetch user achievements
  const { data: achievements } = useQuery({
    queryKey: [`/api/achievements/${profileId ? `user/${profileId}` : 'me'}`],
    enabled: !!profileId,
  });
  
  // Fetch user enrollments/courses
  const { data: enrollments } = useQuery({
    queryKey: [`/api/enrollments/${profileId ? `user/${profileId}` : 'me'}`],
    enabled: !!profileId,
  });
  
  // Fetch user certificates
  const { data: certificates } = useQuery({
    queryKey: [`/api/certificates/${profileId ? `user/${profileId}` : 'me'}`],
    enabled: !!profileId,
  });
  
  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
        <p className="text-gray-500">The user profile you're looking for doesn't exist</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {getInitials(profileUser.fullName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">{profileUser.fullName}</h1>
              <p className="text-gray-500 mb-3">@{profileUser.username}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <Badge className={mapRoleToColor(profileUser.role)}>
                  {mapRoleToLabel(profileUser.role)}
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {profileUser.points || 0} Points
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  {profileUser.streak || 0} Day Streak
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {profileUser.email}
                </div>
                {profileUser.lastLogin && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Last seen {formatDate(profileUser.lastLogin)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Badges and accomplishments earned through learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              {achievements && achievements.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {achievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement.achievement}
                      unlocked={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Medal className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Achievements Yet</h3>
                  <p className="text-gray-500">
                    Complete courses and activities to earn achievements
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>
                Courses taken and progress made
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments && enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{enrollment.course.title}</h3>
                          <p className="text-sm text-gray-500">{enrollment.course.category}</p>
                        </div>
                        <Badge variant={enrollment.completed ? "success" : "outline"}>
                          {enrollment.completed ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{enrollment.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-value" 
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {enrollment.course.level}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Enrolled on {formatDate(enrollment.enrolledAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Courses Yet</h3>
                  <p className="text-gray-500">
                    Enroll in courses to track progress and earn points
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
              <CardDescription>
                Certificates earned by completing courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {certificates && certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((certificate) => (
                    <div key={certificate.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-primary/5 p-6 flex items-center justify-center">
                        <Award className="h-16 w-16 text-primary" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{certificate.course.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Issued on {formatDate(certificate.issuedAt)}
                        </p>
                        <a 
                          href={certificate.certificateUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View Certificate
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Certificates Yet</h3>
                  <p className="text-gray-500">
                    Complete courses to earn certificates
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
