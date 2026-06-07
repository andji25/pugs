import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { sharingService } from '../services/sharingService'

function ShareTripModal({ tripId, onClose }) {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [form, setForm] = useState({
    tripId: tripId,
    accessType: 0,
    expiresInDays: 7
  })

  useEffect(() => {
    fetchTokens()
  }, [])

  const fetchTokens = async () => {
    try {
      const data = await sharingService.getByTrip(tripId)
      setTokens(data.filter(t => t.isActive))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await sharingService.createToken(form)
      await fetchTokens()
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  const handleDeactivate = async (id) => {
    try {
      await sharingService.deactivateToken(id)
      await fetchTokens()
    } catch (err) {
      console.error(err)
    }
  }

  const getShareUrl = (token) => `${window.location.origin}/shared/${token}`

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-teal-900">🔗 Share Trip</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">✕</button>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Access Type</label>
            <select
              value={form.accessType}
              onChange={(e) => setForm({ ...form, accessType: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none">
              <option value={0}>👁️ View Only</option>
              <option value={1}>✏️ Edit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Expires in (days)</label>
            <input
              type="number"
              value={form.expiresInDays}
              onChange={(e) => setForm({ ...form, expiresInDays: parseInt(e.target.value) })}
              min={1}
              max={30}
              className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50">
            {generating ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-teal-700">Loading...</p>
        ) : (
          tokens.map(token => (
            <div key={token.id} className="border-t border-sky-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium px-2 py-1 rounded-lg ${token.accessType === 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                  {token.accessType === 0 ? '👁️ View Only' : '✏️ Edit'}
                </span>
                <span className="text-xs text-gray-400">
                  Expires: {new Date(token.expiresAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-center my-3">
                <QRCodeSVG value={getShareUrl(token.token)} size={150} />
              </div>
              <p className="text-xs text-gray-400 break-all text-center mb-2">
                {getShareUrl(token.token)}
              </p>
              <button
                onClick={() => handleDeactivate(token.id)}
                className="w-full border border-orange-400 text-orange-500 py-1 rounded-lg text-sm hover:bg-orange-50 transition">
                Deactivate
              </button>
            </div>
          ))
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 border border-sky-200 text-teal-700 py-2 rounded-lg text-sm hover:bg-sky-50 transition">
          Close
        </button>
      </div>
    </div>
  )
}

export default ShareTripModal
