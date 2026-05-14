import React from 'react'
import * as Icons from 'lucide-react'

/**
 * ArtisanalIcon Component
 * Dynamically manifests Lucide icons based on string identifiers from the site content registry.
 * Features an institutional fallback policy to maintain visual integrity.
 */
const ArtisanalIcon = ({ name, size = 22, className = "" }) => {
  const IconComponent = Icons[name] || Icons.Info // Fallback to Info if name is invalid or missing

  return <IconComponent size={size} className={className} />
}

export default ArtisanalIcon
