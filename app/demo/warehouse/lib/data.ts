import type { DemoState, Material, WarehouseId } from "./types";

export const warehouses: Record<WarehouseId, string> = {
  central: "Central Warehouse",
  north: "Field Warehouse North",
  south: "Field Warehouse South"
};

export const materials: Material[] = [
  { id: "fiber-12f", code: "FOC-12F-SM-001", name: "Fiber Cable 12F", unit: "m", category: "Cable", reorderLevel: 500 },
  { id: "fiber-24f", code: "FOC-24F-SM-002", name: "Fiber Cable 24F", unit: "m", category: "Cable", reorderLevel: 420 },
  { id: "drop-cable", code: "DRP-2C-FLAT-010", name: "Drop Cable", unit: "m", category: "Cable", reorderLevel: 600 },
  { id: "ont", code: "ONT-GPON-AC-021", name: "ONT", unit: "pcs", category: "CPE", reorderLevel: 35 },
  { id: "splitter-18", code: "SPL-PLC-1X8-031", name: "Splitter 1:8", unit: "pcs", category: "Splitter", reorderLevel: 25 },
  { id: "splitter-116", code: "SPL-PLC-1X16-032", name: "Splitter 1:16", unit: "pcs", category: "Splitter", reorderLevel: 20 },
  { id: "odb-fat", code: "ODB-FAT-16P-041", name: "ODB / FAT", unit: "pcs", category: "Passive", reorderLevel: 18 },
  { id: "closure", code: "CLS-FO-24C-052", name: "Fiber Closure", unit: "pcs", category: "Passive", reorderLevel: 16 },
  { id: "patch-cord", code: "PC-SCAPC-3M-061", name: "Patch Cord", unit: "pcs", category: "Accessory", reorderLevel: 90 },
  { id: "adapter", code: "ADP-SCAPC-071", name: "SC/APC Adapter", unit: "pcs", category: "Accessory", reorderLevel: 110 },
  { id: "pigtail", code: "PGT-SCAPC-1M-081", name: "Pigtail", unit: "pcs", category: "Accessory", reorderLevel: 130 }
];

export const initialState: DemoState = {
  stock: {
    "fiber-12f": {
      central: { onHand: 4200, reserved: 700, lowThreshold: 500 },
      north: { onHand: 780, reserved: 220, lowThreshold: 450 },
      south: { onHand: 0, reserved: 0, lowThreshold: 450 }
    },
    "fiber-24f": {
      central: { onHand: 2600, reserved: 450, lowThreshold: 420 },
      north: { onHand: 380, reserved: 120, lowThreshold: 360 },
      south: { onHand: 510, reserved: 160, lowThreshold: 360 }
    },
    "drop-cable": {
      central: { onHand: 5400, reserved: 950, lowThreshold: 600 },
      north: { onHand: 1150, reserved: 500, lowThreshold: 700 },
      south: { onHand: 420, reserved: 210, lowThreshold: 700 }
    },
    ont: {
      central: { onHand: 180, reserved: 48, lowThreshold: 35 },
      north: { onHand: 45, reserved: 26, lowThreshold: 32 },
      south: { onHand: 18, reserved: 10, lowThreshold: 32 }
    },
    "splitter-18": {
      central: { onHand: 95, reserved: 18, lowThreshold: 25 },
      north: { onHand: 22, reserved: 14, lowThreshold: 24 },
      south: { onHand: 4, reserved: 0, lowThreshold: 24 }
    },
    "splitter-116": {
      central: { onHand: 80, reserved: 12, lowThreshold: 20 },
      north: { onHand: 14, reserved: 8, lowThreshold: 18 },
      south: { onHand: 11, reserved: 7, lowThreshold: 18 }
    },
    "odb-fat": {
      central: { onHand: 72, reserved: 15, lowThreshold: 18 },
      north: { onHand: 16, reserved: 9, lowThreshold: 16 },
      south: { onHand: 14, reserved: 12, lowThreshold: 16 }
    },
    closure: {
      central: { onHand: 55, reserved: 10, lowThreshold: 16 },
      north: { onHand: 8, reserved: 5, lowThreshold: 14 },
      south: { onHand: 10, reserved: 7, lowThreshold: 14 }
    },
    "patch-cord": {
      central: { onHand: 520, reserved: 130, lowThreshold: 90 },
      north: { onHand: 140, reserved: 80, lowThreshold: 80 },
      south: { onHand: 120, reserved: 65, lowThreshold: 80 }
    },
    adapter: {
      central: { onHand: 760, reserved: 180, lowThreshold: 110 },
      north: { onHand: 210, reserved: 120, lowThreshold: 100 },
      south: { onHand: 180, reserved: 160, lowThreshold: 100 }
    },
    pigtail: {
      central: { onHand: 680, reserved: 150, lowThreshold: 130 },
      north: { onHand: 190, reserved: 95, lowThreshold: 115 },
      south: { onHand: 0, reserved: 0, lowThreshold: 115 }
    }
  },
  requests: [
    {
      id: "MR-CEN-2026-0041",
      requester: "Omar Haddad",
      department: "FTTH Rollout Team",
      approver: "Maya Nasser",
      warehouseId: "central",
      targetArea: "Demo Central POP Expansion",
      status: "Approved",
      requestDate: "2026-08-28 09:10",
      requiredDate: "2026-08-30",
      notes: "Materials reserved for feeder cable preparation and FAT installation.",
      items: [
        { materialId: "fiber-24f", requested: 600, approved: 520, issued: 0, notes: "Approved quantity adjusted after stock review." },
        { materialId: "odb-fat", requested: 12, approved: 10, issued: 0 },
        { materialId: "closure", requested: 6, approved: 6, issued: 0 }
      ],
      timeline: [
        { id: "tl-0041-1", time: "2026-08-28 09:10", user: "Omar Haddad", title: "Created", note: "MR created by rollout coordinator." },
        { id: "tl-0041-2", time: "2026-08-28 09:36", user: "Omar Haddad", title: "Submitted", note: "Submitted to warehouse operations for review." },
        { id: "tl-0041-3", time: "2026-08-28 11:05", user: "Maya Nasser", title: "Approved", note: "Approved with adjusted cable quantity." }
      ]
    },
    {
      id: "MR-NTH-2026-0027",
      requester: "Sami Darwish",
      department: "North Field Team",
      approver: "Leen Qasem",
      warehouseId: "north",
      targetArea: "Demo North Zone B",
      status: "Partially Issued",
      requestDate: "2026-08-27 08:45",
      requiredDate: "2026-08-29",
      notes: "Partial issue completed pending additional drop cable availability.",
      items: [
        { materialId: "drop-cable", requested: 900, approved: 850, issued: 500 },
        { materialId: "ont", requested: 30, approved: 26, issued: 20 },
        { materialId: "adapter", requested: 140, approved: 120, issued: 120 }
      ],
      timeline: [
        { id: "tl-0027-1", time: "2026-08-27 08:45", user: "Sami Darwish", title: "Created", note: "MR prepared for customer activation work pack." },
        { id: "tl-0027-2", time: "2026-08-27 09:12", user: "Sami Darwish", title: "Submitted", note: "Submitted for approval." },
        { id: "tl-0027-3", time: "2026-08-27 10:40", user: "Leen Qasem", title: "Approved", note: "Approved for staged issue." },
        { id: "tl-0027-4", time: "2026-08-28 08:20", user: "Fadi Salem", title: "Partially Issued", note: "Available quantities issued to North Field Team." }
      ]
    },
    {
      id: "MR-STH-2026-0019",
      requester: "Nader Saleh",
      department: "South OSP Crew",
      approver: "Rana Mansour",
      warehouseId: "south",
      targetArea: "Demo South Distribution Area",
      status: "Submitted",
      requestDate: "2026-08-28 13:20",
      requiredDate: "2026-08-31",
      notes: "Awaiting operations approval before warehouse reservation.",
      items: [
        { materialId: "splitter-18", requested: 10, approved: 0, issued: 0 },
        { materialId: "pigtail", requested: 80, approved: 0, issued: 0 },
        { materialId: "patch-cord", requested: 60, approved: 0, issued: 0 }
      ],
      timeline: [
        { id: "tl-0019-1", time: "2026-08-28 13:20", user: "Nader Saleh", title: "Created", note: "MR created after field survey validation." },
        { id: "tl-0019-2", time: "2026-08-28 13:42", user: "Nader Saleh", title: "Submitted", note: "Submitted for approval." }
      ]
    },
    {
      id: "MR-CEN-2026-0038",
      requester: "Hala Karim",
      department: "Activation Support",
      approver: "Maya Nasser",
      warehouseId: "central",
      targetArea: "Demo Activation Backlog",
      status: "Issued",
      requestDate: "2026-08-26 10:05",
      requiredDate: "2026-08-27",
      notes: "Fully issued for activation team dispatch.",
      items: [
        { materialId: "ont", requested: 18, approved: 18, issued: 18 },
        { materialId: "patch-cord", requested: 36, approved: 36, issued: 36 },
        { materialId: "adapter", requested: 36, approved: 36, issued: 36 }
      ],
      timeline: [
        { id: "tl-0038-1", time: "2026-08-26 10:05", user: "Hala Karim", title: "Created", note: "Activation materials requested." },
        { id: "tl-0038-2", time: "2026-08-26 10:22", user: "Hala Karim", title: "Submitted", note: "Submitted to approver." },
        { id: "tl-0038-3", time: "2026-08-26 11:18", user: "Maya Nasser", title: "Approved", note: "Approved as requested." },
        { id: "tl-0038-4", time: "2026-08-27 08:50", user: "Nour Khoury", title: "Fully Issued", note: "All approved quantities issued." }
      ]
    },
    {
      id: "MR-NTH-2026-0024",
      requester: "Yazan Rafiq",
      department: "OSP Maintenance",
      approver: "Leen Qasem",
      warehouseId: "north",
      targetArea: "Demo North Repair Tickets",
      status: "Draft",
      requestDate: "2026-08-29 08:05",
      requiredDate: "2026-09-01",
      notes: "Draft request under preparation by field supervisor.",
      items: [
        { materialId: "closure", requested: 4, approved: 0, issued: 0 },
        { materialId: "fiber-12f", requested: 250, approved: 0, issued: 0 }
      ],
      timeline: [
        { id: "tl-0024-1", time: "2026-08-29 08:05", user: "Yazan Rafiq", title: "Created", note: "Draft opened for repair materials." }
      ]
    },
    {
      id: "MR-STH-2026-0016",
      requester: "Dina Faris",
      department: "South Field Team",
      approver: "Rana Mansour",
      warehouseId: "south",
      targetArea: "Demo South Zone C",
      status: "Cancelled",
      requestDate: "2026-08-25 14:30",
      requiredDate: "2026-08-28",
      notes: "Cancelled after work pack was merged with another field request.",
      items: [
        { materialId: "fiber-12f", requested: 400, approved: 0, issued: 0 },
        { materialId: "splitter-116", requested: 8, approved: 0, issued: 0 }
      ],
      timeline: [
        { id: "tl-0016-1", time: "2026-08-25 14:30", user: "Dina Faris", title: "Created", note: "MR created for South Zone C." },
        { id: "tl-0016-2", time: "2026-08-25 15:10", user: "Dina Faris", title: "Cancelled", note: "Cancelled due to duplicated field request." }
      ]
    }
  ],
  movements: [
    { id: "MOV-2026-0188", reference: "GRN-CEN-0088", type: "Receive", materialId: "drop-cable", quantity: 1200, to: "central", destination: "Central Warehouse", actor: "Fadi Salem", time: "2026-08-29 08:35", note: "Demo supplier receipt posted after count verification." },
    { id: "MOV-2026-0187", reference: "ISS-NTH-0062", type: "Issue", materialId: "drop-cable", quantity: 500, from: "north", destination: "North Field Team", requestId: "MR-NTH-2026-0027", actor: "Fadi Salem", time: "2026-08-28 08:20", note: "Partial issue against approved MR." },
    { id: "MOV-2026-0186", reference: "ISS-NTH-0061", type: "Issue", materialId: "adapter", quantity: 120, from: "north", destination: "North Field Team", requestId: "MR-NTH-2026-0027", actor: "Fadi Salem", time: "2026-08-28 08:18", note: "Issued for activation kits." },
    { id: "MOV-2026-0185", reference: "TRF-CEN-NTH-0021", type: "Transfer", materialId: "ont", quantity: 24, from: "central", to: "north", destination: "Field Warehouse North", actor: "Nour Khoury", time: "2026-08-28 07:50", note: "Transfer to support North activation backlog." },
    { id: "MOV-2026-0184", reference: "RTN-STH-0012", type: "Return", materialId: "patch-cord", quantity: 18, to: "south", destination: "Field Warehouse South", actor: "Kareem Zaid", time: "2026-08-27 16:10", note: "Unused material returned by demo technician team." },
    { id: "MOV-2026-0183", reference: "ISS-CEN-0055", type: "Issue", materialId: "ont", quantity: 18, from: "central", destination: "Activation Support", requestId: "MR-CEN-2026-0038", actor: "Nour Khoury", time: "2026-08-27 08:50", note: "Full issue against activation request." },
    { id: "MOV-2026-0182", reference: "ISS-CEN-0054", type: "Issue", materialId: "patch-cord", quantity: 36, from: "central", destination: "Activation Support", requestId: "MR-CEN-2026-0038", actor: "Nour Khoury", time: "2026-08-27 08:48", note: "Issued with ONT activation bundle." }
  ]
};
