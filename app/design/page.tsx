'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export default function DesignPage() {
  const [count, setCount] = useState(0);

  return (
    <main className="container mx-auto space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Design System Playground</h1>
        <p className="text-muted-foreground">
          Explore the shadcn/ui components that power the Vesper experience.
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <p className="text-center text-4xl font-bold">{count}</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button onClick={() => setCount((value) => value + 1)}>Increment</Button>
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
                This is a dialog component. It can be used for confirmations, forms, or any modal content.
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
    </main>
  );
}
