import videos from '../data/videos.json'
import VideoCard from '../components/VideoCard'
import { whatsappLink } from '../data/company'

export default function Videos() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-maroon mb-2">Our Videos</h1>
      <p className="text-neutral-600 mb-10">Watch our tent, decoration and lighting setups in action.</p>

      {videos.length === 0 ? (
        <div className="rounded-xl bg-white border border-gold/40 p-8 text-center">
          <p className="text-neutral-700 mb-4">Videos coming soon.</p>
          <a
            href={whatsappLink('Hello, can you share some videos of your past events?')}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-lg bg-green-500 text-white px-6 py-3 font-medium hover:bg-green-600 transition-colors"
          >
            Ask on WhatsApp
          </a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}
