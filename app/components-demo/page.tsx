"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function ComponentsDemo() {
  const [count, setCount] = useState(0)

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">shadcn/ui Components Demo</h1>
        <p className="text-muted-foreground">
          Testing all installed shadcn/ui components
        </p>
      </div>

      <Separator />

      <section>
        <h2 className="text-2xl font-semibold mb-4">Button Component</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-semibold mb-4">Card Component</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area where you can put any information.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Click the button to increment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-center">{count}</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button onClick={() => setCount(count + 1)}>
                Increment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-semibold mb-4">Dialog Component</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This is a dialog component. It can be used for confirmations,
                forms, or any modal content.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-semibold mb-4">Separator Component</h2>
        <div className="space-y-4">
          <div>
            <p>Horizontal Separator (default)</p>
            <Separator className="my-4" />
            <p>Content below separator</p>
          </div>

          <div className="flex h-20 items-center">
            <p>Vertical</p>
            <Separator orientation="vertical" className="mx-4" />
            <p>Separator</p>
          </div>
        </div>
      </section>
    </div>
  )
}
