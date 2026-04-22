import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Search, Edit, Trash2, Lock, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ["/api/notes"],
  });

  const { data: searchResults } = useQuery({
    queryKey: ["/api/notes/search", searchQuery],
    enabled: !!searchQuery,
  });

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: any) => {
      const response = await apiRequest("POST", "/api/notes", noteData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsDialogOpen(false);
      setEditingNote(null);
      toast({
        title: "Success",
        description: "Note created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, ...noteData }: any) => {
      const response = await apiRequest("PUT", `/api/notes/${id}`, noteData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsDialogOpen(false);
      setEditingNote(null);
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      await apiRequest("DELETE", `/api/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    },
  });

  const filteredNotes = searchQuery 
    ? searchResults 
    : Array.isArray(notes) ? notes.filter((note: any) => 
        selectedCategory === "all" || note.category === selectedCategory
      ) : [];

  const categories = [
    { value: "all", label: "All Notes" },
    { value: "patient-care", label: "Patient Care" },
    { value: "handoff", label: "Shift Handoff" },
    { value: "education", label: "Education" },
    { value: "personal", label: "Personal" },
    { value: "critical", label: "Critical" },
    { value: "procedures", label: "Procedures" },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'critical': return 'destructive';
      case 'patient-care': return 'default';
      case 'handoff': return 'secondary';
      case 'education': return 'outline';
      default: return 'outline';
    }
  };

  const handleNoteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const tags = (formData.get('tags') as string)
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const noteData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      tags,
    };

    if (editingNote) {
      updateNoteMutation.mutate({ id: editingNote.id, ...noteData });
    } else {
      createNoteMutation.mutate(noteData);
    }
  };

  const openEditDialog = (note: any) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingNote(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      
      <div className="lg:ml-72 min-h-screen">
        <Header 
          title="Secure Notes"
          subtitle="HIPAA-compliant note-taking with encryption and advanced organization"
        />
        
        <main className="p-4 lg:p-6 space-y-6">
          {/* Controls */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      placeholder="Search notes by title, content, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-3 h-4 w-4 text-text-secondary" />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreateDialog} className="bg-primary text-white hover:bg-primary/90">
                      <Plus size={16} className="mr-2" />
                      New Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingNote ? 'Edit Note' : 'Create New Note'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleNoteSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          defaultValue={editingNote?.title || ''}
                          placeholder="Note title..."
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" defaultValue={editingNote?.category || 'personal'}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.slice(1).map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          name="tags"
                          defaultValue={editingNote?.tags?.join(', ') || ''}
                          placeholder="e.g., urgent, follow-up, medication"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          name="content"
                          defaultValue={editingNote?.content || ''}
                          placeholder="Write your note here..."
                          rows={10}
                          required
                        />
                      </div>
                      
                      <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Lock className="text-blue-600 mr-2" size={16} />
                        <span className="text-sm text-blue-800">
                          This note will be encrypted and stored securely in compliance with HIPAA regulations.
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button type="submit" className="flex-1 bg-primary text-white hover:bg-primary/90">
                          {editingNote ? 'Update' : 'Create'} Note
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
            </CardContent>
          </Card>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : (filteredNotes as any)?.length > 0 ? (
              (filteredNotes as any).map((note: any) => (
                <Card key={note.id} className="hover-lift cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={getCategoryColor(note.category)}>
                            {categories.find(c => c.value === note.category)?.label || note.category}
                          </Badge>
                          {note.isEncrypted && (
                            <Badge variant="outline" className="text-xs">
                              <Lock size={10} className="mr-1" />
                              Encrypted
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(note);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNoteMutation.mutate(note.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-text-secondary line-clamp-3">
                        {note.content}
                      </p>
                      
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Tag size={8} className="mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{note.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs text-text-secondary flex items-center justify-between">
                        <span>Created: {format(new Date(note.createdAt), 'MMM d, yyyy')}</span>
                        {note.updatedAt !== note.createdAt && (
                          <span>Updated: {format(new Date(note.updatedAt), 'MMM d')}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  {searchQuery || selectedCategory !== "all" ? "No notes found" : "No notes yet"}
                </h3>
                <p className="text-text-secondary mb-4">
                  {searchQuery || selectedCategory !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Create your first secure note to get started"
                  }
                </p>
                {!searchQuery && selectedCategory === "all" && (
                  <Button onClick={openCreateDialog} className="bg-primary text-white hover:bg-primary/90">
                    <Plus size={16} className="mr-2" />
                    Create Your First Note
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
