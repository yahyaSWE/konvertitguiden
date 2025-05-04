import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  User as UserIcon, 
  UserCheck, 
  UserCog, 
  Shield, 
  Search, 
  Loader2, 
  Edit, 
  UserPlus,
  Save,
  X
} from "lucide-react";
import { UserRole, User } from "@shared/schema";
import { mapRoleToLabel, mapRoleToColor } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<string>("");

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (data: { id: number; role: string }) => {
      return apiRequest("PUT", `/api/admin/users/${data.id}`, { role: data.role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setDialogOpen(false);
      setEditingUser(null);
      toast({
        title: "User role updated",
        description: "The user role has been successfully updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  // Filter users
  const filteredUsers = users?.filter((user: User) => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter && roleFilter !== "all" ? user.role === roleFilter : true;
    
    return matchesSearch && matchesRole;
  });

  // Role icon mapping
  const getRoleIcon = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Shield className="h-5 w-5" />;
      case UserRole.TEACHER:
        return <UserCog className="h-5 w-5" />;
      case UserRole.STUDENT:
      default:
        return <UserCheck className="h-5 w-5" />;
    }
  };

  // Open edit dialog
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditRole(user.role);
    setDialogOpen(true);
  };

  // Handle role update
  const handleRoleUpdate = () => {
    if (!editingUser) return;
    
    updateUserMutation.mutate({
      id: editingUser.id,
      role: editRole,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts and roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={UserRole.STUDENT}>Students</SelectItem>
                  <SelectItem value={UserRole.TEACHER}>Teachers</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Administrators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Streak</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={mapRoleToColor(user.role)}>
                        <span className="flex items-center gap-1">
                          {getRoleIcon(user.role)}
                          {mapRoleToLabel(user.role)}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>{user.points || 0}</TableCell>
                    <TableCell>{user.streak || 0} days</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-gray-500">
                {searchTerm || roleFilter 
                  ? "Try adjusting your search or filters"
                  : "Add users to get started"}
              </p>
              {(searchTerm || roleFilter) && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {editingUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Current Role</p>
              <Badge className={mapRoleToColor(editingUser?.role || "")}>
                {mapRoleToLabel(editingUser?.role || "")}
              </Badge>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">New Role</p>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
                  <SelectItem value={UserRole.TEACHER}>Teacher</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRoleUpdate}
              disabled={updateUserMutation.isPending || editRole === editingUser?.role}
            >
              {updateUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
