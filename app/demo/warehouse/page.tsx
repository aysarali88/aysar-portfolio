"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { initialState, materials, warehouses } from "./lib/data";
import {
  cloneInitialState,
  getMaterial,
  movementMatchesRequest,
  movementTitle,
  nextMovementId,
  nextRequestId,
  nowLabel,
  requestTotals,
  stockStatus,
  totalMaterialStock,
  warehouseName
} from "./lib/helpers";
import type {
  DemoState,
  MaterialRequest,
  Movement,
  MovementType,
  PageKey,
  RequestItem,
  RequestStatus,
  WarehouseId
} from "./lib/types";
import styles from "./warehouse.module.css";

const pages: Array<{ key: PageKey; label: string; icon: string }> = [
  { key: "dashboard", label: "Inventory Dashboard", icon: "DB" },
  { key: "request", label: "Material Request", icon: "MR" },
  { key: "inventory", label: "Inventory", icon: "IN" },
  { key: "movements", label: "Movements", icon: "MV" },
  { key: "history", label: "MR History", icon: "HS" }
];

const statusTone: Record<RequestStatus, string> = {
  Draft: "neutral",
  Submitted: "info",
  Approved: "success",
  "Partially Issued": "warning",
  Issued: "success",
  Closed: "neutral"
};

const movementTypes: MovementType[] = ["Received", "Issued", "Returned", "Transferred"];

const blankRequest = {
  requester: "Demo Field Coordinator",
  approver: "Demo Operations Lead",
  warehouseId: "central" as WarehouseId,
  targetArea: "Demo FTTH Area",
  materialId: "fiber-12f",
  quantity: 100
};

const blankMovement = {
  materialId: "drop-cable",
  quantity: 100,
  from: "central" as WarehouseId,
  to: "north" as WarehouseId
};

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className={styles.fieldLabel}>{children}</label>;
}

export default function WarehouseDemoPage() {
  const [state, setState] = useState<DemoState>(() => cloneInitialState(initialState));
  const [activePage, setActivePage] = useState<PageKey>("dashboard");
  const [selectedRequestId, setSelectedRequestId] = useState(state.requests[0]?.id ?? "");
  const [selectedMaterialId, setSelectedMaterialId] = useState("fiber-12f");
  const [movementFilter, setMovementFilter] = useState<MovementType | "All">("All");
  const [warehouseFilter, setWarehouseFilter] = useState<WarehouseId | "all">("all");
  const [requestForm, setRequestForm] = useState(blankRequest);
  const [movementForm, setMovementForm] = useState(blankMovement);

  const selectedRequest = useMemo(
    () => state.requests.find((request) => request.id === selectedRequestId) ?? state.requests[0],
    [selectedRequestId, state.requests]
  );

  const dashboardStats = useMemo(() => {
    const totalStock = materials.reduce(
      (sum, material) => sum + totalMaterialStock(state, material.id),
      0
    );
    const openRequests = state.requests.filter((request) => request.status !== "Closed").length;
    const lowItems = materials.filter((material) =>
      Object.keys(warehouses).some(
        (warehouseId) =>
          stockStatus(state, material.id, warehouseId as WarehouseId) !== "Available"
      )
    ).length;

    return { totalStock, openRequests, lowItems, movements: state.movements.length };
  }, [state]);

  function resetDemoData() {
    const resetState = cloneInitialState(initialState);
    setState(resetState);
    setSelectedRequestId(resetState.requests[0]?.id ?? "");
    setSelectedMaterialId("fiber-12f");
    setMovementFilter("All");
    setWarehouseFilter("all");
  }

  function addTimeline(request: MaterialRequest, title: string, note: string): MaterialRequest {
    return {
      ...request,
      timeline: [
        ...request.timeline,
        { id: `tl-${request.id}-${request.timeline.length + 1}`, time: nowLabel(), title, note }
      ]
    };
  }

  function createMaterialRequest() {
    setState((current) => {
      const request: MaterialRequest = {
        id: nextRequestId(current.requests.length),
        requester: requestForm.requester,
        approver: requestForm.approver,
        warehouseId: requestForm.warehouseId,
        targetArea: requestForm.targetArea,
        status: "Draft",
        createdAt: nowLabel(),
        items: [
          {
            materialId: requestForm.materialId,
            quantity: Math.max(1, Number(requestForm.quantity)),
            issued: 0
          }
        ],
        timeline: [
          {
            id: "tl-created",
            time: nowLabel(),
            title: "Material request created",
            note: "Draft request created with sample FTTH data."
          }
        ]
      };

      setSelectedRequestId(request.id);
      setActivePage("request");
      return { ...current, requests: [request, ...current.requests] };
    });
  }

  function addMaterialToSelectedRequest() {
    if (!selectedRequest) {
      return;
    }

    setState((current) => ({
      ...current,
      requests: current.requests.map((request) => {
        if (request.id !== selectedRequest.id || request.status !== "Draft") {
          return request;
        }

        const existing = request.items.find((item) => item.materialId === requestForm.materialId);
        const quantity = Math.max(1, Number(requestForm.quantity));
        const items = existing
          ? request.items.map((item) =>
              item.materialId === requestForm.materialId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          : [...request.items, { materialId: requestForm.materialId, quantity, issued: 0 }];

        return addTimeline(
          { ...request, items },
          "Material added",
          `${getMaterial(requestForm.materialId).name} added to the draft request.`
        );
      })
    }));
  }

  function updateRequestStatus(requestId: string, status: RequestStatus) {
    const titleByStatus: Partial<Record<RequestStatus, string>> = {
      Submitted: "Request submitted",
      Approved: "Request approved",
      Closed: "Request closed"
    };

    setState((current) => ({
      ...current,
      requests: current.requests.map((request) =>
        request.id === requestId
          ? addTimeline(
              { ...request, status },
              titleByStatus[status] ?? "Request updated",
              `${request.id} moved to ${status}.`
            )
          : request
      )
    }));
  }

  function addMovement(current: DemoState, movement: Omit<Movement, "id" | "time">) {
    return [
      {
        ...movement,
        id: nextMovementId(current.movements.length),
        time: nowLabel()
      },
      ...current.movements
    ];
  }

  function issueRequest(requestId: string, partial: boolean) {
    setState((current) => {
      const nextStock = cloneInitialState(current.stock);
      let nextMovements = current.movements;

      const nextRequests = current.requests.map((request) => {
        if (request.id !== requestId || !["Approved", "Partially Issued"].includes(request.status)) {
          return request;
        }

        const issuedNotes: string[] = [];
        const items: RequestItem[] = request.items.map((item) => {
          const remaining = item.quantity - item.issued;
          const available = nextStock[item.materialId][request.warehouseId];
          const plannedIssue = partial ? Math.ceil(remaining / 2) : remaining;
          const quantity = Math.max(0, Math.min(plannedIssue, available));

          if (quantity <= 0) {
            return item;
          }

          nextStock[item.materialId][request.warehouseId] -= quantity;
          nextMovements = addMovement(
            { ...current, movements: nextMovements },
            {
              type: "Issued",
              materialId: item.materialId,
              quantity,
              from: request.warehouseId,
              requestId: request.id,
              actor: "Demo Warehouse Officer",
              note: `${getMaterial(item.materialId).name} issued against ${request.id}.`
            }
          );
          issuedNotes.push(`${quantity} ${getMaterial(item.materialId).unit} ${getMaterial(item.materialId).name}`);
          return { ...item, issued: item.issued + quantity };
        });

        const totals = requestTotals({ ...request, items });
        const status: RequestStatus = totals.remaining > 0 ? "Partially Issued" : "Issued";
        return addTimeline(
          { ...request, items, status },
          partial ? "Partial issue completed" : "Material issue completed",
          issuedNotes.length > 0 ? issuedNotes.join(", ") : "No stock was available for issue."
        );
      });

      return { stock: nextStock, movements: nextMovements, requests: nextRequests };
    });
  }

  function createMovement(type: MovementType) {
    setState((current) => {
      const quantity = Math.max(1, Number(movementForm.quantity));
      const materialId = movementForm.materialId;
      const nextStock = cloneInitialState(current.stock);
      const from = movementForm.from;
      const to = movementForm.to;

      if (type === "Transferred" && from === to) {
        return current;
      }

      if (type === "Issued" || type === "Transferred") {
        nextStock[materialId][from] = Math.max(0, nextStock[materialId][from] - quantity);
      }

      if (type === "Returned" || type === "Received") {
        nextStock[materialId][to] += quantity;
      }

      if (type === "Transferred") {
        nextStock[materialId][to] += quantity;
      }

      return {
        ...current,
        stock: nextStock,
        movements: addMovement(current, {
          type,
          materialId,
          quantity,
          from: type === "Received" || type === "Returned" ? undefined : from,
          to: type === "Issued" ? undefined : to,
          actor: "Demo Warehouse Officer",
          note: `${movementTitle(type)} using demo sample data.`
        })
      };
    });
  }

  const filteredMovements = state.movements.filter(
    (movement) => movementFilter === "All" || movement.type === movementFilter
  );

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.backLink} href="/#projects">
          Back to Portfolio
        </Link>
        <div className={styles.productMark}>
          <span>FT</span>
          <div>
            <strong>FTTH Warehouse</strong>
            <small>Material Control Demo</small>
          </div>
        </div>
        <nav className={styles.demoNav} aria-label="Warehouse demo pages">
          {pages.map((page) => (
            <button
              className={activePage === page.key ? styles.activeNav : ""}
              key={page.key}
              onClick={() => setActivePage(page.key)}
              type="button"
            >
              <span>{page.icon}</span>
              {page.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div>
            <Badge tone="warning">Demo Environment - Sample Data Only</Badge>
            <h1>{pages.find((page) => page.key === activePage)?.label}</h1>
          </div>
          <button className={styles.resetButton} onClick={resetDemoData} type="button">
            Reset Demo Data
          </button>
        </header>

        {activePage === "dashboard" ? (
          <DashboardPage stats={dashboardStats} state={state} setActivePage={setActivePage} />
        ) : null}

        {activePage === "request" ? (
          <MaterialRequestPage
            addMaterialToSelectedRequest={addMaterialToSelectedRequest}
            approveRequest={(id) => updateRequestStatus(id, "Approved")}
            createMaterialRequest={createMaterialRequest}
            issueRequest={issueRequest}
            requestForm={requestForm}
            selectedRequest={selectedRequest}
            setRequestForm={setRequestForm}
            setSelectedRequestId={setSelectedRequestId}
            state={state}
            submitRequest={(id) => updateRequestStatus(id, "Submitted")}
          />
        ) : null}

        {activePage === "inventory" ? (
          <InventoryPage
            selectedMaterialId={selectedMaterialId}
            setSelectedMaterialId={setSelectedMaterialId}
            state={state}
            warehouseFilter={warehouseFilter}
            setWarehouseFilter={setWarehouseFilter}
          />
        ) : null}

        {activePage === "movements" ? (
          <MovementsPage
            createMovement={createMovement}
            filteredMovements={filteredMovements}
            movementFilter={movementFilter}
            movementForm={movementForm}
            setMovementFilter={setMovementFilter}
            setMovementForm={setMovementForm}
          />
        ) : null}

        {activePage === "history" ? (
          <HistoryPage
            selectedRequest={selectedRequest}
            setSelectedRequestId={setSelectedRequestId}
            state={state}
          />
        ) : null}
      </section>
    </main>
  );
}

function DashboardPage({
  stats,
  state,
  setActivePage
}: {
  stats: { totalStock: number; openRequests: number; lowItems: number; movements: number };
  state: DemoState;
  setActivePage: (page: PageKey) => void;
}) {
  const recentMovements = state.movements.slice(0, 5);

  return (
    <div className={styles.pageStack}>
      <section className={styles.kpiGrid}>
        <article>
          <span>Total Demo Stock</span>
          <strong>{stats.totalStock.toLocaleString()}</strong>
          <small>Across all sample warehouses</small>
        </article>
        <article>
          <span>Open MRs</span>
          <strong>{stats.openRequests}</strong>
          <small>Draft, submitted, approved, issued flow</small>
        </article>
        <article>
          <span>Stock Watch</span>
          <strong>{stats.lowItems}</strong>
          <small>Items below warehouse reorder level</small>
        </article>
        <article>
          <span>Movement Records</span>
          <strong>{stats.movements}</strong>
          <small>Received, issued, returned, transferred</small>
        </article>
      </section>

      <section className={styles.dashboardGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Warehouse Stock Overview</h2>
            <button onClick={() => setActivePage("inventory")} type="button">
              Open Inventory
            </button>
          </div>
          <div className={styles.stockBars}>
            {materials.slice(0, 7).map((material) => {
              const total = totalMaterialStock(state, material.id);
              const max = Math.max(...materials.map((item) => totalMaterialStock(state, item.id)));
              return (
                <div className={styles.stockBar} key={material.id}>
                  <span>{material.name}</span>
                  <div>
                    <i style={{ width: `${Math.max(8, (total / max) * 100)}%` }} />
                  </div>
                  <strong>{total.toLocaleString()}</strong>
                </div>
              );
            })}
          </div>
        </article>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Recent Activity</h2>
            <button onClick={() => setActivePage("movements")} type="button">
              View Movements
            </button>
          </div>
          <div className={styles.activityList}>
            {recentMovements.map((movement) => (
              <div key={movement.id}>
                <Badge tone={movement.type === "Issued" ? "info" : "success"}>{movement.type}</Badge>
                <strong>{getMaterial(movement.materialId).name}</strong>
                <span>
                  {movement.quantity} {getMaterial(movement.materialId).unit} - {movement.time}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function MaterialRequestPage({
  state,
  selectedRequest,
  requestForm,
  setRequestForm,
  setSelectedRequestId,
  createMaterialRequest,
  addMaterialToSelectedRequest,
  submitRequest,
  approveRequest,
  issueRequest
}: {
  state: DemoState;
  selectedRequest?: MaterialRequest;
  requestForm: typeof blankRequest;
  setRequestForm: (form: typeof blankRequest) => void;
  setSelectedRequestId: (id: string) => void;
  createMaterialRequest: () => void;
  addMaterialToSelectedRequest: () => void;
  submitRequest: (id: string) => void;
  approveRequest: (id: string) => void;
  issueRequest: (id: string, partial: boolean) => void;
}) {
  return (
    <div className={styles.twoColumn}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Create MR</h2>
          <Badge>Draft Screen</Badge>
        </div>
        <div className={styles.formGrid}>
          <FieldLabel>
            Requester
            <input
              value={requestForm.requester}
              onChange={(event) => setRequestForm({ ...requestForm, requester: event.target.value })}
            />
          </FieldLabel>
          <FieldLabel>
            Approver
            <input
              value={requestForm.approver}
              onChange={(event) => setRequestForm({ ...requestForm, approver: event.target.value })}
            />
          </FieldLabel>
          <FieldLabel>
            Warehouse
            <select
              value={requestForm.warehouseId}
              onChange={(event) =>
                setRequestForm({ ...requestForm, warehouseId: event.target.value as WarehouseId })
              }
            >
              {Object.entries(warehouses).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel>
            Target Area
            <input
              value={requestForm.targetArea}
              onChange={(event) => setRequestForm({ ...requestForm, targetArea: event.target.value })}
            />
          </FieldLabel>
          <FieldLabel>
            Material
            <select
              value={requestForm.materialId}
              onChange={(event) => setRequestForm({ ...requestForm, materialId: event.target.value })}
            >
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel>
            Quantity
            <input
              min="1"
              type="number"
              value={requestForm.quantity}
              onChange={(event) =>
                setRequestForm({ ...requestForm, quantity: Number(event.target.value) })
              }
            />
          </FieldLabel>
        </div>
        <div className={styles.actionRow}>
          <button className={styles.primaryButton} onClick={createMaterialRequest} type="button">
            Create Material Request
          </button>
          <button onClick={addMaterialToSelectedRequest} type="button">
            Add Material to Draft
          </button>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>MR Details</h2>
          <select
            value={selectedRequest?.id ?? ""}
            onChange={(event) => setSelectedRequestId(event.target.value)}
          >
            {state.requests.map((request) => (
              <option key={request.id} value={request.id}>
                {request.id}
              </option>
            ))}
          </select>
        </div>
        {selectedRequest ? (
          <RequestDetails
            approveRequest={approveRequest}
            issueRequest={issueRequest}
            request={selectedRequest}
            submitRequest={submitRequest}
          />
        ) : null}
      </section>
    </div>
  );
}

function RequestDetails({
  request,
  submitRequest,
  approveRequest,
  issueRequest
}: {
  request: MaterialRequest;
  submitRequest: (id: string) => void;
  approveRequest: (id: string) => void;
  issueRequest: (id: string, partial: boolean) => void;
}) {
  const totals = requestTotals(request);

  return (
    <div className={styles.detailStack}>
      <div className={styles.detailMeta}>
        <Badge tone={statusTone[request.status]}>{request.status}</Badge>
        <span>{request.targetArea}</span>
        <span>{warehouseName(request.warehouseId)}</span>
      </div>
      <div className={styles.miniStats}>
        <span>Requested: {totals.requested}</span>
        <span>Issued: {totals.issued}</span>
        <span>Remaining: {totals.remaining}</span>
      </div>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Material</th>
              <th>Requested</th>
              <th>Issued</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {request.items.map((item) => (
              <tr key={item.materialId}>
                <td>{getMaterial(item.materialId).name}</td>
                <td>{item.quantity}</td>
                <td>{item.issued}</td>
                <td>{item.quantity - item.issued}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.actionRow}>
        <button disabled={request.status !== "Draft"} onClick={() => submitRequest(request.id)} type="button">
          Submit MR
        </button>
        <button
          disabled={request.status !== "Submitted"}
          onClick={() => approveRequest(request.id)}
          type="button"
        >
          Approve MR
        </button>
        <button
          disabled={!["Approved", "Partially Issued"].includes(request.status)}
          onClick={() => issueRequest(request.id, true)}
          type="button"
        >
          Partial Issue
        </button>
        <button
          disabled={!["Approved", "Partially Issued"].includes(request.status)}
          onClick={() => issueRequest(request.id, false)}
          type="button"
        >
          Issue Remaining
        </button>
      </div>
      <Timeline events={request.timeline} />
    </div>
  );
}

function InventoryPage({
  state,
  selectedMaterialId,
  setSelectedMaterialId,
  warehouseFilter,
  setWarehouseFilter
}: {
  state: DemoState;
  selectedMaterialId: string;
  setSelectedMaterialId: (id: string) => void;
  warehouseFilter: WarehouseId | "all";
  setWarehouseFilter: (id: WarehouseId | "all") => void;
}) {
  const selectedMaterial = getMaterial(selectedMaterialId);
  const relatedMovements = state.movements.filter((movement) => movement.materialId === selectedMaterialId);

  return (
    <div className={styles.twoColumnWide}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Inventory List</h2>
          <select value={warehouseFilter} onChange={(event) => setWarehouseFilter(event.target.value as WarehouseId | "all")}>
            <option value="all">All Warehouses</option>
            {Object.entries(warehouses).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.flatMap((material) =>
                Object.entries(state.stock[material.id])
                  .filter(([warehouseId]) => warehouseFilter === "all" || warehouseFilter === warehouseId)
                  .map(([warehouseId, quantity]) => (
                    <tr
                      className={selectedMaterialId === material.id ? styles.selectedRow : ""}
                      key={`${material.id}-${warehouseId}`}
                      onClick={() => setSelectedMaterialId(material.id)}
                    >
                      <td>{material.name}</td>
                      <td>{material.category}</td>
                      <td>{warehouseName(warehouseId as WarehouseId)}</td>
                      <td>
                        {quantity.toLocaleString()} {material.unit}
                      </td>
                      <td>
                        <Badge
                          tone={
                            stockStatus(state, material.id, warehouseId as WarehouseId) === "Available"
                              ? "success"
                              : "warning"
                          }
                        >
                          {stockStatus(state, material.id, warehouseId as WarehouseId)}
                        </Badge>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Item Details</h2>
          <Badge>{selectedMaterial.category}</Badge>
        </div>
        <div className={styles.itemCard}>
          <strong>{selectedMaterial.name}</strong>
          <span>Unit: {selectedMaterial.unit}</span>
          <span>Reorder level: {selectedMaterial.reorderLevel}</span>
          <span>Total stock: {totalMaterialStock(state, selectedMaterial.id).toLocaleString()}</span>
        </div>
        <h3>Warehouse Stock</h3>
        <div className={styles.warehouseStack}>
          {Object.entries(state.stock[selectedMaterial.id]).map(([warehouseId, quantity]) => (
            <div key={warehouseId}>
              <span>{warehouseName(warehouseId as WarehouseId)}</span>
              <strong>
                {quantity.toLocaleString()} {selectedMaterial.unit}
              </strong>
            </div>
          ))}
        </div>
        <h3>Item Movement History</h3>
        <CompactMovements movements={relatedMovements} />
      </section>
    </div>
  );
}

function MovementsPage({
  movementFilter,
  setMovementFilter,
  movementForm,
  setMovementForm,
  createMovement,
  filteredMovements
}: {
  movementFilter: MovementType | "All";
  setMovementFilter: (type: MovementType | "All") => void;
  movementForm: typeof blankMovement;
  setMovementForm: (form: typeof blankMovement) => void;
  createMovement: (type: MovementType) => void;
  filteredMovements: Movement[];
}) {
  return (
    <div className={styles.twoColumn}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Movement Actions</h2>
          <Badge>Sample Data</Badge>
        </div>
        <div className={styles.formGrid}>
          <FieldLabel>
            Material
            <select
              value={movementForm.materialId}
              onChange={(event) => setMovementForm({ ...movementForm, materialId: event.target.value })}
            >
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel>
            Quantity
            <input
              min="1"
              type="number"
              value={movementForm.quantity}
              onChange={(event) =>
                setMovementForm({ ...movementForm, quantity: Number(event.target.value) })
              }
            />
          </FieldLabel>
          <FieldLabel>
            From
            <select
              value={movementForm.from}
              onChange={(event) =>
                setMovementForm({ ...movementForm, from: event.target.value as WarehouseId })
              }
            >
              {Object.entries(warehouses).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel>
            To
            <select
              value={movementForm.to}
              onChange={(event) =>
                setMovementForm({ ...movementForm, to: event.target.value as WarehouseId })
              }
            >
              {Object.entries(warehouses).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </FieldLabel>
        </div>
        <div className={styles.actionRow}>
          {movementTypes.map((type) => (
            <button key={type} onClick={() => createMovement(type)} type="button">
              {type}
            </button>
          ))}
        </div>
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Movement Details</h2>
          <select
            value={movementFilter}
            onChange={(event) => setMovementFilter(event.target.value as MovementType | "All")}
          >
            <option value="All">All Types</option>
            {movementTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <CompactMovements movements={filteredMovements} />
      </section>
    </div>
  );
}

function HistoryPage({
  state,
  selectedRequest,
  setSelectedRequestId
}: {
  state: DemoState;
  selectedRequest?: MaterialRequest;
  setSelectedRequestId: (id: string) => void;
}) {
  const relatedMovements = selectedRequest
    ? state.movements.filter((movement) => movementMatchesRequest(movement, selectedRequest.id))
    : [];

  return (
    <div className={styles.twoColumnWide}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>MR List</h2>
          <Badge>{state.requests.length} Requests</Badge>
        </div>
        <div className={styles.requestList}>
          {state.requests.map((request) => (
            <button key={request.id} onClick={() => setSelectedRequestId(request.id)} type="button">
              <strong>{request.id}</strong>
              <span>{request.requester}</span>
              <Badge tone={statusTone[request.status]}>{request.status}</Badge>
            </button>
          ))}
        </div>
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>MR History Details</h2>
          {selectedRequest ? <Badge tone={statusTone[selectedRequest.status]}>{selectedRequest.status}</Badge> : null}
        </div>
        {selectedRequest ? (
          <div className={styles.detailStack}>
            <div className={styles.itemCard}>
              <strong>{selectedRequest.id}</strong>
              <span>Requester: {selectedRequest.requester}</span>
              <span>Approver: {selectedRequest.approver}</span>
              <span>Warehouse: {warehouseName(selectedRequest.warehouseId)}</span>
              <span>Created: {selectedRequest.createdAt}</span>
            </div>
            <RequestDetails
              approveRequest={() => undefined}
              issueRequest={() => undefined}
              request={selectedRequest}
              submitRequest={() => undefined}
            />
            <h3>Linked Movement Records</h3>
            <CompactMovements movements={relatedMovements} />
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Timeline({ events }: { events: MaterialRequest["timeline"] }) {
  return (
    <div className={styles.timeline}>
      <h3>Request Timeline</h3>
      {events.map((event) => (
        <div key={event.id}>
          <span>{event.time}</span>
          <strong>{event.title}</strong>
          <p>{event.note}</p>
        </div>
      ))}
    </div>
  );
}

function CompactMovements({ movements }: { movements: Movement[] }) {
  if (movements.length === 0) {
    return <p className={styles.emptyState}>No movement records for this view yet.</p>;
  }

  return (
    <div className={styles.movementStack}>
      {movements.map((movement) => (
        <article key={movement.id}>
          <Badge tone={movement.type === "Issued" ? "info" : movement.type === "Transferred" ? "warning" : "success"}>
            {movement.type}
          </Badge>
          <strong>{getMaterial(movement.materialId).name}</strong>
          <span>
            {movement.quantity} {getMaterial(movement.materialId).unit} - {warehouseName(movement.from)} to{" "}
            {warehouseName(movement.to)}
          </span>
          <small>
            {movement.id} - {movement.actor} - {movement.time}
          </small>
          <p>{movement.note}</p>
        </article>
      ))}
    </div>
  );
}
