"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { ToastAction } from "@/components/ui/toast"

export default function ComponentsDemoPage() {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <div className="container mx-auto py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">UI Components Demo</h1>
        <p className="text-muted-foreground">
          Showcase of all shadcn/ui components configured for Regalaya
        </p>
      </div>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="secondary">Secondary</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <span className="sr-only">Icon</span>★
          </Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Inputs</h2>
        <div className="grid gap-4 md:grid-cols-2 max-w-xl">
          <div className="space-y-2">
            <Label htmlFor="default">Default Input</Label>
            <Input id="default" placeholder="Enter text..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="with-value">With Value</Label>
            <Input id="with-value" defaultValue="Regalaya Gift Shop" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="error">Error State</Label>
            <Input id="error" error placeholder="Invalid input..." />
            <p className="text-sm text-destructive">This field is required</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled">Disabled</Label>
            <Input id="disabled" disabled placeholder="Disabled input..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter password..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@example.com" />
          </div>
        </div>
      </section>

      {/* Card */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Product Card</CardTitle>
              <CardDescription>
                Elegante Caixa de Bombons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                Product Image
              </div>
              <p className="mt-4 text-2xl font-bold">R$ 89,90</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add to Cart</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ 179,80</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>R$ 15,00</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>R$ 194,80</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Info Card</CardTitle>
              <CardDescription>With footer content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here. You can add any content.</p>
            </CardContent>
            <CardFooter>
              <span className="text-sm text-muted-foreground">Footer text</span>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-gold-500">Gold</Badge>
          <Badge className="bg-gold-600">Gold Dark</Badge>
          <Badge className="bg-emerald-500">Success</Badge>
          <Badge className="bg-amber-500">Warning</Badge>
        </div>
      </section>

      {/* Checkbox & Radio Group */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Checkbox & Radio Group</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-medium">Checkbox</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="newsletter" defaultChecked />
                <label
                  htmlFor="newsletter"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Subscribe to newsletter
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="disabled" disabled />
                <label
                  htmlFor="disabled"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Disabled option
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Radio Group</h3>
            <RadioGroup defaultValue="card">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix">PIX</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boleto" id="boleto" />
                <Label htmlFor="boleto">Boleto</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* Select */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Select</h2>
        <div className="grid gap-4 md:grid-cols-3 max-w-xl">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home">Home & Decor</SelectItem>
                <SelectItem value="beauty">Beauty</SelectItem>
                <SelectItem value="toys">Toys</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>With Default Value</Label>
            <Select defaultValue="fashion">
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home">Home & Decor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opt1">Option 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Dialog */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dialog</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                Are you sure you want to proceed with this purchase?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-bold text-foreground">R$ 289,90</span>
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowDialog(false)}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Skeleton */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Skeleton Loading</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      </section>

      {/* Avatar */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Avatar</h2>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
            R
          </div>
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
            R
          </div>
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-medium">
            R
          </div>
        </div>
      </section>
    </div>
  )
}
