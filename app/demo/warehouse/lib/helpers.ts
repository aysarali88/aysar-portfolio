import { materials, warehouses } from "./data";
import type { DemoState, MaterialRequest, Movement, MovementType, WarehouseId } from "./types";

export function cloneInitialState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getMaterial(id: string) {
  return materials.find((material) => material.id === id) ?? materials[0];
}

export function totalMaterialStock(state: DemoState, materialId: string) {
  const stock = state.stock[materialId];
  return Object.values(stock).reduce((sum, quantity) => sum + quantity, 0);
}

export function stockStatus(state: DemoState, materialId: string, warehouseId: WarehouseId) {
  const material = getMaterial(materialId);
  const quantity = state.stock[materialId][warehouseId];

  if (quantity <= material.reorderLevel * 0.35) {
    return "Critical";
  }

  if (quantity <= material.reorderLevel) {
    return "Low";
  }

  return "Available";
}

export function warehouseName(id?: WarehouseId) {
  return id ? warehouses[id] : "Field / External";
}

export function nowLabel() {
  return new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function nextRequestId(count: number) {
  return `MR-DEMO-${String(count + 1).padStart(3, "0")}`;
}

export function nextMovementId(count: number) {
  return `MOV-DEMO-${String(count + 1).padStart(3, "0")}`;
}

export function movementTitle(type: MovementType) {
  const titles: Record<MovementType, string> = {
    Received: "Material received",
    Issued: "Material issued",
    Returned: "Material returned",
    Transferred: "Warehouse transfer"
  };
  return titles[type];
}

export function requestTotals(request: MaterialRequest) {
  const requested = request.items.reduce((sum, item) => sum + item.quantity, 0);
  const issued = request.items.reduce((sum, item) => sum + item.issued, 0);
  return { requested, issued, remaining: requested - issued };
}

export function movementMatchesRequest(movement: Movement, requestId: string) {
  return movement.requestId === requestId;
}
