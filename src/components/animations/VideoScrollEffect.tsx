import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface VideoScrollEffectProps {
  className?: string
  frameCount?: number
  videoPath?: string
  children?: React.ReactNode
}

const VideoScrollEffect: React.FC<VideoScrollEffectProps> = ({
  className = "",
  frameCount = 60,
  videoPath = "/videos/hero-animation/", // Path to frame images
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [imagesLoaded, setImagesLoaded] = useState(false)
  
  // Transform scroll progress to frame index
  const frameIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, frameCount - 1]
  )

  // Load all frame images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = Array.from({ length: frameCount }, (_, i) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = reject
          // For demo purposes, we'll create placeholder frames
          // In real implementation, you'd load actual video frames
          img.src = `data:image/svg+xml;base64,${btoa(createFrameSVG(i, frameCount))}`
        })
      })

      try {
        const loadedImages = await Promise.all(imagePromises)
        setImages(loadedImages)
        setImagesLoaded(true)
      } catch (error) {
        console.error('Error loading frame images:', error)
      }
    }

    loadImages()
  }, [frameCount, videoPath])

  // Draw frame on canvas when frameIndex changes
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || images.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const unsubscribe = frameIndex.onChange(latest => {
      const index = Math.round(Math.max(0, Math.min(latest, images.length - 1)))
      const image = images[index]
      
      if (image) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Draw current frame
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      }
    })

    return unsubscribe
  }, [frameIndex, images, imagesLoaded])

  // Create a placeholder SVG frame for demonstration
  const createFrameSVG = (frameIndex: number, totalFrames: number) => {
    const progress = frameIndex / totalFrames
    const hue = progress * 360
    const scale = 0.5 + progress * 0.5
    const rotation = progress * 360

    return `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad${frameIndex}" cx="50%" cy="50%">
            <stop offset="0%" style="stop-color:hsl(${hue}, 70%, 60%);stop-opacity:0.8" />
            <stop offset="50%" style="stop-color:hsl(${(hue + 120) % 360}, 70%, 50%);stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:hsl(${(hue + 240) % 360}, 70%, 40%);stop-opacity:0.4" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="transparent"/>
        <circle 
          cx="400" 
          cy="300" 
          r="${100 * scale}" 
          fill="url(#grad${frameIndex})" 
          transform="rotate(${rotation} 400 300)"
        />
        <polygon 
          points="400,150 450,250 350,250" 
          fill="hsl(${(hue + 180) % 360}, 80%, 70%)" 
          transform="rotate(${-rotation} 400 300) scale(${scale})"
        />
        <rect 
          x="350" 
          y="350" 
          width="100" 
          height="100" 
          fill="hsl(${(hue + 60) % 360}, 80%, 60%)" 
          transform="rotate(${rotation * 0.5} 400 400) scale(${scale})"
        />
      </svg>
    `
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Canvas for frame-by-frame animation */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full object-cover"
        style={{ 
          imageRendering: 'crisp-edges',
          filter: 'brightness(1.1) contrast(1.2) saturate(1.1)'
        }}
      />
      
      {/* Overlay content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {children}
        </div>
      )}
      
      {/* Loading indicator */}
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="w-8 h-8 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading animation frames...</p>
          </div>
        </div>
      )}

      {/* Frame counter (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Frame: {frameIndex.get().toFixed(0)} / {frameCount - 1}
        </motion.div>
      )}

      {/* Scroll progress indicator */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ scaleX: scrollYProgress }}
          transformOrigin="0%"
        />
      </motion.div>
    </div>
  )
}

// Advanced Video Scroll with Multiple Layers
export const LayeredVideoScroll: React.FC<{
  className?: string
  layers?: {
    frameCount: number
    speed: number
    opacity: number
    blendMode?: string
  }[]
}> = ({ 
  className = "",
  layers = [
    { frameCount: 60, speed: 1, opacity: 1 },
    { frameCount: 30, speed: 0.5, opacity: 0.7 },
    { frameCount: 90, speed: 1.5, opacity: 0.5 }
  ]
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {layers.map((layer, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{
            opacity: layer.opacity,
            mixBlendMode: layer.blendMode as any || 'normal'
          }}
        >
          <VideoScrollEffect
            frameCount={layer.frameCount}
            className="w-full h-full"
          />
        </motion.div>
      ))}
    </div>
  )
}

// Cinematic Parallax Video Effect
export const CinematicVideoScroll: React.FC<{
  className?: string
  foregroundFrames?: number
  backgroundFrames?: number
}> = ({
  className = "",
  foregroundFrames = 60,
  backgroundFrames = 30
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Different scroll speeds for parallax effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -300])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Background layer */}
      <motion.div
        className="absolute inset-0 scale-110"
        style={{ y: backgroundY }}
      >
        <VideoScrollEffect
          frameCount={backgroundFrames}
          className="w-full h-full opacity-60 blur-sm"
        />
      </motion.div>

      {/* Foreground layer */}
      <motion.div
        className="absolute inset-0"
        style={{ y: foregroundY }}
      >
        <VideoScrollEffect
          frameCount={foregroundFrames}
          className="w-full h-full"
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
    </div>
  )
}

export default VideoScrollEffect