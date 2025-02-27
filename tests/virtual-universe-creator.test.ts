import { describe, it, expect, beforeEach } from "vitest"

const stabilityReports = new Map()
let lastReportId = 0

describe("simulation-stability-monitor", () => {
  beforeEach(() => {
    stabilityReports.clear()
    lastReportId = 0
  })
  
  it("should submit a stability report", () => {
    const result = submitStabilityReport(1, 95, ["Minor fluctuations in gravity"])
    expect(result.success).toBe(true)
    expect(result.result).toBe(1)
  })
  
  it("should retrieve a stability report", () => {
    submitStabilityReport(1, 95, ["Minor fluctuations in gravity"])
    const report = getStabilityReport(1)
    expect(report).toBeDefined()
    expect(report.universe_id).toBe(1)
    expect(report.stability_score).toBe(95)
    expect(report.issues).toEqual(["Minor fluctuations in gravity"])
  })
  
  it("should get the latest stability score for a universe", () => {
    submitStabilityReport(1, 95, ["Minor fluctuations in gravity"])
    submitStabilityReport(1, 98, ["Improved gravity stability"])
    const latestScore = getLatestStabilityScore(1)
    expect(latestScore).toBe(98)
  })
})

function submitStabilityReport(universeId: number, stabilityScore: number, issues: string[]) {
  const newId = ++lastReportId
  stabilityReports.set(newId, {
    universe_id: universeId,
    timestamp: Date.now(),
    stability_score: stabilityScore,
    issues,
  })
  return { success: true, result: newId }
}

function getStabilityReport(reportId: number) {
  return stabilityReports.get(reportId)
}

function getLatestStabilityScore(universeId: number) {
  let latestScore = 0
  for (const report of stabilityReports.values()) {
    if (report.universe_id === universeId && report.stability_score > latestScore) {
      latestScore = report.stability_score
    }
  }
  return latestScore
}

