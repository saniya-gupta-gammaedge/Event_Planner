import { useState } from 'react'

export default function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className="rounded-xl overflow-hidden shadow-sm border border-gold/30 bg-black">
        <video
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          playsInline
          className="w-full h-56 object-contain bg-black"
        />
        <p className="text-sm font-medium text-maroon bg-white p-2 text-center">{video.title}</p>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="rounded-xl overflow-hidden shadow-sm border border-gold/30 text-left group"
    >
      <div className="relative">
        <img
          src={video.poster}
          alt={video.title}
          className="w-full h-56 object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-2xl text-maroon shadow-md">
            ▶
          </span>
        </span>
      </div>
      <p className="text-sm font-medium text-maroon bg-white p-2 text-center">{video.title}</p>
    </button>
  )
}
