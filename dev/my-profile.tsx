import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Home, MessageCircle, Calendar, Settings, PlusCircle, Image, X, ArrowLeft, User, Edit, Trash2 } from 'lucide-react'

function HomeScreen({ onCreatePost }) {
  // ... (HomeScreen component code remains unchanged)
}

function ChatScreen() {
  // ... (ChatScreen component code remains unchanged)
}

function SettingsScreen() {
  // ... (SettingsScreen component code remains unchanged)
}

function CreatePostScreen({ onClose }) {
  // ... (CreatePostScreen component code remains unchanged)
}

function MyProfileScreen() {
  const [userPosts, setUserPosts] = useState([
    {
      id: 1,
      image: '/placeholder.svg?height=300&width=400',
      content: 'Just crushed my morning workout! 💪 #MorningMotivation',
      likes: 42,
      comments: 7,
    },
    {
      id: 2,
      image: '/placeholder.svg?height=300&width=400',
      content: 'New personal best in deadlifts today! 🏋️‍♂️ #StrengthTraining',
      likes: 38,
      comments: 5,
    },
    {
      id: 3,
      image: '/placeholder.svg?height=300&width=400',
      content: 'Beautiful day for a run by the beach 🏃‍♀️🌊 #CardioTime',
      likes: 56,
      comments: 9,
    },
  ])

  const [editingPost, setEditingPost] = useState(null)

  const handleEditPost = (post) => {
    setEditingPost(post)
  }

  const handleUpdatePost = (updatedPost) => {
    setUserPosts(userPosts.map(post => post.id === updatedPost.id ? updatedPost : post))
    setEditingPost(null)
  }

  const handleDeletePost = (postId) => {
    setUserPosts(userPosts.filter(post => post.id !== postId))
  }

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile Picture" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-primary">John Doe</h2>
              <p className="text-sm text-gray-500">Fitness enthusiast | Runner | Weightlifter</p>
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-xl font-semibold text-primary">{userPosts.length}</p>
                  <p className="text-sm text-gray-500">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-primary">1.2k</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-primary">567</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-xl font-semibold text-primary mb-4">My Posts</h3>

        {userPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="John Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-primary">John Doe</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditPost(post)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <img src={post.image} alt="Post" className="rounded-md mb-4" />
              <p className="text-sm text-gray-700">{post.content}</p>
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {post.likes} Likes
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {post.comments} Comments
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={editingPost !== null} onOpenChange={() => setEditingPost(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Make changes to your post here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="post-content">Content</Label>
                <Textarea
                  id="post-content"
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  rows={4}
                />
              </div>
              <img src={editingPost.image} alt="Post" className="rounded-md" />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleUpdatePost(editingPost)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  )
}

export default function FitnessApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [isCreatingPost, setIsCreatingPost] = useState(false)

  const handleCreatePost = () => {
    setIsCreatingPost(true)
    setActiveTab('create-post')
  }

  const handleCloseCreatePost = () => {
    setIsCreatingPost(false)
    setActiveTab('home')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary">FitConnect</h1>
        </div>
        <nav className="mt-8">
          <Button
            variant={activeTab === 'home' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('home')}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button
            variant={activeTab === 'chats' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('chats')}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Chats
          </Button>
          <Button
            variant={activeTab === 'events' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('events')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </Button>
          <Button
            variant={activeTab === 'my-profile' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('my-profile')}
          >
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-lg font-semibold text-primary">
              {activeTab === 'home' && 'Fitness Feed'}
              {activeTab === 'chats' && 'Chats'}
              {activeTab === 'events' && 'Events'}
              {activeTab === 'my-profile' && 'My Profile'}
              {activeTab === 'settings' && 'Settings'}
              {activeTab === 'create-post' && 'Create New Post'}
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeTab === 'home' && <HomeScreen onCreatePost={handleCreatePost} />}
          {activeTab === 'chats' && <ChatScreen />}
          {activeTab === 'events' && <div>Events content goes here</div>}
          {activeTab === 'my-profile' && <MyProfileScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
          {activeTab === 'create-post' && <CreatePostScreen onClose={handleCloseCreatePost} />}
        </main>
      </div>
    </div>
  )
}