import type { DemoState, Material, WarehouseId } from "./types";

export const warehouses: Record<WarehouseId, string> = {
  central: "Central Warehouse",
  north: "Field Warehouse North",
  south: "Field Warehouse South"
};

export const materials: Material[] = [
  { id: "fiber-12f", name: "Fiber Cable 12F", unit: "m", category: "Cable", reorderLevel: 500 },
  { id: "fiber-24f", name: "Fiber Cable 24F", unit: "m", category: "Cable", reorderLevel: 420 },
  { id: "ont", name: "ONT", unit: "pcs", category: "CPE", reorderLevel: 35 },
  { id: "splitter-18", name: "Splitter 1:8", unit: "pcs", category: "Splitter", reorderLevel: 25 },
  { id: "splitter-116", name: "Splitter 1:16", unit: "pcs", category: "Splitter", reorderLevel: 20 },
  { id: "odb-fat", name: "ODB / FAT", unit: "pcs", category: "Passive", reorderLevel: 18 },
  { id: "closure", name: "Fiber Closure", unit: "pcs", category: "Passive", reorderLevel: 16 },
  { id: "patch-cord", name: "Patch Cord", unit: "pcs", category: "Accessory", reorderLevel: 90 },
  { id: "adapter", name: "Adapter SC/APC", unit: "pcs", category: "Accessory", reorderLevel: 110 },
  { id: "pigtail", name: "Pigtail", unit: "pcs", category: "Accessory", reorderLevel: 130 },
  { id: "drop-cable", name: "Drop Cable", unit: "m", category: "Cable", reorderLevel: 600 }
];

export const initialState: DemoState = {
  stock: {
    "fiber-12f": { central: 4200, north: 900, south: 780 },
    "fiber-24f": { central: 3200, north: 640, south: 510 },
    ont: { central: 180, north: 45, south: 32 },
    "splitter-18": { central: 95, north: 22, south: 18 },
    "splitter-116": { central: 80, north: 14, south: 11 },
    "odb-fat": { central: 72, north: 16, south: 14 },
    closure: { central: 55, north: 13, south: 10 },
    "patch-cord": { central: 520, north: 140, south: 120 },
    adapter: { central: 760, north: 210, south: 180 },
    pigtail: { central: 680, north: 190, south: 170 },
    "drop-cable": { central: 5400, north: 1150, south: 980 }
  },
  requests: [
    {
      id: "MR-2408-001",
      requester: "Demo Field Coordinator",
      approver: "Demo Operations Lead",
      warehouseId: "north",
      targetArea: "North Zone A",
      status: "Partially Issued",
      createdAt: "2026-08-24 09:15",
      items: [
        { materialId: "fiber-12f", quantity: 600, issued: 400 },
        { materialId: "odb-fat", quantity: 8, issued: 8 },
        { materialId: "adapter", quantity: 80, issued: 50 }
      ],
      timeline: [
        {
          id: "tl-1",
          time: "2026-08-24 09:15",
          title: "Material request created",
          note: "Demo request prepared for North Zone A."
        },
        {
          id: "tl-2",
          time: "2026-08-24 10:20",
          title: "Request submitted",
          note: "Submitted for warehouse approval."
        },
        {
          id: "tl-3",
          time: "2026-08-24 12:05",
          title: "Request approved",
          note: "Approved by Demo Operations Lead."
        },
        {
          id: "tl-4",
          time: "2026-08-25 08:40",
          title: "Partial issue completed",
          note: "Warehouse issued available quantities for field execution."
        }
      ]
    }
  ],
  movements: [
    {
      id: "MOV-001",
      type: "Issued",
      materialId: "fiber-12f",
      quantity: 400,
      from: "north",
      requestId: "MR-2408-001",
      actor: "Demo Warehouse Officer",
      time: "2026-08-25 08:40",
      note: "Partial issue for North Zone A."
    },
    {
      id: "MOV-002",
      type: "Issued",
      materialId: "odb-fat",
      quantity: 8,
      from: "north",
      requestId: "MR-2408-001",
      actor: "Demo Warehouse Officer",
      time: "2026-08-25 08:42",
      note: "Issued for field installation."
    }
  ]
};
