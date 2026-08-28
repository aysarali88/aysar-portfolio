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
  return Object.values(stock).reduce((sum, level) => sum + level.onHand, 0);
}

export function totalAvailableStock(state: DemoState, materialId: string) {
  const stock = state.stock[materialId];
  return Object.values(stock).reduce((sum, level) => sum + availableStock(level.onHand, level.reserved), 0);
}

export function availableStock(onHand: number, reserved: number) {
  return Math.max(0, onHand - reserved);
}

export function stockStatus(state: DemoState, materialId: string, warehouseId: WarehouseId) {
  const level = state.stock[materialId][warehouseId];
  const available = availableStock(level.onHand, level.reserved);

  if (level.onHand <= 0) {
    return "Out of Stock";
  }

  if (available <= 0 || level.onHand <= level.lowThreshold * 0.4) {
    return "Critical";
  }

  if (available <= level.lowThreshold || level.onHand <= level.lowThreshold) {
    return "Low Stock";
  }

  return "In Stock";
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
  return `MR-CEN-2026-${String(50 + count).padStart(4, "0")}`;
}

export function nextMovementId(count: number) {
  return `MOV-2026-${String(200 + count).padStart(4, "0")}`;
}

export function nextMovementReference(type: MovementType, count: number) {
  const prefixes: Record<MovementType, string> = {
    Receive: "GRN",
    Issue: "ISS",
    Return: "RTN",
    Transfer: "TRF"
  };
  return `${prefixes[type]}-DEMO-${String(count + 1).padStart(4, "0")}`;
}

export function movementTitle(type: MovementType) {
  const titles: Record<MovementType, string> = {
    Receive: "Material received",
    Issue: "Material issued",
    Return: "Material returned",
    Transfer: "Warehouse transfer"
  };
  return titles[type];
}

export function requestTotals(request: MaterialRequest) {
  const requested = request.items.reduce((sum, item) => sum + item.requested, 0);
  const approved = request.items.reduce((sum, item) => sum + item.approved, 0);
  const issued = request.items.reduce((sum, item) => sum + item.issued, 0);
  return { requested, approved, issued, remaining: approved - issued };
}

export function movementMatchesRequest(movement: Movement, requestId: string) {
  return movement.requestId === requestId;
}
