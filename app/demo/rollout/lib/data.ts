import type {
  Activity,
  Area,
  FieldRecord,
  Issue,
  MaterialReconciliation,
  NetworkElement,
  TeamPerformance
} from "./types";

export const areas: Area[] = [
  {
    id: "AREA-A01",
    name: "North District A",
    plannedProgress: 76,
    actualProgress: 69,
    status: "Watch",
    cablePlanned: 18400,
    cableInstalled: 15120,
    boxesPlanned: 148,
    boxesInstalled: 126,
    plannedUsers: 2380,
    passedUsers: 1875,
    openIssues: 4,
    fieldTeams: 5,
    startDate: "2026-08-04",
    forecastCompletion: "2026-09-08"
  },
  {
    id: "AREA-B02",
    name: "Central Zone B",
    plannedProgress: 62,
    actualProgress: 64,
    status: "Healthy",
    cablePlanned: 14200,
    cableInstalled: 9820,
    boxesPlanned: 110,
    boxesInstalled: 86,
    plannedUsers: 1640,
    passedUsers: 1180,
    openIssues: 2,
    fieldTeams: 4,
    startDate: "2026-08-07",
    forecastCompletion: "2026-09-12"
  },
  {
    id: "AREA-C03",
    name: "West Sector C",
    plannedProgress: 58,
    actualProgress: 47,
    status: "Critical",
    cablePlanned: 16900,
    cableInstalled: 7900,
    boxesPlanned: 124,
    boxesInstalled: 62,
    plannedUsers: 1920,
    passedUsers: 860,
    openIssues: 7,
    fieldTeams: 3,
    startDate: "2026-08-10",
    forecastCompletion: "2026-09-22"
  },
  {
    id: "AREA-D04",
    name: "East Sector D",
    plannedProgress: 44,
    actualProgress: 45,
    status: "Healthy",
    cablePlanned: 12100,
    cableInstalled: 5480,
    boxesPlanned: 96,
    boxesInstalled: 51,
    plannedUsers: 1360,
    passedUsers: 720,
    openIssues: 1,
    fieldTeams: 3,
    startDate: "2026-08-13",
    forecastCompletion: "2026-09-20"
  }
];

export const teamPerformance: TeamPerformance[] = [
  { supervisor: "Adam Faris", team: "Team Alpha", areaId: "AREA-A01", cableInstalled: 3280, endBoxes: 38, subBoxes: 10, hubBoxes: 2, xboxUnits: 12, productivityScore: 91 },
  { supervisor: "Lina Haddad", team: "Team Bravo", areaId: "AREA-B02", cableInstalled: 2860, endBoxes: 31, subBoxes: 8, hubBoxes: 1, xboxUnits: 9, productivityScore: 87 },
  { supervisor: "Rami Saad", team: "Team Delta", areaId: "AREA-D04", cableInstalled: 2100, endBoxes: 24, subBoxes: 6, hubBoxes: 1, xboxUnits: 7, productivityScore: 82 },
  { supervisor: "Mira Saleh", team: "Team Cedar", areaId: "AREA-C03", cableInstalled: 1780, endBoxes: 16, subBoxes: 4, hubBoxes: 1, xboxUnits: 5, productivityScore: 68 }
];

export const fieldRecords: FieldRecord[] = [
  { id: "FR-2026-0118", date: "2026-08-29", supervisor: "Adam Faris", teamLeader: "Noah Karim", city: "Riverton", areaId: "AREA-A01", activityType: "Cable Deployment", networkElement: "Cable", distributionNode: "DN-01", material: "Fiber Cable 24F", itemDetail: "24F feeder cable, armored outdoor", cableRoute: "RTE-A01-08", cableCode: "CBL-24F-008", plannedLength: 520, actualLength: 505, mountType: "Underground", boxCode: "N/A", serialNumber: "N/A", quantity: 505, status: "Healthy", notes: "Installed along approved route with minor length saving." },
  { id: "FR-2026-0117", date: "2026-08-29", supervisor: "Lina Haddad", teamLeader: "Omar Nader", city: "Marina", areaId: "AREA-B02", activityType: "Box Installation", networkElement: "END", distributionNode: "DN-03", material: "ODB / FAT", itemDetail: "16 port outdoor terminal box", cableRoute: "RTE-B02-04", cableCode: "N/A", plannedLength: 0, actualLength: 0, mountType: "Wall", boxCode: "END-045", serialNumber: "SN-END-9045", quantity: 8, status: "Healthy", notes: "END boxes installed and labeled." },
  { id: "FR-2026-0116", date: "2026-08-28", supervisor: "Mira Saleh", teamLeader: "Ziad Noor", city: "Hillford", areaId: "AREA-C03", activityType: "Civil Follow-up", networkElement: "SUB", distributionNode: "DN-07", material: "Fiber Closure", itemDetail: "Dome closure with splice tray", cableRoute: "RTE-C03-02", cableCode: "CBL-12F-019", plannedLength: 260, actualLength: 0, mountType: "Pole", boxCode: "SUB-012", serialNumber: "Pending", quantity: 0, status: "Critical", notes: "Route obstruction blocked installation." },
  { id: "FR-2026-0115", date: "2026-08-28", supervisor: "Rami Saad", teamLeader: "Tarek Amin", city: "Eastbank", areaId: "AREA-D04", activityType: "Distribution Unit", networkElement: "XBOX", distributionNode: "DN-09", material: "Splitter 1:16", itemDetail: "PLC splitter tray loaded in XBOX", cableRoute: "RTE-D04-05", cableCode: "N/A", plannedLength: 0, actualLength: 0, mountType: "Cabinet", boxCode: "XBOX-022", serialNumber: "SN-XB-7022", quantity: 3, status: "Watch", notes: "Distribution unit installed; labeling pending validation." },
  { id: "FR-2026-0114", date: "2026-08-27", supervisor: "Adam Faris", teamLeader: "Noah Karim", city: "Riverton", areaId: "AREA-A01", activityType: "HUB Installation", networkElement: "HUB", distributionNode: "DN-01", material: "HUB Cabinet", itemDetail: "96F street cabinet with patch frame", cableRoute: "RTE-A01-01", cableCode: "CBL-96F-001", plannedLength: 820, actualLength: 820, mountType: "Pad", boxCode: "HUB-01", serialNumber: "SN-HUB-4101", quantity: 1, status: "Healthy", notes: "HUB cabinet installed and accepted by QA." },
  { id: "FR-2026-0113", date: "2026-08-27", supervisor: "Lina Haddad", teamLeader: "Omar Nader", city: "Marina", areaId: "AREA-B02", activityType: "SUB Installation", networkElement: "SUB", distributionNode: "DN-03", material: "Fiber Closure", itemDetail: "Intermediate splice closure", cableRoute: "RTE-B02-02", cableCode: "CBL-12F-014", plannedLength: 360, actualLength: 372, mountType: "Pole", boxCode: "SUB-018", serialNumber: "SN-SUB-8018", quantity: 2, status: "Watch", notes: "Actual route shifted due to site access." },
  { id: "FR-2026-0112", date: "2026-08-26", supervisor: "Mira Saleh", teamLeader: "Ziad Noor", city: "Hillford", areaId: "AREA-C03", activityType: "END Activation Prep", networkElement: "END", distributionNode: "DN-07", material: "ODB / FAT", itemDetail: "8 port terminal box", cableRoute: "RTE-C03-07", cableCode: "N/A", plannedLength: 0, actualLength: 0, mountType: "Wall", boxCode: "END-071", serialNumber: "SN-END-9071", quantity: 5, status: "Healthy", notes: "Boxes installed; splitter installation remains pending." },
  { id: "FR-2026-0111", date: "2026-08-26", supervisor: "Rami Saad", teamLeader: "Tarek Amin", city: "Eastbank", areaId: "AREA-D04", activityType: "Cable Deployment", networkElement: "Cable", distributionNode: "DN-09", material: "Fiber Cable 12F", itemDetail: "12F distribution cable", cableRoute: "RTE-D04-03", cableCode: "CBL-12F-033", plannedLength: 440, actualLength: 440, mountType: "Aerial", boxCode: "N/A", serialNumber: "N/A", quantity: 440, status: "Healthy", notes: "Cable route matches design drawing." }
];

export const networkElements: NetworkElement[] = [
  { id: "DN-01", areaId: "AREA-A01", distributionNode: "DN-01", type: "Distribution Node", plannedCode: "DN-01", actualCode: "DN-01", plannedCableLength: 0, actualCableLength: 0, status: "Match" },
  { id: "HUB-01", areaId: "AREA-A01", distributionNode: "DN-01", type: "HUB", plannedCode: "HUB-01", actualCode: "HUB-01", plannedCableLength: 820, actualCableLength: 820, status: "Match" },
  { id: "SUB-012", areaId: "AREA-A01", distributionNode: "DN-01", type: "SUB", plannedCode: "SUB-012", actualCode: "SUB-012A", plannedCableLength: 460, actualCableLength: 505, status: "Mismatch" },
  { id: "END-045", areaId: "AREA-A01", distributionNode: "DN-01", type: "END", plannedCode: "END-045", actualCode: "END-045", plannedCableLength: 180, actualCableLength: 180, status: "Match" },
  { id: "END-052", areaId: "AREA-A01", distributionNode: "DN-01", type: "END", plannedCode: "END-052", actualCode: "Missing", plannedCableLength: 160, actualCableLength: 0, status: "Missing" },
  { id: "CBL-24F-008", areaId: "AREA-A01", distributionNode: "DN-01", type: "Cable", plannedCode: "CBL-24F-008", actualCode: "CBL-24F-008", plannedCableLength: 520, actualCableLength: 505, status: "Mismatch" },
  { id: "DN-03", areaId: "AREA-B02", distributionNode: "DN-03", type: "Distribution Node", plannedCode: "DN-03", actualCode: "DN-03", plannedCableLength: 0, actualCableLength: 0, status: "Match" },
  { id: "HUB-03", areaId: "AREA-B02", distributionNode: "DN-03", type: "HUB", plannedCode: "HUB-03", actualCode: "HUB-03", plannedCableLength: 700, actualCableLength: 700, status: "Match" },
  { id: "SUB-018", areaId: "AREA-B02", distributionNode: "DN-03", type: "SUB", plannedCode: "SUB-018", actualCode: "SUB-018", plannedCableLength: 360, actualCableLength: 372, status: "Mismatch" },
  { id: "END-061", areaId: "AREA-B02", distributionNode: "DN-03", type: "END", plannedCode: "END-061", actualCode: "END-061", plannedCableLength: 130, actualCableLength: 130, status: "Match" },
  { id: "DN-07", areaId: "AREA-C03", distributionNode: "DN-07", type: "Distribution Node", plannedCode: "DN-07", actualCode: "DN-07", plannedCableLength: 0, actualCableLength: 0, status: "Match" },
  { id: "HUB-07", areaId: "AREA-C03", distributionNode: "DN-07", type: "HUB", plannedCode: "HUB-07", actualCode: "Missing", plannedCableLength: 760, actualCableLength: 0, status: "Missing" },
  { id: "SUB-031", areaId: "AREA-C03", distributionNode: "DN-07", type: "SUB", plannedCode: "SUB-031", actualCode: "SUB-031", plannedCableLength: 260, actualCableLength: 0, status: "Mismatch" },
  { id: "CBL-12F-019", areaId: "AREA-C03", distributionNode: "DN-07", type: "Cable", plannedCode: "CBL-12F-019", actualCode: "Missing", plannedCableLength: 260, actualCableLength: 0, status: "Missing" },
  { id: "DN-09", areaId: "AREA-D04", distributionNode: "DN-09", type: "Distribution Node", plannedCode: "DN-09", actualCode: "DN-09", plannedCableLength: 0, actualCableLength: 0, status: "Match" },
  { id: "XBOX-022", areaId: "AREA-D04", distributionNode: "DN-09", type: "Distribution Node", plannedCode: "XBOX-022", actualCode: "XBOX-022", plannedCableLength: 0, actualCableLength: 0, status: "Match" },
  { id: "CBL-12F-033", areaId: "AREA-D04", distributionNode: "DN-09", type: "Cable", plannedCode: "CBL-12F-033", actualCode: "CBL-12F-033", plannedCableLength: 440, actualCableLength: 440, status: "Match" }
];

export const materialReconciliation: MaterialReconciliation[] = [
  { id: "REC-001", areaId: "AREA-A01", team: "Team Alpha", material: "Fiber Cable 24F", partNumber: "FOC-24F-SM-002", issued: 6200, fieldUsed: 5880, returned: 120, reportedBalance: 200, unit: "m", status: "Reconciled" },
  { id: "REC-002", areaId: "AREA-A01", team: "Team Alpha", material: "ODB / FAT", partNumber: "ODB-FAT-16P-041", issued: 42, fieldUsed: 37, returned: 2, reportedBalance: 3, unit: "pcs", status: "Reconciled" },
  { id: "REC-003", areaId: "AREA-C03", team: "Team Cedar", material: "Splitter 1:16", partNumber: "SPL-PLC-1X16-032", issued: 26, fieldUsed: 18, returned: 3, reportedBalance: 2, unit: "pcs", status: "Variance" },
  { id: "REC-004", areaId: "AREA-B02", team: "Team Bravo", material: "Drop Cable", partNumber: "DRP-2C-FLAT-010", issued: 4100, fieldUsed: 3620, returned: 180, reportedBalance: 300, unit: "m", status: "Review Required" },
  { id: "REC-005", areaId: "AREA-D04", team: "Team Delta", material: "Patch Cord", partNumber: "PC-SCAPC-3M-061", issued: 220, fieldUsed: 178, returned: 22, reportedBalance: 20, unit: "pcs", status: "Reconciled" }
];

export const issues: Issue[] = [
  { id: "ISS-041", areaId: "AREA-C03", type: "Route obstruction", severity: "High", owner: "Mira Saleh", status: "Open", note: "Civil access constraint on planned feeder route." },
  { id: "ISS-038", areaId: "AREA-A01", type: "Material shortage", severity: "Medium", owner: "Adam Faris", status: "In Review", note: "Additional splitter stock requested for branch completion." },
  { id: "ISS-036", areaId: "AREA-C03", type: "Permit pending", severity: "Medium", owner: "Mira Saleh", status: "Open", note: "Work package waiting for site access confirmation." },
  { id: "ISS-032", areaId: "AREA-B02", type: "Design mismatch", severity: "Low", owner: "Lina Haddad", status: "Resolved", note: "Field route updated after survey clarification." }
];

export const activities: Activity[] = [
  { id: "ACT-081", time: "2026-08-29 14:20", areaId: "AREA-A01", title: "Cable record validated", note: "CBL-24F-008 length variance sent to validation review." },
  { id: "ACT-080", time: "2026-08-29 12:10", areaId: "AREA-B02", title: "END boxes installed", note: "Eight END boxes added to Central Zone B rollout records." },
  { id: "ACT-079", time: "2026-08-29 10:45", areaId: "AREA-C03", title: "Priority issue opened", note: "Route obstruction added for West Sector C." },
  { id: "ACT-078", time: "2026-08-28 16:30", areaId: "AREA-D04", title: "Distribution unit installed", note: "XBOX-022 submitted for network validation." }
];
