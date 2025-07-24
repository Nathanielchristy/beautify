import type React from "react"

interface SparklesProps {
  className?: string
}

const Sparkles: React.FC<SparklesProps> = ({ className }) => {
  return <span className={className}>✨</span>
}

export default Sparkles
