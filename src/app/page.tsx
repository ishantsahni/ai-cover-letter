"use client";               // if your layout/page is a client component
import dynamic from 'next/dynamic';

// Import ResumeForm only on the client
const ResumeForm = dynamic(() => import('@/components/ResumeForm'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <ResumeForm />
    </main>
  );
}
  