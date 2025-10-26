'use client';

import Link from 'next/link';
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex justify-end">
          <Button asChild variant="outline">
            <Link href="/design">Design system</Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Vesper
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Modern card readings for a digital age
          </p>
        </div>

        {/* Landing State - No cards drawn yet */}
        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative w-48 h-64 flex items-center justify-center">
              {/* Deck Visual - Stacked cards effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg transform rotate-6 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg transform rotate-3 opacity-40"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-2xl flex items-center justify-center">
                <div className="text-white text-6xl">✨</div>
              </div>
            </div>

            <div className="text-center space-y-4 max-w-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Begin Your Journey
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Draw three cards to receive guidance and reflection for your current path.
              </p>
            </div>

            <Button
              size="lg"
              onClick={drawCards}
              disabled={isLoading}
              className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? 'Drawing Cards...' : 'Draw Cards'}
            </Button>

            {error && (
              <p className="text-red-500 dark:text-red-400">{error}</p>
            )}
          </div>
        )}

        {/* Reading State - Cards are displayed */}
        {cards.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Your Reading
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Click any card to explore its meaning
              </p>
            </div>

            {/* Three Card Spread */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {cards.map((card, index) => (
                <Card
                  key={card.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur"
                  onClick={() => setSelectedCard(card)}
                >
                  <CardHeader>
                    <div className="aspect-[2/3] bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <span className="text-6xl z-10">
                        {index === 0 ? '🌅' : index === 1 ? '🌟' : '🌙'}
                      </span>
                    </div>
                    <CardTitle className="text-center text-xl">
                      {card.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-2">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-8" />

            {/* New Reading Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={resetReading}
                className="px-8"
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
                  <div className="aspect-[2/3] max-w-xs mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <span className="text-8xl z-10">
                      {cards.indexOf(selectedCard) === 0
                        ? '🌅'
                        : cards.indexOf(selectedCard) === 1
                        ? '🌟'
                        : '🌙'}
                    </span>
                  </div>
                  <DialogTitle className="text-3xl text-center">
                    {selectedCard.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center">
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
