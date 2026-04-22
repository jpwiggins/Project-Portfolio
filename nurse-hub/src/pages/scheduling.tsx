import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";

export default function Scheduling() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const { data: shifts, isLoading } = useQuery({
    queryKey: ["/api/shifts", format(monthStart, 'yyyy-MM-dd'), format(monthEnd, 'yyyy-MM-dd')],
  });

  const createShiftMutation = useMutation({
    mutationFn: async (shiftData: any) => {
      const response = await apiRequest("POST", "/api/shifts", shiftData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shifts"] });
      setIsDialogOpen(false);
      setEditingShift(null);
      toast({
        title: "Success",
        description: "Shift created successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create shift",
        variant: "destructive",
      });
    },
  });

  const updateShiftMutation = useMutation({
    mutationFn: async ({ id, ...shiftData }: any) => {
      const response = await apiRequest("PUT", `/api/shifts/${id}`, shiftData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shifts"] });
      setIsDialogOpen(false);
      setEditingShift(null);
      toast({
        title: "Success",
        description: "Shift updated successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update shift",
        variant: "destructive",
      });
    },
  });

  const deleteShiftMutation = useMutation({
    mutationFn: async (shiftId: string) => {
      await apiRequest("DELETE", `/api/shifts/${shiftId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shifts"] });
      toast({
        title: "Success",
        description: "Shift deleted successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete shift",
        variant: "destructive",
      });
    },
  });

  const getShiftsForDate = (date: Date) => {
    return Array.isArray(shifts) ? shifts.filter((shift: any) => 
      isSameDay(new Date(shift.startTime), date)
    ) : [];
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'day': return 'bg-blue-500';
      case 'night': return 'bg-purple-500';
      case 'float': return 'bg-orange-500';
      case 'training': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleShiftSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const shiftData = {
      title: formData.get('title') as string,
      startTime: new Date(`${formData.get('startDate')}T${formData.get('startTime')}`).toISOString(),
      endTime: new Date(`${formData.get('endDate')}T${formData.get('endTime')}`).toISOString(),
      location: formData.get('location') as string,
      shiftType: formData.get('shiftType') as string,
      notes: formData.get('notes') as string,
    };

    if (editingShift) {
      updateShiftMutation.mutate({ id: editingShift.id, ...shiftData });
    } else {
      createShiftMutation.mutate(shiftData);
    }
  };

  const openEditDialog = (shift: any) => {
    setEditingShift(shift);
    setIsDialogOpen(true);
  };

  const openCreateDialog = (date?: Date) => {
    setEditingShift(null);
    setSelectedDate(date || null);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      
      <div className="lg:ml-72 min-h-screen">
        <Header 
          title="Shift Scheduling"
          subtitle="Manage your work schedule and coordinate with your team"
        />
        
        <main className="p-4 lg:p-6 space-y-6">
          {/* Calendar Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar size={20} />
                  <span>{format(currentDate, 'MMMM yyyy')}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    Next
                  </Button>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary text-white hover:bg-primary/90">
                        <Plus size={16} className="mr-2" />
                        Add Shift
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          {editingShift ? 'Edit Shift' : 'Create New Shift'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleShiftSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="title">Shift Title</Label>
                          <Input
                            id="title"
                            name="title"
                            defaultValue={editingShift?.title || ''}
                            placeholder="e.g., ICU Day Shift"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              id="startDate"
                              name="startDate"
                              type="date"
                              defaultValue={
                                editingShift
                                  ? format(new Date(editingShift.startTime), 'yyyy-MM-dd')
                                  : selectedDate
                                  ? format(selectedDate, 'yyyy-MM-dd')
                                  : ''
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                              id="startTime"
                              name="startTime"
                              type="time"
                              defaultValue={
                                editingShift
                                  ? format(new Date(editingShift.startTime), 'HH:mm')
                                  : '07:00'
                              }
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              id="endDate"
                              name="endDate"
                              type="date"
                              defaultValue={
                                editingShift
                                  ? format(new Date(editingShift.endTime), 'yyyy-MM-dd')
                                  : selectedDate
                                  ? format(selectedDate, 'yyyy-MM-dd')
                                  : ''
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="endTime">End Time</Label>
                            <Input
                              id="endTime"
                              name="endTime"
                              type="time"
                              defaultValue={
                                editingShift
                                  ? format(new Date(editingShift.endTime), 'HH:mm')
                                  : '19:00'
                              }
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            defaultValue={editingShift?.location || ''}
                            placeholder="e.g., ICU Unit, Emergency Department"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="shiftType">Shift Type</Label>
                          <Select name="shiftType" defaultValue={editingShift?.shiftType || 'day'}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="day">Day Shift</SelectItem>
                              <SelectItem value="night">Night Shift</SelectItem>
                              <SelectItem value="float">Float</SelectItem>
                              <SelectItem value="training">Training</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            name="notes"
                            defaultValue={editingShift?.notes || ''}
                            placeholder="Additional notes or instructions..."
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button type="submit" className="flex-1 bg-primary text-white hover:bg-primary/90">
                            {editingShift ? 'Update' : 'Create'} Shift
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {/* Week headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-3 text-center font-medium text-text-secondary">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {calendarDays.map((day) => {
                    const dayShifts = getShiftsForDate(day);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className={`min-h-24 p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                          isToday ? 'bg-primary/5 border-primary/30' : ''
                        }`}
                        onClick={() => openCreateDialog(day)}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-primary' : 'text-text-primary'
                        }`}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayShifts.map((shift: any) => (
                            <div
                              key={shift.id}
                              className={`text-xs p-1 rounded text-white cursor-pointer ${getShiftTypeColor(shift.shiftType)}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog(shift);
                              }}
                            >
                              <div className="font-medium truncate">{shift.title}</div>
                              <div className="opacity-90">
                                {format(new Date(shift.startTime), 'HH:mm')} - 
                                {format(new Date(shift.endTime), 'HH:mm')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Shifts */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(shifts as any)?.filter((shift: any) => new Date(shift.startTime) > new Date())
                  .slice(0, 5)
                  .map((shift: any) => (
                    <div key={shift.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${getShiftTypeColor(shift.shiftType)}`} />
                        <div>
                          <h4 className="font-medium text-text-primary">{shift.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-text-secondary">
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{format(new Date(shift.startTime), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>
                                {format(new Date(shift.startTime), 'HH:mm')} - 
                                {format(new Date(shift.endTime), 'HH:mm')}
                              </span>
                            </div>
                            {shift.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin size={14} />
                                <span>{shift.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{shift.shiftType}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(shift)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteShiftMutation.mutate(shift.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                {(!shifts || (shifts as any).filter((shift: any) => new Date(shift.startTime) > new Date()).length === 0) && (
                  <p className="text-text-secondary text-center py-4">No upcoming shifts scheduled</p>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
