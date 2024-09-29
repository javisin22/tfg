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
import { Home, MessageCircle, Calendar, Settings, PlusCircle, Image, X, ArrowLeft } from 'lucide-react'

function HomeScreen({ onCreatePost }) {
  const posts = [
    {
      id: 1,
      user: 'Jane Doe',
      avatar: '/placeholder.svg?height=40&width=40',
      image: '/placeholder.svg?height=300&width=400',
      content: 'Just finished an amazing HIIT workout! 💪 #FitnessGoals',
      likes: 24,
      comments: [
        { user: 'John', content: 'Great job! Keep it up! 🔥' },
        { user: 'Sarah', content: 'You're inspiring me to workout too!' }
      ]
    },
    {
      id: 2,
      user: 'Mike Smith',
      avatar: '/placeholder.svg?height=40&width=40',
      image: '/placeholder.svg?height=300&width=400',
      content: 'New personal best on my 5k run! 🏃‍♂️ #Running',
      likes: 18,
      comments: [
        { user: 'Emily', content: 'Wow, that's impressive!' },
        { user: 'David', content: 'What's your secret? Share some tips!' }
      ]
    }
  ]

  return (
    <ScrollArea className="h-[calc(100vh-120px)] relative">
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.avatar} alt={post.user} />
                  <AvatarFallback>{post.user[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p className="text-sm font-medium text-primary">{post.user}</p>
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
                  {post.comments.length} Comments
                </Button>
              </div>
            </CardFooter>
            <div className="px-6 py-4 bg-gray-50">
              <h4 className="text-sm font-medium text-primary mb-2">Comments</h4>
              {post.comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{comment.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-primary">{comment.user}</p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 flex items-center space-x-2">
                <Input placeholder="Add a comment..." className="flex-1" />
                <Button size="sm">Post</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Button
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg"
        onClick={onCreatePost}
      >
        <PlusCircle className="h-6 w-6" />
      </Button>
    </ScrollArea>
  )
}

function ChatScreen() {
  const chats = [
    { id: 1, name: 'Sarah Johnson', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'See you at the gym!', isGroup: false },
    { id: 2, name: 'Running Club', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Who's up for a group run this weekend?', isGroup: true },
    { id: 3, name: 'David Lee', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Thanks for the workout tips!', isGroup: false },
    { id: 4, name: 'Yoga Enthusiasts', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'New yoga session scheduled for tomorrow', isGroup: true },
  ]

  const [activeChat, setActiveChat] = useState(chats[0])

  const messages = [
    { id: 1, sender: 'Sarah Johnson', content: 'Hey! Are we still on for our workout session today?', timestamp: '10:30 AM' },
    { id: 2, sender: 'You', content: 'I'll meet you at the gym at 5 PM.', timestamp: '10:32 AM' },
    { id: 3, sender: 'Sarah Johnson', content: 'Perfect! Don't forget to bring your resistance bands.', timestamp: '10:33 AM' },
    { id: 4, sender: 'You', content: 'Got it! See you soon. 💪', timestamp: '10:35 AM' },
  ]

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <div className="w-1/3 border-r">
        <ScrollArea className="h-full">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 hover:bg-gray-100 cursor-pointer ${activeChat.id === chat.id ? 'bg-gray-100' : ''}`}
              onClick={() => setActiveChat(chat)}
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">{chat.name}</p>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
                {chat.isGroup && (
                  <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Group</div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-primary">{activeChat.name}</h2>
        </div>
        <ScrollArea className="flex-1 p-4">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.sender === 'You' ? 'text-right' : ''}`}>
              <div className={`inline-block p-2 rounded-lg ${message.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-gray-100'}`}>
                <p className="text-sm">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input placeholder="Type a message..." className="flex-1" />
            <Button size="icon">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">Account Settings</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex space-x-2">
                <Input id="username" placeholder="Current username" />
                <Button>Change</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex space-x-2">
                <Input id="email" type="email" placeholder="Current email" />
                <Button>Change</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Image className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button>Change</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">Notifications</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications about your activity</p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">Privacy</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="private-profile">Private Profile</Label>
                <p className="text-sm text-gray-500">Only approved followers can see your posts</p>
              </div>
              <Switch id="private-profile" />
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

function CreatePostScreen({ onClose }) {
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState('')

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    // Here you would typically send the post data to your backend
    console.log('Submitting post:', { image, description })
    onClose()
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-lg font-semibold text-primary">Create New Post</h2>
        <Button onClick={handleSubmit}>Post</Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
              {image ? (
                <div className="relative">
                  <img src={image} alt="Uploaded" className="max-h-64 rounded-lg" />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-dark"
                    >
                      <span>Upload a file</span>
                      <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageUpload} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's on your mind?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
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
              {activeTab === 'settings' && 'Settings'}
              {activeTab === 'create-post' && 'Create New Post'}
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeTab === 'home' && <HomeScreen onCreatePost={handleCreatePost} />}
          {activeTab === 'chats' && <ChatScreen />}
          {activeTab === 'events' && <div>Events content goes here</div>}
          {activeTab === 'settings' && <SettingsScreen />}
          {activeTab === 'create-post' && <CreatePostScreen onClose={handleCloseCreatePost} />}
        </main>
      </div>
    </div>
  )
}