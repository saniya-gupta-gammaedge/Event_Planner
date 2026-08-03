import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import CallButton from './components/CallButton'
import Home from './pages/Home'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Videos from './pages/Videos'
import Rent from './pages/Rent'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col text-neutral-800">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      {isHome && <Footer />}
      <CallButton />
      <WhatsAppButton />
    </div>
  )
}

export default App
