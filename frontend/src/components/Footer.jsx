import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-paper">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-hand text-2xl text-forest">Collecting moments, not things.</p>
        <p className="text-xs text-ink/50">© 2026 Travel Memories — a personal travel diary</p>
      </div>
    </footer>
  )
}
