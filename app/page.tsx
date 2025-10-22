'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface CardData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export default function Home() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const drawCards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/py/draw');
      if (!response.ok) {
        throw new Error('Failed to draw cards');
      }
      const data = await response.json();
      setCards(data.cards);
    } catch (err) {
      setError('Failed to draw cards. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetReading = () => {
    setCards([]);
    setSelectedCard(null);
    setError(null);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Liquid Glass background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.15),transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container relative mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight">
            Vesper
          </h1>
          <p className="text-lg text-foreground/70">
            Modern card readings for a digital age
          </p>
        </div>

        {/* Landing State - No cards drawn yet */}
        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative w-48 h-64 flex items-center justify-center">
              {/* Deck Visual - Stacked cards with Liquid Glass effect */}
              <div className="absolute inset-0 glass rounded-2xl transform rotate-6 opacity-30 bg-gradient-to-br from-blue-400/40 to-purple-400/40"></div>
              <div className="absolute inset-0 glass rounded-2xl transform rotate-3 opacity-50 bg-gradient-to-br from-blue-500/40 to-purple-500/40"></div>
              <div className="absolute inset-0 glass-strong rounded-2xl bg-gradient-to-br from-blue-500/60 to-purple-600/60 flex items-center justify-center shadow-2xl">
                <div className="text-white text-6xl drop-shadow-lg">✨</div>
              </div>
            </div>

            <div className="text-center space-y-4 max-w-md">
              <h2 className="text-3xl font-semibold text-foreground tracking-tight">
                Begin Your Journey
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                Draw three cards to receive guidance and reflection for your current path.
              </p>
            </div>

            <Button
              size="lg"
              onClick={drawCards}
              disabled={isLoading}
              className="px-10 py-6 text-lg font-semibold shadow-xl"
            >
              {isLoading ? 'Drawing Cards...' : 'Draw Cards'}
            </Button>

            {error && (
              <div className="glass-subtle px-6 py-3 rounded-xl">
                <p className="text-destructive font-medium">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Reading State - Cards are displayed */}
        {cards.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-semibold text-foreground mb-2 tracking-tight">
                Your Reading
              </h2>
              <p className="text-foreground/70">
                Click any card to explore its meaning
              </p>
            </div>

            {/* Three Card Spread */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {cards.map((card, index) => (
                <Card
                  key={card.id}
                  className="cursor-pointer group h-full flex flex-col"
                  onClick={() => setSelectedCard(card)}
                >
                  <CardHeader className="flex-shrink-0">
                    <div className="aspect-[2/3] glass-strong bg-gradient-to-br from-blue-400/60 via-indigo-400/60 to-purple-400/60 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <span className="text-7xl z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {index === 0 ? '🌅' : index === 1 ? '🌟' : '🌙'}
                      </span>
                    </div>
                    <CardTitle className="text-center text-xl font-semibold tracking-tight">
                      {card.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex items-start">
                    <p className="text-sm text-foreground/70 text-center line-clamp-2 leading-relaxed w-full">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-8 opacity-30" />

            {/* New Reading Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={resetReading}
                className="px-10 font-medium"
              >
                New Reading
              </Button>
            </div>
          </div>
        )}

        {/* Card Detail Modal */}
        <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
          <DialogContent className="max-w-2xl">
            {selectedCard && (
              <>
                <DialogHeader>
                  <div className="aspect-[2/3] max-w-xs mx-auto glass-strong bg-gradient-to-br from-blue-400/60 via-indigo-400/60 to-purple-400/60 rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <span className="text-9xl z-10 drop-shadow-2xl">
                      {cards.indexOf(selectedCard) === 0
                        ? '🌅'
                        : cards.indexOf(selectedCard) === 1
                        ? '🌟'
                        : '🌙'}
                    </span>
                  </div>
                  <DialogTitle className="text-4xl text-center font-semibold tracking-tight">
                    {selectedCard.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <p className="text-foreground/80 leading-relaxed text-center text-lg">
                    {selectedCard.description}
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
