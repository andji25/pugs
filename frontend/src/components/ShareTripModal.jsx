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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
                <h2>Share Trip</h2>

                <div>
                    <label>Access Type</label>
                    <select
                        value={form.accessType}
                        onChange={(e) => setForm({ ...form, accessType: parseInt(e.target.value) })}>
                        <option value={0}>View Only</option>
                        <option value={1}>Edit</option>
                    </select>
                </div>
                <div>
                    <label>Expires in (days)</label>
                    <input
                        type="number"
                        value={form.expiresInDays}
                        onChange={(e) => setForm({ ...form, expiresInDays:parseInt(e.target.value) })}
                        min={1}
                        max={30}/>
                </div>
                <button onClick={handleGenerate} disabled={generating}>
                    {generating ? 'Generating...' : 'Generate QR Code'}
                </button>

                {loading ? <p>Loading...</p> : (
                    tokens.map(token => (
                        <div key={token.id} style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <p>{token.accessType === 0 ? 'View Only' : 'Edit'} - expires {new Date(token.expiresAt).toLocaleDateString()}</p>
                            <QRCodeSVG value={getShareUrl(token.token)} size={150} />
                            <p style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{getShareUrl(token.token)}</p>
                            <button onClick={() => handleDeactivate(token.id)}>Deactivate</button>
                        </div>
                    ))
                )}

                <button onClick={onClose} style={{ marginTop: '1rem' }}>Close</button>
            </div>
        </div>
    )
}

export default ShareTripModal
