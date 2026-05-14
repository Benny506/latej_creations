import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, Button } from "react-bootstrap"
import { MessageCircle, X, Send, RotateCcw, ChevronLeft } from "lucide-react"
import supabase from "../../utils/supabase"
import { ADMIN_CONFIG } from "../../utils/constants"
import ArtisanalIcon from "../ui/ArtisanalIcon"

// Institutional Palette
const PRIMARY = "#6D3E21"
const IVORY = "#FDFBF7"
const NOIR = "#1E1E1E"
const ATELIER_GRAY = "#F5F2ED"

const Avatar = ({ sender }) => (
  <div
    className="shadow-sm border"
    style={{
      width: 32,
      height: 32,
      borderRadius: "12px",
      backgroundColor: sender === "user" ? PRIMARY : "#fff",
      color: sender === "user" ? "#fff" : PRIMARY,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      fontWeight: "bold",
      flexShrink: 0,
      borderColor: "rgba(109, 62, 33, 0.1) !important"
    }}
  >
    {sender === "user" ? "YOU" : <ArtisanalIcon name="Sparkles" size={16} />}
  </div>
)

export default function ChatSupport() {
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)

  const [autoScroll, setAutoScroll] = useState(true)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState(["root"])
  const [isTyping, setIsTyping] = useState(false)
  const [whatsappMessage, setWhatsappMessage] = useState("")
  const [helpTree, setHelpTree] = useState({})

  useEffect(() => {
    const fetchTree = async () => {
      const { data, error } = await supabase
        .from('latej_support_chat')
        .select('*')

      if (!error && data) {
        const treeMap = data.reduce((acc, node) => {
          acc[node.node_id] = { text: node.message, options: node.options }
          return acc
        }, {})
        setHelpTree(treeMap)

        if (treeMap.root) {
          setMessages([{ id: Date.now(), sender: "bot", text: treeMap.root.text }])
          setHistory(["root"])
        }
      }
    }
    fetchTree()
  }, [])

  useEffect(() => {
    if (autoScroll) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  if (!helpTree || !helpTree.root) return null

  const currentNodeKey = history[history.length - 1]
  const currentNode = helpTree[currentNodeKey]

  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
    setAutoScroll(nearBottom)
  }

  const handleOptionClick = (option) => {
    if (!option.next || !helpTree[option.next]) return

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: option.label },
    ])

    setIsTyping(true)

    setTimeout(() => {
      const nextNode = helpTree[option.next]
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: nextNode.text },
      ])
      setHistory((prev) => [...prev, option.next])
      setIsTyping(false)
    }, 800)
  }

  const handleBack = () => {
    if (history.length <= 1) return
    setHistory((prev) => prev.slice(0, prev.length - 1))
    setMessages((prev) => prev.filter((_, idx) => idx < prev.length - 1))
  }

  const handleReset = () => {
    setMessages([{ id: Date.now(), sender: "bot", text: helpTree.root.text }])
    setHistory(["root"])
    setIsTyping(false)
    setWhatsappMessage("")
  }

  const handleWhatsApp = () => {
    if (!whatsappMessage.trim()) return
    const rawPhone = ADMIN_CONFIG?.phone || "+2348000000000"
    const cleanPhone = rawPhone.replace(/\D/g, '') // Keep only digits
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage.trim())}`,
      "_blank"
    )
  }

  return (
    <>
      {/* Floating Discovery Button */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: open ? 90 : 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="position-fixed shadow-premium"
        style={{
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: "20px",
          backgroundColor: PRIMARY,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          cursor: "pointer",
          zIndex: 2000,
        }}
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.div>

      {/* Artisanal Support Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="position-fixed"
            style={{
              bottom: 105,
              right: 30,
              width: "clamp(320px, 92vw, 400px)",
              zIndex: 2001,
            }}
          >
            <Card
              className="border-0 shadow-premium overflow-hidden rounded-5"
              style={{ backgroundColor: IVORY }}
            >
              {/* Institutional Header */}
              <div
                className="p-4 d-flex align-items-center justify-content-between text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                <div>
                  <h6 className="fw-bold mb-0 text-light">La Tejcreations Support</h6>
                  <p className="tiny opacity-75 mb-0 text-light">Ask us anything about our craft</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="bg-transparent border-0 text-white opacity-50 hover-opacity-100 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Registry Body */}
              <Card.Body
                ref={containerRef}
                onScroll={handleScroll}
                className="custom-scrollbar"
                style={{
                  height: 350,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  padding: 24,
                  backgroundColor: IVORY
                }}
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 10,
                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                    }}
                  >
                    {msg.sender === "bot" && <Avatar sender="bot" />}
                    <div
                      className="shadow-sm border"
                      style={{
                        backgroundColor: msg.sender === "user" ? PRIMARY : "#fff",
                        color: msg.sender === "user" ? "#fff" : NOIR,
                        padding: "12px 16px",
                        borderRadius: msg.sender === "user" ? "20px 20px 0 20px" : "20px 20px 20px 0",
                        fontSize: 14,
                        lineHeight: 1.5,
                        borderColor: "rgba(109, 62, 33, 0.05) !important"
                      }}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === "user" && <Avatar sender="user" />}
                  </motion.div>
                ))}

                {isTyping && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Avatar sender="bot" />
                    <div className="bg-white border p-3 rounded-4 shadow-sm" style={{ borderRadius: '20px 20px 20px 0' }}>
                      <span className="typing-dot">.</span>
                      <span className="typing-dot">.</span>
                      <span className="typing-dot">.</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />

                {/* Discovery Options */}
                {!isTyping && currentNode && (
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {currentNode.options.map((opt, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant="outline-primary"
                        className="rounded-pill px-3 py-2 small fw-bold bg-white border-primary border-opacity-25 hover-bg-primary hover-text-white transition-all"
                        onClick={() => handleOptionClick(opt)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                )}
              </Card.Body>

              {/* Handover Footer */}
              <div
                className="p-4"
                style={{
                  backgroundColor: ATELIER_GRAY,
                  borderTop: "1px solid rgba(109, 62, 33, 0.05)"
                }}
              >
                <div className="position-relative mb-3">
                  <input
                    type="text"
                    placeholder="Message our team on WhatsApp..."
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      borderRadius: 100,
                      backgroundColor: "#fff",
                      border: "1px solid rgba(109, 62, 33, 0.1)",
                      color: NOIR,
                      fontSize: 14,
                      outline: "none",
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleWhatsApp()}
                  />
                  <button
                    onClick={handleWhatsApp}
                    className="position-absolute top-50 end-0 translate-middle-y me-2 bg-primary text-white border-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: 32, height: 32 }}
                    disabled={!whatsappMessage.trim()}
                  >
                    <Send size={16} />
                  </button>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <p className="tiny opacity-50 mb-0 fw-bold">Need a human? Tap send.</p>
                  <button
                    onClick={handleReset}
                    className="btn btn-link p-0 tiny text-uppercase fw-bold text-decoration-none text-primary opacity-50 hover-opacity-100"
                  >
                    <RotateCcw size={14} className="me-1" /> Reset
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .typing-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: var(--lt-primary);
          border-radius: 50%;
          margin: 0 2px;
          animation: dot-blink 1.4s infinite both;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-blink {
          0% { opacity: 0.2; transform: translateY(0); }
          20% { opacity: 1; transform: translateY(-2px); }
          100% { opacity: 0.2; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(109, 62, 33, 0.1); 
          border-radius: 10px; 
        }
      `}</style>
    </>
  )
}
