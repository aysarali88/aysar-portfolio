"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { initialState, materials, warehouses } from "./lib/data";
import {
  availableStock,
  cloneInitialState,
  getMaterial,
  movementMatchesRequest,
  movementTitle,
  nextMovementId,
  nextMovementReference,
  nextRequestId,
  nowLabel,
  requestTotals,
  stockStatus,
  totalAvailableStock,
  totalMaterialStock,
  warehouseName
} from "./lib/helpers";
import type {
  DemoState,
  MaterialRequest,
  Movement,
  MovementType,
  PageKey,
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
  Cancelled: "danger"
};

const movementTone: Record<MovementType, string> = {
  Receive: "success",
  Issue: "info",
  Return: "warning",
  Transfer: "neutral"
};

const movementTypes: MovementType[] = ["Receive", "Issue", "Return", "Transfer"];

const blankRequest = {
  requester: "Rami Khalil",
  department: "Demo FTTH Field Team",
  approver: "Maya Nasser",
  warehouseId: "central" as WarehouseId,
  targetArea: "Demo Distribution Area",
  materialId: "fiber-12f",
  quantity: 100,
  requiredDate: "2026-09-03",
  notes: "Demo request prepared for field rollout activity."
};

const blankMovement = {
  materialId: "drop-cable",
  quantity: 100,
  from: "central" as WarehouseId,
  to: "north" as WarehouseId,
  destination: "Demo North Field Team",
  actor: "Fadi Salem",
  notes: "Operational demo movement."
};

type Toast = { id: number; tone: "success" | "error"; message: string };

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className={styles.fieldLabel}>{children}</label>;
}

export default function WarehouseDemoPage() {
  const [state, setState] = useState<DemoState>(() => cloneInitialState(initialState));
  const [activePage, setActivePage] = useState<PageKey>("dashboard");
  const [selectedRequestId, setSelectedRequestId] = useState(initialState.requests[0]?.id ?? "");
  const [selectedMaterialId, setSelectedMaterialId] = useState("fiber-12f");
  const [movementFilter, setMovementFilter] = useState<MovementType | "All">("All");
  const [warehouseFilter, setWarehouseFilter] = useState<WarehouseId | "all">("all");
  const [requestSearch, setRequestSearch] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");
  const [requestForm, setRequestForm] = useState(blankRequest);
  const [movementForm, setMovementForm] = useState(blankMovement);
  const [toast, setToast] = useState<Toast | null>(null);

  const selectedRequest = useMemo(
    () => state.requests.find((request) => request.id === selectedRequestId) ?? state.requests[0],
    [selectedRequestId, state.requests]
  );

  const dashboardStats = useMemo(() => {
    const pending = state.requests.filter((request) => request.status === "Submitted").length;
    const awaitingIssue = state.requests.filter((request) => request.status === "Approved").length;
    const lowItems = materials.filter((material) =>
      Object.keys(warehouses).some(
        (warehouseId) =>
          stockStatus(state, material.id, warehouseId as WarehouseId) !== "In Stock"
      )
    ).length;
    const today = nowLabel().slice(0, 10);
    const issuedToday = state.movements
      .filter((movement) => movement.type === "Issue" && movement.time.includes(today))
      .reduce((sum, movement) => sum + movement.quantity, 0);
    const transfersToday = state.movements.filter(
      (movement) => movement.type === "Transfer" && movement.time.includes(today)
    ).length;

    return {
      totalItems: materials.length,
      pending,
      awaitingIssue,
      lowItems,
      issuedToday,
      transfersToday
    };
  }, [state]);

  function showToast(message: string, tone: Toast["tone"] = "success") {
    setToast({ id: Date.now(), message, tone });
    window.setTimeout(() => setToast(null), 3200);
  }

  function confirmAction(message: string) {
    return window.confirm(message);
  }

  function resetDemoData() {
    if (!confirmAction("Reset all demo transactions to the original sample state?")) {
      return;
    }
    const resetState = cloneInitialState(initialState);
    setState(resetState);
    setSelectedRequestId(resetState.requests[0]?.id ?? "");
    setSelectedMaterialId("fiber-12f");
    setMovementFilter("All");
    setWarehouseFilter("all");
    setRequestSearch("");
    setInventorySearch("");
    showToast("Demo data has been reset.");
  }

  function addTimeline(request: MaterialRequest, title: string, note: string, user = "Demo Operator") {
    return {
      ...request,
      timeline: [
        ...request.timeline,
        {
          id: `tl-${request.id}-${request.timeline.length + 1}`,
          time: nowLabel(),
          user,
          title,
          note
        }
      ]
    };
  }

  function createMaterialRequest() {
    if (!requestForm.requester.trim() || !requestForm.targetArea.trim()) {
      showToast("Requester and target area are required.", "error");
      return;
    }

    setState((current) => {
      const requested = Math.max(1, Number(requestForm.quantity));
      const request: MaterialRequest = {
        id: nextRequestId(current.requests.length),
        requester: requestForm.requester,
        department: requestForm.department,
        approver: requestForm.approver,
        warehouseId: requestForm.warehouseId,
        targetArea: requestForm.targetArea,
        status: "Draft",
        requestDate: nowLabel(),
        requiredDate: requestForm.requiredDate,
        notes: requestForm.notes,
        items: [{ materialId: requestForm.materialId, requested, approved: 0, issued: 0 }],
        timeline: [
          {
            id: "tl-created",
            time: nowLabel(),
            user: requestForm.requester,
            title: "Created",
            note: "Draft MR created using sample FTTH warehouse data."
          }
        ]
      };

      setSelectedRequestId(request.id);
      setActivePage("request");
      return { ...current, requests: [request, ...current.requests] };
    });
    showToast("Material request created.");
  }

  function addMaterialToSelectedRequest() {
    if (!selectedRequest || selectedRequest.status !== "Draft") {
      showToast("Materials can only be added to Draft MRs.", "error");
      return;
    }

    setState((current) => ({
      ...current,
      requests: current.requests.map((request) => {
        if (request.id !== selectedRequest.id) {
          return request;
        }

        const quantity = Math.max(1, Number(requestForm.quantity));
        const existing = request.items.find((item) => item.materialId === requestForm.materialId);
        const items = existing
          ? request.items.map((item) =>
              item.materialId === requestForm.materialId
                ? { ...item, requested: item.requested + quantity }
                : item
            )
          : [...request.items, { materialId: requestForm.materialId, requested: quantity, approved: 0, issued: 0 }];

        return addTimeline(
          { ...request, items },
          "Item Added",
          `${getMaterial(requestForm.materialId).name} added to Draft MR.`,
          request.requester
        );
      })
    }));
    showToast("Material added to draft MR.");
  }

  function submitRequest(requestId: string) {
    if (!confirmAction(`Submit ${requestId} for approval?`)) {
      return;
    }

    updateRequest(requestId, (request) => {
      if (request.status !== "Draft") {
        showToast("Only Draft MRs can be submitted.", "error");
        return request;
      }

      return addTimeline({ ...request, status: "Submitted" }, "Submitted", "MR submitted for approval.", request.requester);
    });
    showToast(`${requestId} submitted.`);
  }

  function approveRequest(requestId: string) {
    if (!confirmAction(`Approve ${requestId} and reserve available stock?`)) {
      return;
    }

    setState((current) => {
      const nextStock = cloneInitialState(current.stock);
      let changed = false;

      const requests = current.requests.map((request) => {
        if (request.id !== requestId) {
          return request;
        }

        if (request.status !== "Submitted") {
          showToast("Only Submitted MRs can be approved.", "error");
          return request;
        }

        const items = request.items.map((item) => {
          const level = nextStock[item.materialId][request.warehouseId];
          const approved = Math.min(item.requested, availableStock(level.onHand, level.reserved));
          level.reserved += approved;
          return { ...item, approved };
        });

        changed = true;
        return addTimeline(
          { ...request, items, status: "Approved" },
          "Approved",
          "MR approved and available quantities reserved.",
          request.approver
        );
      });

      if (changed) {
        showToast(`${requestId} approved and reserved.`);
      }
      return { ...current, stock: nextStock, requests };
    });
  }

  function issueRequest(requestId: string, partial: boolean) {
    if (!confirmAction(`${partial ? "Partially issue" : "Issue remaining approved materials for"} ${requestId}?`)) {
      return;
    }

    setState((current) => {
      const nextStock = cloneInitialState(current.stock);
      let nextMovements = current.movements;
      let issuedAny = false;

      const requests = current.requests.map((request) => {
        if (request.id !== requestId) {
          return request;
        }

        if (!["Approved", "Partially Issued"].includes(request.status)) {
          showToast("This MR must be approved before issuing.", "error");
          return request;
        }

        const items = request.items.map((item) => {
          const remainingApproved = item.approved - item.issued;
          const level = nextStock[item.materialId][request.warehouseId];
          const available = availableStock(level.onHand, 0);
          const planned = partial ? Math.ceil(remainingApproved / 2) : remainingApproved;
          const issueQty = Math.max(0, Math.min(planned, remainingApproved, available));

          if (issueQty <= 0) {
            return item;
          }

          level.onHand -= issueQty;
          level.reserved = Math.max(0, level.reserved - issueQty);
          issuedAny = true;
          nextMovements = addMovement(current, nextMovements, {
            type: "Issue",
            materialId: item.materialId,
            quantity: issueQty,
            from: request.warehouseId,
            destination: request.department,
            requestId: request.id,
            actor: "Fadi Salem",
            note: `${getMaterial(item.materialId).name} issued against approved MR.`
          });
          return { ...item, issued: item.issued + issueQty };
        });

        if (!issuedAny) {
          return request;
        }

        const totals = requestTotals({ ...request, items });
        const status: RequestStatus = totals.remaining > 0 ? "Partially Issued" : "Issued";
        return addTimeline(
          { ...request, items, status },
          status === "Issued" ? "Fully Issued" : "Partially Issued",
          issuedAny ? "Warehouse issue posted and stock movement records created." : "No stock available to issue.",
          "Fadi Salem"
        );
      });

      showToast(issuedAny ? `${requestId} issue completed.` : "No available stock to issue.", issuedAny ? "success" : "error");
      return { ...current, stock: nextStock, movements: nextMovements, requests };
    });
  }

  function createMovement(type: MovementType) {
    if (!confirmAction(`${movementTitle(type)} for ${getMaterial(movementForm.materialId).name}?`)) {
      return;
    }

    setState((current) => {
      const quantity = Math.max(1, Number(movementForm.quantity));
      const materialId = movementForm.materialId;
      const nextStock = cloneInitialState(current.stock);
      const from = movementForm.from;
      const to = movementForm.to;

      if (type === "Transfer" && from === to) {
        showToast("Source and destination warehouses must be different.", "error");
        return current;
      }

      if (type === "Issue" || type === "Transfer") {
        const source = nextStock[materialId][from];
        if (availableStock(source.onHand, source.reserved) < quantity) {
          showToast("Cannot move more than available unreserved stock.", "error");
          return current;
        }
        source.onHand -= quantity;
      }

      if (type === "Receive" || type === "Return" || type === "Transfer") {
        nextStock[materialId][to].onHand += quantity;
      }

      showToast(`${movementTitle(type)} posted.`);
      return {
        ...current,
        stock: nextStock,
        movements: addMovement(current, current.movements, {
          type,
          materialId,
          quantity,
          from: type === "Receive" || type === "Return" ? undefined : from,
          to: type === "Issue" ? undefined : to,
          destination: type === "Issue" ? movementForm.destination : warehouseName(to),
          actor: movementForm.actor,
          note: movementForm.notes
        })
      };
    });
  }

  function updateRequest(requestId: string, updater: (request: MaterialRequest) => MaterialRequest) {
    setState((current) => ({
      ...current,
      requests: current.requests.map((request) => (request.id === requestId ? updater(request) : request))
    }));
  }

  function addMovement(
    current: DemoState,
    movements: Movement[],
    movement: Omit<Movement, "id" | "reference" | "time">
  ) {
    return [
      {
        ...movement,
        id: nextMovementId(movements.length),
        reference: nextMovementReference(movement.type, movements.length),
        time: nowLabel()
      },
      ...movements
    ];
  }

  const filteredMovements = state.movements.filter(
    (movement) => movementFilter === "All" || movement.type === movementFilter
  );

  return (
    <main className={styles.shell}>
      {toast ? <div className={`${styles.toast} ${styles[toast.tone]}`}>{toast.message}</div> : null}
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
            <Badge tone="warning">Demo Environment — Sample Data Only</Badge>
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
            approveRequest={approveRequest}
            createMaterialRequest={createMaterialRequest}
            issueRequest={issueRequest}
            requestForm={requestForm}
            selectedRequest={selectedRequest}
            setRequestForm={setRequestForm}
            setSelectedRequestId={setSelectedRequestId}
            state={state}
            submitRequest={submitRequest}
          />
        ) : null}
        {activePage === "inventory" ? (
          <InventoryPage
            inventorySearch={inventorySearch}
            selectedMaterialId={selectedMaterialId}
            setInventorySearch={setInventorySearch}
            setSelectedMaterialId={setSelectedMaterialId}
            setWarehouseFilter={setWarehouseFilter}
            state={state}
            warehouseFilter={warehouseFilter}
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
            requestSearch={requestSearch}
            selectedRequest={selectedRequest}
            setRequestSearch={setRequestSearch}
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
  stats: {
    totalItems: number;
    pending: number;
    awaitingIssue: number;
    lowItems: number;
    issuedToday: number;
    transfersToday: number;
  };
  state: DemoState;
  setActivePage: (page: PageKey) => void;
}) {
  const pendingRequests = state.requests.filter((request) =>
    ["Submitted", "Approved", "Partially Issued"].includes(request.status)
  );
  const lowAlerts = materials
    .flatMap((material) =>
      Object.keys(warehouses).map((warehouseId) => ({
        material,
        warehouseId: warehouseId as WarehouseId,
        status: stockStatus(state, material.id, warehouseId as WarehouseId),
        level: state.stock[material.id][warehouseId as WarehouseId]
      }))
    )
    .filter((row) => row.status !== "In Stock")
    .slice(0, 6);
  const mostIssued = materials
    .map((material) => ({
      material,
      issued: state.movements
        .filter((movement) => movement.type === "Issue" && movement.materialId === material.id)
        .reduce((sum, movement) => sum + movement.quantity, 0)
    }))
    .sort((a, b) => b.issued - a.issued)
    .slice(0, 5);

  return (
    <div className={styles.pageStack}>
      <section className={`${styles.kpiGrid} ${styles.kpiGridSix}`}>
        <Kpi title="Total Inventory Items" value={stats.totalItems} note="FTTH item master" />
        <Kpi title="Pending MRs" value={stats.pending} note="Awaiting approval" />
        <Kpi title="Approved Awaiting Issue" value={stats.awaitingIssue} note="Reserved stock" />
        <Kpi title="Low Stock Items" value={stats.lowItems} note="Low / out of stock" />
        <Kpi title="Issued Today" value={stats.issuedToday.toLocaleString()} note="Demo quantities" />
        <Kpi title="Transfers Today" value={stats.transfersToday} note="Warehouse moves" />
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
            {materials.slice(0, 8).map((material) => {
              const total = totalAvailableStock(state, material.id);
              const max = Math.max(...materials.map((item) => totalAvailableStock(state, item.id)));
              return (
                <div className={styles.stockBar} key={material.id}>
                  <span>{material.name}</span>
                  <div>
                    <i style={{ width: `${Math.max(5, (total / max) * 100)}%` }} />
                  </div>
                  <strong>{total.toLocaleString()} available</strong>
                </div>
              );
            })}
          </div>
        </article>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Recent Movements</h2>
            <button onClick={() => setActivePage("movements")} type="button">
              View Movements
            </button>
          </div>
          <CompactMovements movements={state.movements.slice(0, 5)} />
        </article>
      </section>

      <section className={styles.threePanelGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Pending Requests</h2>
            <button onClick={() => setActivePage("history")} type="button">
              MR History
            </button>
          </div>
          <RequestCards requests={pendingRequests.slice(0, 4)} />
        </article>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Low Stock Alerts</h2>
            <Badge tone="warning">{lowAlerts.length} Alerts</Badge>
          </div>
          <div className={styles.alertList}>
            {lowAlerts.map((row) => (
              <div key={`${row.material.id}-${row.warehouseId}`}>
                <Badge tone={row.status === "Out of Stock" ? "danger" : "warning"}>{row.status}</Badge>
                <strong>{row.material.name}</strong>
                <span>
                  {warehouseName(row.warehouseId)} - {availableStock(row.level.onHand, row.level.reserved)} available
                </span>
              </div>
            ))}
          </div>
        </article>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Most Issued Materials</h2>
            <Badge>Top 5</Badge>
          </div>
          <div className={styles.rankList}>
            {mostIssued.map((row, index) => (
              <div key={row.material.id}>
                <span>{index + 1}</span>
                <strong>{row.material.name}</strong>
                <small>
                  {row.issued.toLocaleString()} {row.material.unit}
                </small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Recent MR Activity</h2>
          <Badge>{state.requests.length} Demo MRs</Badge>
        </div>
        <RequestCards requests={state.requests.slice(0, 6)} />
      </section>
    </div>
  );
}

function Kpi({ title, value, note }: { title: string; value: string | number; note: string }) {
  return (
    <article>
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function MaterialRequestPage(props: {
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
  const {
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
  } = props;

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
            <input value={requestForm.requester} onChange={(event) => setRequestForm({ ...requestForm, requester: event.target.value })} />
          </FieldLabel>
          <FieldLabel>
            Department / Team
            <input value={requestForm.department} onChange={(event) => setRequestForm({ ...requestForm, department: event.target.value })} />
          </FieldLabel>
          <FieldLabel>
            Approver
            <input value={requestForm.approver} onChange={(event) => setRequestForm({ ...requestForm, approver: event.target.value })} />
          </FieldLabel>
          <FieldLabel>
            Required Date
            <input value={requestForm.requiredDate} onChange={(event) => setRequestForm({ ...requestForm, requiredDate: event.target.value })} />
          </FieldLabel>
          <FieldLabel>
            Warehouse
            <select value={requestForm.warehouseId} onChange={(event) => setRequestForm({ ...requestForm, warehouseId: event.target.value as WarehouseId })}>
              {Object.entries(warehouses).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel>
            Target Area
            <input value={requestForm.targetArea} onChange={(event) => setRequestForm({ ...requestForm, targetArea: event.target.value })} />
          </FieldLabel>
          <FieldLabel>
            Material
            <select value={requestForm.materialId} onChange={(event) => setRequestForm({ ...requestForm, materialId: event.target.value })}>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.code} - {material.name}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel>
            Requested Quantity
            <input min="1" type="number" value={requestForm.quantity} onChange={(event) => setRequestForm({ ...requestForm, quantity: Number(event.target.value) })} />
          </FieldLabel>
        </div>
        <FieldLabel>
          Notes
          <textarea value={requestForm.notes} onChange={(event) => setRequestForm({ ...requestForm, notes: event.target.value })} />
        </FieldLabel>
        <div className={styles.actionRow}>
          <button className={styles.primaryButton} onClick={createMaterialRequest} type="button">
            Create Material Request
          </button>
          <button disabled={selectedRequest?.status !== "Draft"} onClick={addMaterialToSelectedRequest} type="button">
            Add Material to Draft
          </button>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>MR Details</h2>
          <select value={selectedRequest?.id ?? ""} onChange={(event) => setSelectedRequestId(event.target.value)}>
            {state.requests.map((request) => (
              <option key={request.id} value={request.id}>
                {request.id} - {request.status}
              </option>
            ))}
          </select>
        </div>
        {selectedRequest ? (
          <RequestDetails
            actions
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
  issueRequest,
  actions = false
}: {
  request: MaterialRequest;
  submitRequest: (id: string) => void;
  approveRequest: (id: string) => void;
  issueRequest: (id: string, partial: boolean) => void;
  actions?: boolean;
}) {
  const totals = requestTotals(request);
  const canSubmit = request.status === "Draft";
  const canApprove = request.status === "Submitted";
  const canIssue = ["Approved", "Partially Issued"].includes(request.status) && totals.remaining > 0;

  return (
    <div className={styles.detailStack}>
      <div className={styles.recordHeader}>
        <div>
          <Badge tone={statusTone[request.status]}>{request.status}</Badge>
          <h2>{request.id}</h2>
          <p>{request.targetArea}</p>
        </div>
        <div className={styles.miniStats}>
          <span>Requested: {totals.requested}</span>
          <span>Approved: {totals.approved}</span>
          <span>Issued: {totals.issued}</span>
          <span>Remaining: {totals.remaining}</span>
        </div>
      </div>
      <div className={styles.recordGrid}>
        <span>Requester: <strong>{request.requester}</strong></span>
        <span>Department: <strong>{request.department}</strong></span>
        <span>Approver: <strong>{request.approver}</strong></span>
        <span>Warehouse: <strong>{warehouseName(request.warehouseId)}</strong></span>
        <span>Request Date: <strong>{request.requestDate}</strong></span>
        <span>Required Date: <strong>{request.requiredDate}</strong></span>
      </div>
      <p className={styles.notesBox}>{request.notes}</p>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Material</th>
              <th>Requested</th>
              <th>Approved</th>
              <th>Issued</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {request.items.map((item) => {
              const material = getMaterial(item.materialId);
              return (
                <tr key={item.materialId}>
                  <td>{material.code}</td>
                  <td>{material.name}</td>
                  <td>{item.requested}</td>
                  <td>{item.approved}</td>
                  <td>{item.issued}</td>
                  <td>{item.approved - item.issued}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {actions ? (
        <div className={styles.actionRow}>
          <button disabled={!canSubmit} onClick={() => submitRequest(request.id)} type="button">
            Submit MR
          </button>
          <button disabled={!canApprove} onClick={() => approveRequest(request.id)} type="button">
            Approve MR
          </button>
          <button disabled={!canIssue} onClick={() => issueRequest(request.id, true)} type="button">
            Partial Issue
          </button>
          <button disabled={!canIssue} onClick={() => issueRequest(request.id, false)} type="button">
            Issue Remaining
          </button>
        </div>
      ) : null}
      <Timeline events={request.timeline} />
    </div>
  );
}

function InventoryPage({
  state,
  selectedMaterialId,
  setSelectedMaterialId,
  warehouseFilter,
  setWarehouseFilter,
  inventorySearch,
  setInventorySearch
}: {
  state: DemoState;
  selectedMaterialId: string;
  setSelectedMaterialId: (id: string) => void;
  warehouseFilter: WarehouseId | "all";
  setWarehouseFilter: (id: WarehouseId | "all") => void;
  inventorySearch: string;
  setInventorySearch: (value: string) => void;
}) {
  const selectedMaterial = getMaterial(selectedMaterialId);
  const relatedMovements = state.movements.filter((movement) => movement.materialId === selectedMaterialId);
  const search = inventorySearch.toLowerCase();

  return (
    <div className={styles.twoColumnWide}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Inventory List</h2>
          <div className={styles.filterRow}>
            <input placeholder="Search item or code" value={inventorySearch} onChange={(event) => setInventorySearch(event.target.value)} />
            <select value={warehouseFilter} onChange={(event) => setWarehouseFilter(event.target.value as WarehouseId | "all")}>
              <option value="all">All Warehouses</option>
              {Object.entries(warehouses).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Material</th>
                <th>Warehouse</th>
                <th>On Hand</th>
                <th>Reserved</th>
                <th>Available</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {materials
                .filter((material) => `${material.code} ${material.name}`.toLowerCase().includes(search))
                .flatMap((material) =>
                  Object.entries(state.stock[material.id])
                    .filter(([warehouseId]) => warehouseFilter === "all" || warehouseFilter === warehouseId)
                    .map(([warehouseId, level]) => {
                      const status = stockStatus(state, material.id, warehouseId as WarehouseId);
                      return (
                        <tr className={selectedMaterialId === material.id ? styles.selectedRow : ""} key={`${material.id}-${warehouseId}`} onClick={() => setSelectedMaterialId(material.id)}>
                          <td>{material.code}</td>
                          <td>{material.name}</td>
                          <td>{warehouseName(warehouseId as WarehouseId)}</td>
                          <td>{level.onHand.toLocaleString()} {material.unit}</td>
                          <td>{level.reserved.toLocaleString()} {material.unit}</td>
                          <td>{availableStock(level.onHand, level.reserved).toLocaleString()} {material.unit}</td>
                          <td><Badge tone={status === "In Stock" ? "success" : status === "Out of Stock" ? "danger" : "warning"}>{status}</Badge></td>
                        </tr>
                      );
                    })
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
          <span>Item code: {selectedMaterial.code}</span>
          <span>Unit: {selectedMaterial.unit}</span>
          <span>Low-stock threshold: {selectedMaterial.reorderLevel}</span>
          <span>Total on hand: {totalMaterialStock(state, selectedMaterial.id).toLocaleString()}</span>
          <span>Total available: {totalAvailableStock(state, selectedMaterial.id).toLocaleString()}</span>
        </div>
        <h3>Warehouse-Level Stock</h3>
        <div className={styles.warehouseStack}>
          {Object.entries(state.stock[selectedMaterial.id]).map(([warehouseId, level]) => (
            <div key={warehouseId}>
              <span>{warehouseName(warehouseId as WarehouseId)}</span>
              <strong>{availableStock(level.onHand, level.reserved).toLocaleString()} available</strong>
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
          <Badge>Controlled Demo Transaction</Badge>
        </div>
        <div className={styles.formGrid}>
          <FieldLabel>
            Material
            <select value={movementForm.materialId} onChange={(event) => setMovementForm({ ...movementForm, materialId: event.target.value })}>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>{material.code} - {material.name}</option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel>
            Quantity
            <input min="1" type="number" value={movementForm.quantity} onChange={(event) => setMovementForm({ ...movementForm, quantity: Number(event.target.value) })} />
          </FieldLabel>
          <FieldLabel>
            Source Warehouse
            <select value={movementForm.from} onChange={(event) => setMovementForm({ ...movementForm, from: event.target.value as WarehouseId })}>
              {Object.entries(warehouses).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </select>
          </FieldLabel>
          <FieldLabel>
            Destination Warehouse
            <select value={movementForm.to} onChange={(event) => setMovementForm({ ...movementForm, to: event.target.value as WarehouseId })}>
              {Object.entries(warehouses).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </select>
          </FieldLabel>
          <FieldLabel>
            Destination / Team
            <input value={movementForm.destination} onChange={(event) => setMovementForm({ ...movementForm, destination: event.target.value })} />
          </FieldLabel>
          <FieldLabel>
            Performed By
            <input value={movementForm.actor} onChange={(event) => setMovementForm({ ...movementForm, actor: event.target.value })} />
          </FieldLabel>
        </div>
        <FieldLabel>
          Notes
          <textarea value={movementForm.notes} onChange={(event) => setMovementForm({ ...movementForm, notes: event.target.value })} />
        </FieldLabel>
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
          <select value={movementFilter} onChange={(event) => setMovementFilter(event.target.value as MovementType | "All")}>
            <option value="All">All Types</option>
            {movementTypes.map((type) => <option key={type} value={type}>{type}</option>)}
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
  setSelectedRequestId,
  requestSearch,
  setRequestSearch
}: {
  state: DemoState;
  selectedRequest?: MaterialRequest;
  setSelectedRequestId: (id: string) => void;
  requestSearch: string;
  setRequestSearch: (value: string) => void;
}) {
  const search = requestSearch.toLowerCase();
  const requests = state.requests.filter((request) =>
    `${request.id} ${request.requester} ${request.department} ${request.status}`.toLowerCase().includes(search)
  );
  const relatedMovements = selectedRequest
    ? state.movements.filter((movement) => movementMatchesRequest(movement, selectedRequest.id))
    : [];

  return (
    <div className={styles.twoColumnWide}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>MR List</h2>
          <div className={styles.filterRow}>
            <input placeholder="Search MR, requester, status" value={requestSearch} onChange={(event) => setRequestSearch(event.target.value)} />
            <Badge>{requests.length} Results</Badge>
          </div>
        </div>
        <RequestCards requests={requests} onSelect={setSelectedRequestId} />
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>MR History Details</h2>
          {selectedRequest ? <Badge tone={statusTone[selectedRequest.status]}>{selectedRequest.status}</Badge> : null}
        </div>
        {selectedRequest ? (
          <div className={styles.detailStack}>
            <RequestDetails
              approveRequest={() => undefined}
              issueRequest={() => undefined}
              request={selectedRequest}
              submitRequest={() => undefined}
            />
            <h3>Linked Movement Records</h3>
            <CompactMovements movements={relatedMovements} />
          </div>
        ) : (
          <p className={styles.emptyState}>Select an MR to view the full operational record.</p>
        )}
      </section>
    </div>
  );
}

function RequestCards({
  requests,
  onSelect
}: {
  requests: MaterialRequest[];
  onSelect?: (id: string) => void;
}) {
  if (requests.length === 0) {
    return <p className={styles.emptyState}>No material requests match this view.</p>;
  }

  return (
    <div className={styles.requestList}>
      {requests.map((request) => {
        const totals = requestTotals(request);
        const content = (
          <>
            <strong>{request.id}</strong>
            <span>{request.requester} - {request.department}</span>
            <small>{warehouseName(request.warehouseId)} - Required {request.requiredDate}</small>
            <div className={styles.requestCardFooter}>
              <Badge tone={statusTone[request.status]}>{request.status}</Badge>
              <span>{totals.issued}/{totals.approved || totals.requested} issued</span>
            </div>
          </>
        );

        return onSelect ? (
          <button key={request.id} onClick={() => onSelect(request.id)} type="button">
            {content}
          </button>
        ) : (
          <article className={styles.requestSummary} key={request.id}>{content}</article>
        );
      })}
    </div>
  );
}

function Timeline({ events }: { events: MaterialRequest["timeline"] }) {
  return (
    <div className={styles.timeline}>
      <h3>Activity Timeline</h3>
      {events.map((event) => (
        <div key={event.id}>
          <span>{event.time} - {event.user}</span>
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
      {movements.map((movement) => {
        const material = getMaterial(movement.materialId);
        return (
          <article key={movement.id}>
            <Badge tone={movementTone[movement.type]}>{movement.type}</Badge>
            <strong>{movement.reference} - {material.name}</strong>
            <span>
              {movement.quantity.toLocaleString()} {material.unit} - {warehouseName(movement.from)} to{" "}
              {movement.destination ?? warehouseName(movement.to)}
            </span>
            <small>
              {movement.id} - {movement.actor} - {movement.time}
              {movement.requestId ? ` - ${movement.requestId}` : ""}
            </small>
            <p>{movement.note}</p>
          </article>
        );
      })}
    </div>
  );
}
