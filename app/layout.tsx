import "./globals.css";

export const metadata = {
  title: "Vesper - Next.js with shadcn/ui",
  description: "Next.js application with shadcn/ui components",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
