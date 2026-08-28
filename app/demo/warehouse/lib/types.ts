export type WarehouseId = "central" | "north" | "south";

export type MaterialCategory = "Cable" | "CPE" | "Splitter" | "Passive" | "Accessory";

export type Material = {
  id: string;
  code: string;
  name: string;
  unit: string;
  category: MaterialCategory;
  reorderLevel: number;
};

export type StockLevel = {
  onHand: number;
  reserved: number;
  lowThreshold: number;
};

export type Stock = Record<string, Record<WarehouseId, StockLevel>>;

export type RequestStatus =
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Partially Issued"
  | "Issued"
  | "Cancelled";

export type RequestItem = {
  materialId: string;
  requested: number;
  approved: number;
  issued: number;
  notes?: string;
};

export type TimelineEvent = {
  id: string;
  time: string;
  user: string;
  title: string;
  note: string;
};

export type MaterialRequest = {
  id: string;
  requester: string;
  department: string;
  approver: string;
  warehouseId: WarehouseId;
  targetArea: string;
  status: RequestStatus;
  requestDate: string;
  requiredDate: string;
  notes: string;
  items: RequestItem[];
  timeline: TimelineEvent[];
};

export type MovementType = "Receive" | "Issue" | "Return" | "Transfer";

export type Movement = {
  id: string;
  reference: string;
  type: MovementType;
  materialId: string;
  quantity: number;
  from?: WarehouseId;
  to?: WarehouseId;
  destination?: string;
  requestId?: string;
  actor: string;
  time: string;
  note: string;
};

export type DemoState = {
  stock: Stock;
  requests: MaterialRequest[];
  movements: Movement[];
};

export type PageKey = "dashboard" | "request" | "inventory" | "movements" | "history";
