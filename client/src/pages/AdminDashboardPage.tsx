import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, Trash2, Edit, CheckCircle, Clock, Users, Power, PowerOff } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface GiveawayFormData {
  title: string;
  description: string;
  prize: string;
  imageUrl: string;
  maxEntries: number;
  endDate: string;
}

interface Giveaway {
  id: string;
  title: string;
  description: string;
  prize: string;
  imageUrl: string | null;
  maxEntries: number;
  endDate: string;
  createdAt: string;
  isActive: boolean;
}

interface GiveawayEntry {
  id: string;
  giveawayId: string;
  giveawayTitle: string;
  userId: string;
  username: string;
  email: string;
  enteredAt: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newGiveaway, setNewGiveaway] = useState<GiveawayFormData>({
    title: "",
    description: "",
    prize: "",
    imageUrl: "",
    maxEntries: 100,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  useEffect(() => {
    // Redirect non-admin users
    if (user && !user.isAdmin) {
      navigate("/");
    } else if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Fetch giveaways
  const { 
    data: giveaways = [],
    isLoading: isLoadingGiveaways,
  } = useQuery({
    queryKey: ['/api/giveaways/admin'],
    enabled: !!user?.isAdmin,
  });

  // Fetch giveaway entries
  const { 
    data: entries = [],
    isLoading: isLoadingEntries,
  } = useQuery({
    queryKey: ['/api/giveaway-entries/admin'],
    enabled: !!user?.isAdmin,
  });

  // Create giveaway mutation
  const createGiveawayMutation = useMutation({
    mutationFn: (data: GiveawayFormData) => 
      apiRequest('/api/giveaways', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/giveaways/admin'] });
      setNewGiveaway({
        title: "",
        description: "",
        prize: "",
        imageUrl: "",
        maxEntries: 100,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      toast({
        title: "Success",
        description: "Giveaway created successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create giveaway: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete giveaway mutation
  const deleteGiveawayMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest(`/api/giveaways/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/giveaways/admin'] });
      toast({
        title: "Success",
        description: "Giveaway deleted successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete giveaway: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Toggle giveaway active status mutation
  const toggleGiveawayStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string, isActive: boolean }) => 
      apiRequest(`/api/giveaways/${id}`, { 
        method: 'PUT',
        body: JSON.stringify({ isActive })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/giveaways/admin'] });
      toast({
        title: "Success",
        description: "Giveaway status updated successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update giveaway status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  if (!user?.isAdmin) {
    return null;
  }

  const handleCreateGiveaway = () => {
    // Use the selected date if available
    const formData = {
      ...newGiveaway,
      endDate: selectedDate ? selectedDate.toISOString() : newGiveaway.endDate,
    };
    createGiveawayMutation.mutate(formData);
  };

  const handleDeleteGiveaway = (id: string) => {
    if (confirm("Are you sure you want to delete this giveaway?")) {
      deleteGiveawayMutation.mutate(id);
    }
  };
  
  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleGiveawayStatusMutation.mutate({ 
      id, 
      isActive: !currentStatus 
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>
      
      <Tabs defaultValue="giveaways" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="giveaways">Giveaways</TabsTrigger>
          <TabsTrigger value="entries">Giveaway Entries</TabsTrigger>
          <TabsTrigger value="create">Create Giveaway</TabsTrigger>
        </TabsList>
        
        {/* Giveaways Tab */}
        <TabsContent value="giveaways">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingGiveaways ? (
              <p>Loading giveaways...</p>
            ) : giveaways.length === 0 ? (
              <p>No giveaways found. Create one to get started!</p>
            ) : (
              giveaways.map((giveaway: Giveaway) => (
                <Card key={giveaway.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{giveaway.title}</CardTitle>
                      <Badge variant={giveaway.isActive ? "default" : "outline"}>{giveaway.isActive ? "Active" : "Inactive"}</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 
                      Ends: {new Date(giveaway.endDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2 line-clamp-2">{giveaway.description}</p>
                    <p className="text-sm font-medium">Prize: {giveaway.prize}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">Max Entries: {giveaway.maxEntries}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-0">
                    <Button 
                      variant={giveaway.isActive ? "outline" : "default"}
                      size="icon"
                      onClick={() => handleToggleStatus(giveaway.id, giveaway.isActive)}
                      title={giveaway.isActive ? "Deactivate" : "Activate"}
                    >
                      {giveaway.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteGiveaway(giveaway.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Entries Tab */}
        <TabsContent value="entries">
          <Card>
            <CardHeader>
              <CardTitle>Giveaway Entries</CardTitle>
              <CardDescription>
                View all entries across all giveaways
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingEntries ? (
                <p>Loading entries...</p>
              ) : entries.length === 0 ? (
                <p>No entries found yet.</p>
              ) : (
                <Table>
                  <TableCaption>List of all giveaway entries</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Giveaway</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date Entered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry: GiveawayEntry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.giveawayTitle}</TableCell>
                        <TableCell>{entry.username}</TableCell>
                        <TableCell>{entry.email}</TableCell>
                        <TableCell>{new Date(entry.enteredAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Create Giveaway Tab */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Giveaway</CardTitle>
              <CardDescription>
                Fill out the form below to create a new giveaway
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  placeholder="Enter giveaway title"
                  value={newGiveaway.title}
                  onChange={(e) => setNewGiveaway({...newGiveaway, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  placeholder="Enter giveaway description"
                  value={newGiveaway.description}
                  onChange={(e) => setNewGiveaway({...newGiveaway, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="prize" className="text-sm font-medium">Prize</label>
                <Input
                  id="prize"
                  placeholder="Enter prize details"
                  value={newGiveaway.prize}
                  onChange={(e) => setNewGiveaway({...newGiveaway, prize: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">Image URL (optional)</label>
                <Input
                  id="imageUrl"
                  placeholder="Enter image URL"
                  value={newGiveaway.imageUrl}
                  onChange={(e) => setNewGiveaway({...newGiveaway, imageUrl: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxEntries" className="text-sm font-medium">Maximum Entries</label>
                <Input
                  id="maxEntries"
                  type="number"
                  placeholder="Enter maximum entries"
                  min={1}
                  value={newGiveaway.maxEntries}
                  onChange={(e) => setNewGiveaway({...newGiveaway, maxEntries: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                <div className="flex flex-col space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCreateGiveaway} 
                disabled={createGiveawayMutation.isPending}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                {createGiveawayMutation.isPending ? "Creating..." : "Create Giveaway"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}