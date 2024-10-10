"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import Logo from "@/assets/images/HandyMan.png"

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Simple routing logic based on username
        switch (username.toLowerCase()) {
            case 'manager':
                router.push('/manager-dashboard')
                break
            case 'coordinator':
                router.push('/coordinator-dashboard')
                break
            case 'admin':
                router.push('/admin-dashboard')
                break
            default:
                setError('Invalid username or password')
        }
    }

    return (
        <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
            <Card className="w-[350px]">
                <div className="d-flex justify-content-center">
                    <Image
                        src={Logo}
                        alt="HandyMan Logo"
                        width={200}
                        height={150}
                        className="ml-auto mr-auto mt-[30px]"
                    />
                </div>
                <CardHeader className="space-y-1">
                    <CardDescription className="text-center">
                        Enter your credentials to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2 mt-[10px]">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <p className="text-sm text-red-500 mt-2">{error}</p>
                        )}
                        <Button className="w-full mt-4 bg-[#0A2647] hover:bg-[#0D3158] text-white" type="submit">
                            Log in
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center w-full text-gray-600">
                        Demo accounts: manager, coordinator, admin
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}