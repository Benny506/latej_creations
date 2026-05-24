import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'

const ShopByCatalog = () => {
  const navigate = useNavigate()
  const { catalogs, products } = useSelector(state => state.products)

  // Filter catalogs to only those that contain at least one active product
  const activeCatalogs = catalogs.filter(catalog => {
    return products.some(p => p.catalog_id === catalog.id && p.is_active)
  })

  if (!activeCatalogs || activeCatalogs.length === 0) return null

  const displayCatalogs = activeCatalogs.slice(0, 6)
  const hasMore = activeCatalogs.length > 6

  // Helper to extract a random cover image for a catalog from its active products/variants
  const getCatalogCoverImage = (catalogId) => {
    const catalogProducts = products.filter(p => p.catalog_id === catalogId && p.is_active)
    let allImages = []
    
    catalogProducts.forEach(product => {
      product.variants?.forEach(variant => {
        if (variant.is_active && variant.images && variant.images.length > 0) {
          allImages = allImages.concat(variant.images)
        }
      })
    })

    if (allImages.length === 0) return null
    const randomIndex = Math.floor(Math.random() * allImages.length)
    return allImages[randomIndex]
  }

  return (
    <section className="py-5" style={{ backgroundColor: 'var(--lt-earth-light)' }}>
      <div className="container py-lg-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
          <div>
            <span className="text-primary text-uppercase tracking-widest fw-bold small mb-2 d-block">Collections</span>
            <h2 className="display-5 text-main mb-0" style={{ fontFamily: 'var(--lt-font-serif)' }}>
              Shop By Catalog
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate('/catalog')}
            className="btn btn-link text-primary text-decoration-none fw-bold p-0 d-flex align-items-center gap-2"
          >
            Explore All Collections <ArrowRight size={20} />
          </motion.button>
        </div>

        <div className="row g-4">
          {displayCatalogs.map((catalog, index) => {
            const coverImage = getCatalogCoverImage(catalog.id)

            return (
              <div key={catalog.id} className="col-12 col-md-6 col-lg-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(catalog.type === 'wholesale' ? `/wholesale?category=${catalog.id}` : `/shop?category=${catalog.id}`)}
                  className="card border-0 h-100 overflow-hidden cursor-pointer shadow-sm hover-shadow-lg transition-all"
                  style={{ borderRadius: '1rem', backgroundColor: '#fff' }}
                >
                  <div className="position-relative bg-light" style={{ height: '280px' }}>
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={catalog.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center opacity-50 text-main">
                        <ImageIcon size={40} className="mb-2" />
                        <span className="small tracking-widest text-uppercase">La Tejcreations</span>
                      </div>
                    )}

                    {/* Glassmorphism Badge */}
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge rounded-pill text-dark fw-bold text-uppercase tracking-widest"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          fontSize: '0.65rem',
                          padding: '0.5em 1em'
                        }}>
                        {catalog.type}
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-4 text-center d-flex flex-column justify-content-center">
                    <h4 className="card-title text-main fw-bold mb-2" style={{ fontFamily: 'var(--lt-font-serif)' }}>
                      {catalog.name}
                    </h4>
                    {catalog.description && (
                      <p className="card-text text-main opacity-75 small mb-0" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {catalog.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ShopByCatalog
