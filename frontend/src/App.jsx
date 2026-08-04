import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import { usePageMeta } from './hooks/usePageMeta'
import Home from './pages/Home'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Videos from './pages/Videos'
import Rent from './pages/Rent'
import About from './pages/About'

function App() {
  usePageMeta()

  return (
    <div className="min-h-screen flex flex-col text-neutral-800">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
