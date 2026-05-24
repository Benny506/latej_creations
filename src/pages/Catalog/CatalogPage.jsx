import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'

const CatalogPage = () => {
  const navigate = useNavigate()
  const { catalogs, products } = useSelector(state => state.products)
  const [activeTab, setActiveTab] = useState('retail')

  // Memoize active catalogs and random image extraction to prevent constant reshuffling on re-renders
  const { retailCatalogs, wholesaleCatalogs, catalogImages } = useMemo(() => {
    const activeCatalogs = catalogs.filter(catalog => {
      return products.some(p => p.catalog_id === catalog.id && p.is_active)
    })

    const retail = activeCatalogs.filter(c => c.type === 'retail')
    const wholesale = activeCatalogs.filter(c => c.type === 'wholesale')

    const imagesMap = {}
    activeCatalogs.forEach(catalog => {
      const catalogProducts = products.filter(p => p.catalog_id === catalog.id && p.is_active)
      let allImages = []

      catalogProducts.forEach(product => {
        product.variants?.forEach(variant => {
          if (variant.is_active && variant.images && variant.images.length > 0) {
            allImages = allImages.concat(variant.images)
          }
        })
      })

      if (allImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * allImages.length)
        imagesMap[catalog.id] = allImages[randomIndex]
      } else {
        imagesMap[catalog.id] = null
      }
    })

    return { retailCatalogs: retail, wholesaleCatalogs: wholesale, catalogImages: imagesMap }
  }, [catalogs, products])

  const renderEditorialBlock = (catalog, index) => {
    const isEven = index % 2 === 0
    const coverImage = catalogImages[catalog.id]

    return (
      <div key={catalog.id} className={`row g-0 align-items-center mb-5 pb-lg-5 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Image Side */}
        <div className="col-12 col-lg-6 mb-4 mb-lg-0">
          <motion.div
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`position-relative ${isEven ? 'pe-lg-5' : 'ps-lg-5'}`}
          >
            <div
              className="bg-light w-100 overflow-hidden shadow-sm"
              style={{ height: '600px', borderRadius: isEven ? '0 2rem 2rem 0' : '2rem 0 0 2rem' }}
            >
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={catalog.name}
                  className="w-100 h-100 object-fit-cover hover-scale-img transition-all"
                />
              ) : (
                <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center opacity-50 text-main">
                  <ImageIcon size={60} className="mb-3" />
                  <span className="tracking-widest text-uppercase">La Tejcreations</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Content Side */}
        <div className="col-12 col-lg-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-4 p-lg-5 ${isEven ? 'ps-lg-0' : 'pe-lg-0'}`}
          >
            <span className="badge rounded-pill text-light bg-primary bg-opacity-10 fw-bold text-uppercase tracking-widest mb-4 px-3 py-2">
              {catalog.type} Collection
            </span>
            <h2 className="display-4 text-main fw-bold mb-4" style={{ fontFamily: 'var(--lt-font-serif)' }}>
              {catalog.name}
            </h2>
            <div className="text-main opacity-75 fs-5 leading-relaxed mb-5" style={{ whiteSpace: 'pre-wrap' }}>
              {catalog.description || 'A signature collection by La Tejcreations.'}
            </div>

            <button
              onClick={() => navigate(catalog.type === 'wholesale' ? `/wholesale?category=${catalog.id}` : `/shop?category=${catalog.id}`)}
              className="btn btn-outline-primary btn-lg rounded-pill fw-bold px-5 d-inline-flex align-items-center gap-2 hover-shadow-sm"
            >
              View Collection <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="catalog-page min-vh-100 bg-white">
      {/* Header */}
      <section className="py-5 pt-lg-5 mt-5 text-center bg-light border-bottom">
        <div className="container py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary text-uppercase tracking-widest fw-bold small mb-3 d-block">The Archives</span>
            <h1 className="display-3 text-main fw-bold mb-4" style={{ fontFamily: 'var(--lt-font-serif)' }}>
              Catalog Directory
            </h1>
            <p className="lead text-main opacity-75 mx-auto mb-4" style={{ maxWidth: '700px' }}>
              Explore our curated collections. From bespoke retail pieces to our high-volume wholesale partnerships.
            </p>

            <div className="d-flex justify-content-center gap-3">
              <button
                className={`btn rounded-pill px-4 fw-bold transition-all ${activeTab === 'retail' ? 'btn-primary shadow-sm' : 'btn-outline-primary border-0 bg-white shadow-sm opacity-75 hover-opacity-100'}`}
                onClick={() => setActiveTab('retail')}
              >
                Retail Collections
              </button>
              <button
                className={`btn rounded-pill px-4 fw-bold transition-all ${activeTab === 'wholesale' ? 'btn-primary shadow-sm' : 'btn-outline-primary border-0 bg-white shadow-sm opacity-75 hover-opacity-100'}`}
                onClick={() => setActiveTab('wholesale')}
              >
                Wholesale Partnerships
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="d-flex flex-column position-relative">
        <AnimatePresence mode="popLayout">
          {/* Retail Segment */}
          {retailCatalogs.length > 0 && (
            <motion.section
              key="retail"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`py-5 ${activeTab === 'retail' ? 'order-1 mt-4' : 'order-2 mt-0'}`}
            >
              <div className="container-fluid px-0">
                <div className="container mb-5 text-center">
                  <h3 className="text-main tracking-widest text-uppercase fw-bold opacity-50 mb-0">Retail Collections</h3>
                  <hr className="my-4 mx-auto border-primary opacity-25" style={{ width: '100px', borderWidth: '2px' }} />
                </div>
                {retailCatalogs.map((catalog, idx) => renderEditorialBlock(catalog, idx))}
              </div>
            </motion.section>
          )}

          {/* Wholesale Segment */}
          {wholesaleCatalogs.length > 0 && (
            <motion.section
              key="wholesale"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`py-5 bg-light ${activeTab === 'wholesale' ? 'order-1' : 'order-2'}`}
            >
              <div className="container-fluid px-0 pt-4">
                <div className="container mb-5 text-center">
                  <h3 className="text-main tracking-widest text-uppercase fw-bold opacity-50 mb-0">Wholesale Partnerships</h3>
                  <hr className="my-4 mx-auto border-primary opacity-25" style={{ width: '100px', borderWidth: '2px' }} />
                </div>
                {wholesaleCatalogs.map((catalog, idx) => renderEditorialBlock(catalog, idx))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {catalogs.length === 0 && (
        <div className="container py-5 text-center text-main opacity-50">
          <p className="lead">No collections are currently available.</p>
        </div>
      )}

      <style>{`
        .hover-scale-img:hover {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  )
}

export default CatalogPage
