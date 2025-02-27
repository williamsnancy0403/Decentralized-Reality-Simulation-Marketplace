import { describe, it, expect, beforeEach } from "vitest"

const licenses = new Map()
let lastLicenseId = 0

describe("experience-licensor", () => {
  beforeEach(() => {
    licenses.clear()
    lastLicenseId = 0
  })
  
  it("should issue a new license", () => {
    const result = issueLicense(1, "recipient", 100, true)
    expect(result.success).toBe(true)
    expect(result.result).toBe(1)
  })
  
  it("should retrieve a license", () => {
    issueLicense(1, "recipient", 100, true)
    const license = getLicense(1)
    expect(license).toBeDefined()
    expect(license.universe_id).toBe(1)
    expect(license.owner).toBe("recipient")
    expect(license.transferable).toBe(true)
  })
  
  it("should transfer a license", () => {
    issueLicense(1, "original-owner", 100, true)
    const result = transferLicense(1, "new-owner")
    expect(result.success).toBe(true)
    const license = getLicense(1)
    expect(license.owner).toBe("new-owner")
  })
})

function issueLicense(universeId: number, recipient: string, duration: number, transferable: boolean) {
  const newId = ++lastLicenseId
  licenses.set(newId, {
    universe_id: universeId,
    owner: recipient,
    expiration: Date.now() + duration * 1000,
    transferable,
  })
  return { success: true, result: newId }
}

function getLicense(licenseId: number) {
  return licenses.get(licenseId)
}

function transferLicense(licenseId: number, newOwner: string) {
  const license = licenses.get(licenseId)
  if (license && license.transferable) {
    license.owner = newOwner
    licenses.set(licenseId, license)
    return { success: true }
  }
  return { success: false }
}

