export class ShareToken {
  constructor(id, token, tripId, accessType, expiresAt, isActive) {
    this.id = id
    this.token = token
    this.tripId = tripId
    this.accessType = accessType
    this.expiresAt = expiresAt
    this.isActive = isActive
  }

  isViewOnly() {
    return this.accessType === 0
  }

  isExpired() {
    return new Date(this.expiresAt) < new Date()
  }
}