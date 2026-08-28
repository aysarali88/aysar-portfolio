export type WarehouseId = "central" | "north" | "south";

export type MaterialCategory = "Cable" | "CPE" | "Splitter" | "Passive" | "Accessory";

export type Material = {
  id: string;
  name: string;
  unit: string;
  category: MaterialCategory;
  reorderLevel: number;
};

export type Stock = Record<string, Record<WarehouseId, number>>;

export type RequestStatus =
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Partially Issued"
  | "Issued"
  | "Closed";

export type RequestItem = {
  materialId: string;
  quantity: number;
  issued: number;
};

export type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  note: string;
};

export type MaterialRequest = {
  id: string;
  requester: string;
  approver: string;
  warehouseId: WarehouseId;
  targetArea: string;
  status: RequestStatus;
  createdAt: string;
  items: RequestItem[];
  timeline: TimelineEvent[];
};

export type MovementType = "Received" | "Issued" | "Returned" | "Transferred";

export type Movement = {
  id: string;
  type: MovementType;
  materialId: string;
  quantity: number;
  from?: WarehouseId;
  to?: WarehouseId;
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
