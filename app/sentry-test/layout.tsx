import React from 'react';

export default function SentryTestLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 