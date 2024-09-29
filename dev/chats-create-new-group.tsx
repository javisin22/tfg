'use client'

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

function ChatScreen() {
  const [chats, setChats] = useState([
    { id: 1, name: 'Sarah Johnson', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'See you at the gym!', isGroup: false },
    { id: 2, name: 'Running Club', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Who's up for a group run this weekend?', isGroup: true },
    { id: 3, name: 'David Lee', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Thanks for the workout tips!', isGroup: false },
    { id: 4, name: 'Yoga Enthusiasts', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'New yoga session scheduled for tomorrow', isGroup: true },
  ])

  const [activeChat, setActiveChat] = useState(chats[0])
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])

  const followers = [
    { id: 1, name: 'Emma Wilson', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 2, name: 'Liam Thompson', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 3, name: 'Olivia Martinez', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 4, name: 'Noah Garcia', avatar: '/placeholder.svg?height=40&width=40' },
  ]

  const messages = [
    { id: 1, sender: 'Sarah Johnson', content: 'Hey! Are we still on for our workout session today?', timestamp: '10:30 AM' },
    { id: 2, sender: 'You', content: 'I'll meet you at the gym at 5 PM.', timestamp: '10:32 AM' },
    { id: 3, sender: 'Sarah Johnson', content: 'Perfect! Don't forget to bring your resistance bands.', timestamp: '10:33 AM' },
    { id: 4, sender: 'You', content: 'Got it! See you soon. 💪', timestamp: '10:35 AM' },
  ]

  const handleCreateGroup = () => {
    if (newGroupName && selectedUsers.length > 0) {
      const newGroup = {
        id: chats.length + 1,
        name: newGroupName,
        avatar: '/placeholder.svg?height=40&width=40',
        lastMessage: 'New group created',
        isGroup: true,
      }
      setChats([...chats, newGroup])
      setNewGroupName('')
      setSelectedUsers([])
      setIsCreateGroupOpen(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <div className="w-1/3 border-r">
        <div className="p-4">
          <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Create New Group</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <Label>Select Users</Label>
                  <ScrollArea className="h-[200px] border rounded-md p-2">
                    {followers.map((follower) => (
                      <div key={follower.id} className="flex items-center space-x-2 py-2">
                        <Checkbox
                          id={`user-${follower.id}`}
                          checked={selectedUsers.includes(follower.id)}
                          onCheckedChange={(checked) => {
                            setSelectedUsers(
                              checked
                                ? [...selectedUsers, follower.id]
                                : selectedUsers.filter((id) => id !== follower.id)
                            )
                          }}
                        />
                        <Label htmlFor={`user-${follower.id}`} className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={follower.avatar} alt={follower.name} />
                            <AvatarFallback>{follower.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{follower.name}</span>
                        </Label>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                <Button onClick={handleCreateGroup}>Create Group</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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

export default function FitnessApp() {
  const [activeTab, setActiveTab] = useState('chats')

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
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeTab === 'chats' && <ChatScreen />}
          {activeTab === 'home' && <div>Home content goes here</div>}
          {activeTab === 'events' && <div>Events content goes here</div>}
          {activeTab === 'settings' && <div>Settings content goes here</div>}
        </main>
      </div>
    </div>
  )
}