"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import styles from "./rollout.module.css";
import { activities, areas, fieldRecords, issues, materialReconciliation, networkElements } from "./lib/data";
import {
  areaName,
  areaReport,
  cloneState,
  enrichedTeamPerformance,
  formatMeters,
  networkProgress,
  overviewStats,
  reconciliationVariance,
  sum,
  validationCounts
} from "./lib/helpers";
import type { FieldRecord, HealthStatus, NetworkElement, RolloutState, SectionKey } from "./lib/types";

const sections: { key: SectionKey; label: string; caption: string }[] = [
  { key: "overview", label: "Dashboard", caption: "Productivity and project status" },
  { key: "field", label: "Field Entry", caption: "Daily rollout record capture" },
  { key: "operations", label: "Operations", caption: "Supervisor and area aggregation" },
  { key: "report", label: "Area PDF / Area Report", caption: "Printable area summary" },
  { key: "validation", label: "Map / Network Validation", caption: "Design vs field topology" },
  { key: "materials", label: "Warehouse vs Field", caption: "Issued vs reported usage" }
];

const initialState: RolloutState = {
  fieldRecords: cloneState(fieldRecords),
  activities: cloneState(activities)
};

const blankForm = {
  date: "2026-08-29",
  supervisor: "Adam Faris",
  teamLeader: "Noah Karim",
  city: "Riverton",
  areaId: "AREA-A01",
  activityType: "Cable Deployment",
  networkElement: "Cable" as FieldRecord["networkElement"],
  distributionNode: "DN-01",
  material: "Fiber Cable 24F",
  itemDetail: "24F feeder cable, armored outdoor",
  cableRoute: "RTE-A01-09",
  cableCode: "CBL-24F-009",
  plannedLength: "420",
  actualLength: "410",
  mountType: "Underground",
  boxCode: "N/A",
  serialNumber: "N/A",
  quantity: "410",
  notes: "Demo field record entered from public sample data."
};

function percent(actual: number, planned: number) {
  return planned === 0 ? 0 : Math.min(100, Math.round((actual / planned) * 100));
}

function statusFromVariance(planned: number, actual: number): HealthStatus {
  if (planned > 0 && actual === 0) return "Critical";
  if (planned > 0 && Math.abs(planned - actual) > planned * 0.08) return "Watch";
  return "Healthy";
}

function badgeClass(value: string) {
  if (value === "Healthy" || value === "Match" || value === "Reconciled" || value === "Resolved") return styles.good;
  if (value === "Watch" || value === "Mismatch" || value === "Review Required" || value === "In Review") {
    return styles.warn;
  }
  return styles.bad;
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className={styles.statCard}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function ProgressRow({ label, actual, planned }: { label: string; actual: number; planned: number }) {
  const value = percent(actual, planned);
  return (
    <div className={styles.progressRow}>
      <div>
        <strong>{label}</strong>
        <span>
          {actual.toLocaleString()} / {planned.toLocaleString()}
        </span>
      </div>
      <div className={styles.track} aria-label={`${label} ${value}%`}>
        <span style={{ width: `${value}%` }} />
      </div>
      <b>{value}%</b>
    </div>
  );
}

export default function RolloutDemoPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [state, setState] = useState<RolloutState>(initialState);
  const [selectedAreaId, setSelectedAreaId] = useState("AREA-A01");
  const [fieldSearch, setFieldSearch] = useState("");
  const [fieldStatus, setFieldStatus] = useState("All");
  const [opsSupervisor, setOpsSupervisor] = useState("All");
  const [opsDate, setOpsDate] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState<FieldRecord | null>(state.fieldRecords[0]);
  const [selectedElementId, setSelectedElementId] = useState(networkElements[0].id);
  const [selectedNode, setSelectedNode] = useState("DN-01");
  const [materialStatus, setMaterialStatus] = useState("All");
  const [materialSearch, setMaterialSearch] = useState("");
  const [form, setForm] = useState(blankForm);
  const [toast, setToast] = useState("");

  const selectedArea = areas.find((area) => area.id === selectedAreaId) ?? areas[0];
  const stats = overviewStats(state);
  const teams = enrichedTeamPerformance(state);
  const selectedElement = networkElements.find((element) => element.id === selectedElementId) ?? networkElements[0];

  const fieldFiltered = useMemo(() => {
    const query = fieldSearch.toLowerCase();
    return state.fieldRecords.filter((record) => {
      const matchesArea = selectedAreaId === "All" || record.areaId === selectedAreaId;
      const matchesStatus = fieldStatus === "All" || record.status === fieldStatus;
      const matchesSearch = [record.id, record.supervisor, record.teamLeader, record.activityType, record.boxCode, record.cableCode]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return matchesArea && matchesStatus && matchesSearch;
    });
  }, [fieldSearch, fieldStatus, selectedAreaId, state.fieldRecords]);

  const opsRecords = useMemo(() => {
    return state.fieldRecords.filter((record) => {
      const areaMatch = selectedAreaId === "All" || record.areaId === selectedAreaId;
      const supervisorMatch = opsSupervisor === "All" || record.supervisor === opsSupervisor;
      const dateMatch = opsDate === "All" || record.date === opsDate;
      return areaMatch && supervisorMatch && dateMatch;
    });
  }, [opsDate, opsSupervisor, selectedAreaId, state.fieldRecords]);

  const validationFiltered = networkElements.filter(
    (element) =>
      (selectedAreaId === "All" || element.areaId === selectedAreaId) &&
      (selectedNode === "All" || element.distributionNode === selectedNode)
  );

  const materialFiltered = materialReconciliation.filter((row) => {
    const query = materialSearch.toLowerCase();
    const areaMatch = selectedAreaId === "All" || row.areaId === selectedAreaId;
    const statusMatch = materialStatus === "All" || row.status === materialStatus;
    const searchMatch = [row.id, row.material, row.partNumber, row.team].join(" ").toLowerCase().includes(query);
    return areaMatch && statusMatch && searchMatch;
  });

  const addFieldRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const plannedLength = Number(form.plannedLength);
    const actualLength = Number(form.actualLength);
    const quantity = Number(form.quantity);

    if (Number.isNaN(plannedLength) || Number.isNaN(actualLength) || Number.isNaN(quantity) || quantity < 0) {
      setToast("Please enter valid numeric quantity and length values.");
      return;
    }

    const id = `FR-2026-${String(120 + state.fieldRecords.length).padStart(4, "0")}`;
    const newRecord: FieldRecord = {
      ...form,
      id,
      plannedLength,
      actualLength,
      quantity,
      status: statusFromVariance(plannedLength, actualLength)
    };

    setState((current) => ({
      fieldRecords: [newRecord, ...current.fieldRecords],
      activities: [
        {
          id: `ACT-${String(90 + current.activities.length).padStart(3, "0")}`,
          time: `${form.date} 15:35`,
          areaId: form.areaId,
          title: "Field record submitted",
          note: `${form.activityType} captured for ${form.distributionNode} by ${form.supervisor}.`
        },
        ...current.activities
      ]
    }));
    setSelectedRecord(newRecord);
    setToast(`${id} added and dashboard calculations updated.`);
  };

  const resetDemo = () => {
    setState(cloneState(initialState));
    setSelectedRecord(fieldRecords[0]);
    setSelectedElementId(networkElements[0].id);
    setSelectedAreaId("AREA-A01");
    setToast("Demo data reset to the original fictional sample set.");
  };

  const renderDashboard = () => {
    const counts = validationCounts(networkElements);
    return (
      <section className={styles.view}>
        <div className={styles.titleRow}>
          <div>
            <p className={styles.eyebrow}>Rollout monitoring</p>
            <h1>Dashboard</h1>
          </div>
          <select value={selectedAreaId} onChange={(event) => setSelectedAreaId(event.target.value)}>
            <option value="All">All areas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.statGrid}>
          <StatCard label="Overall Productivity" value={`${stats.overallProgress}%`} note="Actual cable vs rollout plan" />
          <StatCard label="Cable Progress" value={formatMeters(stats.installedCable)} note={`${formatMeters(stats.plannedCable)} planned`} />
          <StatCard label="Box Deployment" value={stats.boxesInstalled.toString()} note="HUB, SUB, END and XBOX records" />
          <StatCard label="Actual / Passed Users" value={stats.usersPassed.toLocaleString()} note="Fictional passed premises" />
          <StatCard label="Open Issues" value={stats.openIssues.toString()} note="Operational notes requiring action" />
          <StatCard label="Schedule Variance" value={`${stats.scheduleVariance}%`} note="Actual minus planned average" />
        </div>

        <div className={styles.gridTwo}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Project Health</h2>
              <span className={`${styles.badge} ${badgeClass(selectedArea.status)}`}>{selectedArea.status}</span>
            </div>
            {(selectedAreaId === "All" ? areas : [selectedArea]).map((area) => (
              <ProgressRow key={area.id} label={area.name} actual={area.actualProgress} planned={100} />
            ))}
          </article>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Design vs Field Validation</h2>
              <span>{networkElements.length} elements</span>
            </div>
            <div className={styles.validationMini}>
              <StatCard label="Box Match" value={counts.boxesMatched.toString()} note="Installed as planned" />
              <StatCard label="Mismatch" value={(counts.boxesMismatched + counts.cableLengthMismatch).toString()} note="Length or code differs" />
              <StatCard label="Missing" value={(counts.boxesMissing + counts.cablesMissing).toString()} note="Not reported from field" />
            </div>
          </article>
        </div>

        <div className={styles.gridThree}>
          <article className={styles.panel}>
            <h2>Network Element Progress</h2>
            {networkProgress(state).map((item) => (
              <ProgressRow key={item.label} label={item.label} actual={item.actual} planned={item.planned} />
            ))}
          </article>
          <article className={styles.panel}>
            <h2>Priority Issues</h2>
            <div className={styles.list}>
              {issues.map((issue) => (
                <button key={issue.id} className={styles.listItem} onClick={() => setSelectedAreaId(issue.areaId)}>
                  <span className={`${styles.badge} ${badgeClass(issue.severity)}`}>{issue.severity}</span>
                  <strong>{issue.type}</strong>
                  <small>{areaName(issue.areaId)} - {issue.note}</small>
                </button>
              ))}
            </div>
          </article>
          <article className={styles.panel}>
            <h2>Recent Activity</h2>
            <div className={styles.list}>
              {state.activities.slice(0, 6).map((activity) => (
                <div key={activity.id} className={styles.listItem}>
                  <strong>{activity.title}</strong>
                  <small>{activity.time} - {areaName(activity.areaId)}</small>
                  <p>{activity.note}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    );
  };

  const renderFieldEntry = () => (
    <section className={styles.view}>
      <div className={styles.titleRow}>
        <div>
          <p className={styles.eyebrow}>Daily site capture</p>
          <h1>Field Entry</h1>
        </div>
        <span className={styles.pill}>Records update dashboard, operations and report totals</span>
      </div>

      <div className={styles.gridTwoWide}>
        <form className={styles.panel} onSubmit={addFieldRecord}>
          <div className={styles.panelHeader}>
            <h2>New Rollout Record</h2>
            <button type="submit" className={styles.primaryButton}>Submit Record</button>
          </div>
          <div className={styles.formGrid}>
            {[
              ["date", "Date", "date"],
              ["supervisor", "Supervisor Name", "text"],
              ["teamLeader", "Team Leader", "text"],
              ["city", "City", "text"],
              ["distributionNode", "Related Distribution Node / XBOX", "text"],
              ["material", "Item Name", "text"],
              ["itemDetail", "Item Detail", "text"],
              ["cableRoute", "Cable Route", "text"],
              ["mountType", "Mount Type", "text"],
              ["boxCode", "Box Code", "text"],
              ["serialNumber", "Item Serial", "text"],
              ["plannedLength", "Planned Length", "number"],
              ["actualLength", "Actual Length", "number"],
              ["quantity", "Quantity", "number"]
            ].map(([key, label, type]) => (
              <label key={key}>
                {label}
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                />
              </label>
            ))}
            <label>
              Area
              <select value={form.areaId} onChange={(event) => setForm({ ...form, areaId: event.target.value })}>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </label>
            <label>
              Activity
              <select value={form.activityType} onChange={(event) => setForm({ ...form, activityType: event.target.value })}>
                <option>Cable Deployment</option>
                <option>HUB Installation</option>
                <option>SUB Installation</option>
                <option>END Activation Prep</option>
                <option>Distribution Unit</option>
                <option>Civil Follow-up</option>
              </select>
            </label>
            <label>
              Element Type
              <select
                value={form.networkElement}
                onChange={(event) => setForm({ ...form, networkElement: event.target.value as FieldRecord["networkElement"] })}
              >
                <option>HUB</option>
                <option>SUB</option>
                <option>END</option>
                <option>XBOX</option>
                <option>Cable</option>
              </select>
            </label>
            <label className={styles.full}>
              Notes
              <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            </label>
          </div>
        </form>

        <aside className={styles.panel}>
          <h2>Selected Record</h2>
          {selectedRecord ? (
            <div className={styles.detailStack}>
              <span className={`${styles.badge} ${badgeClass(selectedRecord.status)}`}>{selectedRecord.status}</span>
              <h3>{selectedRecord.id}</h3>
              <p>{selectedRecord.notes}</p>
              <dl className={styles.metaGrid}>
                <div><dt>Area</dt><dd>{areaName(selectedRecord.areaId)}</dd></div>
                <div><dt>Supervisor</dt><dd>{selectedRecord.supervisor}</dd></div>
                <div><dt>Node</dt><dd>{selectedRecord.distributionNode}</dd></div>
                <div><dt>Planned / Actual</dt><dd>{selectedRecord.plannedLength} / {selectedRecord.actualLength} m</dd></div>
                <div><dt>Box / Serial</dt><dd>{selectedRecord.boxCode} / {selectedRecord.serialNumber}</dd></div>
                <div><dt>Material</dt><dd>{selectedRecord.material}</dd></div>
              </dl>
            </div>
          ) : (
            <p className={styles.empty}>Select a row to inspect the operational record.</p>
          )}
        </aside>
      </div>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Recent Field Records</h2>
          <div className={styles.filters}>
            <input placeholder="Search ID, supervisor, box or cable" value={fieldSearch} onChange={(event) => setFieldSearch(event.target.value)} />
            <select value={fieldStatus} onChange={(event) => setFieldStatus(event.target.value)}>
              <option>All</option>
              <option>Healthy</option>
              <option>Watch</option>
              <option>Critical</option>
            </select>
          </div>
        </div>
        <Table
          headers={["ID", "Date", "Supervisor", "Area", "Activity", "Node/XBOX", "Item", "Qty/Length", "Status"]}
          rows={fieldFiltered.map((record) => ({
            key: record.id,
            onClick: () => setSelectedRecord(record),
            cells: [
              record.id,
              record.date,
              record.supervisor,
              areaName(record.areaId),
              record.activityType,
              record.distributionNode,
              record.material,
              `${record.quantity.toLocaleString()} ${record.networkElement === "Cable" ? "m" : "pcs"}`,
              <span key={record.id} className={`${styles.badge} ${badgeClass(record.status)}`}>{record.status}</span>
            ]
          }))}
        />
      </article>
    </section>
  );

  const renderOperations = () => {
    const uniqueDates = Array.from(new Set(state.fieldRecords.map((record) => record.date)));
    const totalCable = sum(opsRecords.map((record) => record.actualLength));
    const countType = (type: FieldRecord["networkElement"]) => sum(opsRecords.filter((record) => record.networkElement === type).map((record) => record.quantity));
    return (
      <section className={styles.view}>
        <div className={styles.titleRow}>
          <div>
            <p className={styles.eyebrow}>Operational aggregation</p>
            <h1>Operations</h1>
          </div>
          <div className={styles.filters}>
            <select value={opsDate} onChange={(event) => setOpsDate(event.target.value)}>
              <option>All</option>
              {uniqueDates.map((date) => <option key={date}>{date}</option>)}
            </select>
            <select value={opsSupervisor} onChange={(event) => setOpsSupervisor(event.target.value)}>
              <option>All</option>
              {teams.map((team) => <option key={team.supervisor}>{team.supervisor}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.statGrid}>
          <StatCard label="Total Cable Deployed" value={formatMeters(totalCable)} note="Filtered actual length" />
          <StatCard label="END Boxes" value={countType("END").toString()} note="Field reported units" />
          <StatCard label="SUB Boxes" value={countType("SUB").toString()} note="Distribution layers" />
          <StatCard label="HUB Boxes" value={countType("HUB").toString()} note="Main aggregation nodes" />
          <StatCard label="XBOX Units" value={countType("XBOX").toString()} note="Distribution units" />
          <StatCard label="Records" value={opsRecords.length.toString()} note="Filtered activity rows" />
        </div>
        <div className={styles.gridTwo}>
          <article className={styles.panel}>
            <h2>Supervisor / Team Performance</h2>
            <div className={styles.leaderboard}>
              {teams.map((team, index) => (
                <div key={team.supervisor} className={styles.rankRow}>
                  <b>{index + 1}</b>
                  <div>
                    <strong>{team.supervisor}</strong>
                    <small>{team.team} - {areaName(team.areaId)}</small>
                    <div className={styles.track}><span style={{ width: `${team.productivityScore}%` }} /></div>
                  </div>
                  <em>{team.productivityScore}</em>
                </div>
              ))}
            </div>
          </article>
          <article className={styles.panel}>
            <h2>Area Comparison</h2>
            {areas.map((area) => (
              <ProgressRow key={area.id} label={area.name} actual={area.cableInstalled} planned={area.cablePlanned} />
            ))}
          </article>
        </div>
        <article className={styles.panel}>
          <h2>Operational Records</h2>
          <Table
            headers={["Date", "Area", "Supervisor", "Leader", "Activity", "Cable", "Boxes", "Note"]}
            rows={opsRecords.map((record) => ({
              key: record.id,
              cells: [
                record.date,
                areaName(record.areaId),
                record.supervisor,
                record.teamLeader,
                record.activityType,
                record.actualLength ? formatMeters(record.actualLength) : "-",
                record.networkElement !== "Cable" ? record.quantity : "-",
                record.notes
              ]
            }))}
          />
        </article>
      </section>
    );
  };

  const renderValidation = () => {
    const nodes = Array.from(new Set(networkElements.filter((element) => selectedAreaId === "All" || element.areaId === selectedAreaId).map((element) => element.distributionNode)));
    const counts = validationCounts(validationFiltered);
    return (
      <section className={styles.view}>
        <div className={styles.titleRow}>
          <div>
            <p className={styles.eyebrow}>Planned topology vs field record</p>
            <h1>Map / Network Validation</h1>
          </div>
          <div className={styles.legend}>
            <span><i className={styles.dotGood} /> GREEN = installed and matches design</span>
            <span><i className={styles.dotWarn} /> BLUE = installed but length/type differs</span>
            <span><i className={styles.dotBad} /> RED = missing</span>
          </div>
        </div>
        <div className={styles.filters}>
          <select value={selectedAreaId} onChange={(event) => { setSelectedAreaId(event.target.value); setSelectedNode("All"); }}>
            <option value="All">All areas</option>
            {areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
          </select>
          <select value={selectedNode} onChange={(event) => setSelectedNode(event.target.value)}>
            <option>All</option>
            {nodes.map((node) => <option key={node}>{node}</option>)}
          </select>
        </div>
        <div className={styles.statGrid}>
          <StatCard label="Box Match" value={counts.boxesMatched.toString()} note="Code and position match" />
          <StatCard label="Box Mismatch" value={counts.boxesMismatched.toString()} note="Installed but differs" />
          <StatCard label="Box Missing" value={counts.boxesMissing.toString()} note="Planned not found" />
          <StatCard label="Cable Correct" value={counts.cablesCorrect.toString()} note="Length/type accepted" />
          <StatCard label="Cable Mismatch" value={counts.cableLengthMismatch.toString()} note="Length or type differs" />
          <StatCard label="Cable Missing" value={counts.cablesMissing.toString()} note="No field record" />
        </div>
        <div className={styles.gridTwoWide}>
          <article className={`${styles.panel} ${styles.mapPanel}`}>
            <div className={styles.networkCanvas}>
              {validationFiltered.map((element, index) => (
                <button
                  key={element.id}
                  className={`${styles.networkNode} ${badgeClass(element.status)} ${selectedElementId === element.id ? styles.selectedNode : ""}`}
                  style={{ left: `${12 + (index % 4) * 23}%`, top: `${18 + Math.floor(index / 4) * 24}%` }}
                  onClick={() => setSelectedElementId(element.id)}
                >
                  <b>{element.type}</b>
                  <span>{element.plannedCode}</span>
                </button>
              ))}
              <div className={styles.mapLineOne} />
              <div className={styles.mapLineTwo} />
            </div>
          </article>
          <aside className={styles.panel}>
            <h2>Element Detail</h2>
            <NetworkDetail element={selectedElement} />
          </aside>
        </div>
        <article className={styles.panel}>
          <h2>Design vs Field Comparison Table</h2>
          <Table
            headers={["Area", "DN/XBOX", "Type", "Planned Code", "Actual Code", "Planned Length", "Actual Length", "Status"]}
            rows={validationFiltered.map((element) => ({
              key: element.id,
              onClick: () => setSelectedElementId(element.id),
              cells: [
                areaName(element.areaId),
                element.distributionNode,
                element.type,
                element.plannedCode,
                element.actualCode,
                element.plannedCableLength ? formatMeters(element.plannedCableLength) : "-",
                element.actualCableLength ? formatMeters(element.actualCableLength) : "-",
                <span key={element.id} className={`${styles.badge} ${badgeClass(element.status)}`}>{element.status}</span>
              ]
            }))}
          />
        </article>
      </section>
    );
  };

  const renderMaterials = () => (
    <section className={styles.view}>
      <div className={styles.titleRow}>
        <div>
          <p className={styles.eyebrow}>Issued material vs field usage</p>
          <h1>Warehouse vs Field</h1>
        </div>
        <div className={styles.filters}>
          <input placeholder="Search material, part or team" value={materialSearch} onChange={(event) => setMaterialSearch(event.target.value)} />
          <select value={materialStatus} onChange={(event) => setMaterialStatus(event.target.value)}>
            <option>All</option>
            <option>Reconciled</option>
            <option>Review Required</option>
            <option>Variance</option>
          </select>
        </div>
      </div>
      <div className={styles.statGrid}>
        <StatCard label="Issued Materials" value={sum(materialFiltered.map((row) => row.issued)).toLocaleString()} note="Filtered warehouse issued qty" />
        <StatCard label="Field Used" value={sum(materialFiltered.map((row) => row.fieldUsed)).toLocaleString()} note="Reported installed/used qty" />
        <StatCard label="Returned" value={sum(materialFiltered.map((row) => row.returned)).toLocaleString()} note="Returned to warehouse" />
        <StatCard label="Variance Rows" value={materialFiltered.filter((row) => row.status !== "Reconciled").length.toString()} note="Need reconciliation" />
      </div>
      <article className={styles.panel}>
        <Table
          headers={["Ref", "Area", "Team", "Item", "Part No.", "Issued", "Used", "Returned", "Expected", "Reported", "Variance", "Status"]}
          rows={materialFiltered.map((row) => {
            const variance = reconciliationVariance(row);
            return {
              key: row.id,
              cells: [
                row.id,
                areaName(row.areaId),
                row.team,
                row.material,
                row.partNumber,
                `${row.issued.toLocaleString()} ${row.unit}`,
                `${row.fieldUsed.toLocaleString()} ${row.unit}`,
                `${row.returned.toLocaleString()} ${row.unit}`,
                `${variance.expectedBalance.toLocaleString()} ${row.unit}`,
                `${row.reportedBalance.toLocaleString()} ${row.unit}`,
                `${variance.variance.toLocaleString()} ${row.unit}`,
                <span key={row.id} className={`${styles.badge} ${badgeClass(row.status)}`}>{row.status}</span>
              ]
            };
          })}
        />
      </article>
    </section>
  );

  const renderReport = () => {
    const report = areaReport(selectedArea, state);
    return (
      <section className={styles.view}>
        <div className={styles.titleRow}>
          <div>
            <p className={styles.eyebrow}>Management-ready consolidation</p>
            <h1>Area PDF / Area Report</h1>
          </div>
          <div className={styles.filters}>
            <select value={selectedAreaId === "All" ? selectedArea.id : selectedAreaId} onChange={(event) => setSelectedAreaId(event.target.value)}>
              {areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
            </select>
            <button className={styles.primaryButton} onClick={() => window.print()}>Print</button>
          </div>
        </div>
        <article className={`${styles.panel} ${styles.reportSheet}`}>
          <div className={styles.reportHeader}>
            <div>
              <h2>{selectedArea.name}</h2>
              <p>Fictional rollout area report prepared for public demo review.</p>
            </div>
            <span className={`${styles.badge} ${badgeClass(selectedArea.status)}`}>{selectedArea.status}</span>
          </div>
          <div className={styles.statGrid}>
            <StatCard label="Progress" value={`${selectedArea.actualProgress}%`} note={`${selectedArea.plannedProgress}% planned`} />
            <StatCard label="Cable" value={formatMeters(selectedArea.cableInstalled + report.cableToday)} note={`${formatMeters(selectedArea.cablePlanned)} planned`} />
            <StatCard label="Boxes" value={(selectedArea.boxesInstalled + report.boxesToday).toString()} note={`${selectedArea.boxesPlanned} planned`} />
            <StatCard label="Passed Users" value={selectedArea.passedUsers.toLocaleString()} note={`${selectedArea.plannedUsers.toLocaleString()} planned users`} />
          </div>
          <div className={styles.gridTwo}>
            <div>
              <h3>Milestones</h3>
              <dl className={styles.metaGrid}>
                <div><dt>Start</dt><dd>{selectedArea.startDate}</dd></div>
                <div><dt>Forecast Completion</dt><dd>{selectedArea.forecastCompletion}</dd></div>
                <div><dt>Field Teams</dt><dd>{selectedArea.fieldTeams}</dd></div>
                <div><dt>Open Issues</dt><dd>{report.issues.filter((issue) => issue.status !== "Resolved").length}</dd></div>
              </dl>
            </div>
            <div>
              <h3>Operational Project Note</h3>
              <p className={styles.noteBox}>
                Progress is calculated from fictional field records, planned area targets, design validation outcomes and
                warehouse reconciliation rows. Any mismatch requires supervisor confirmation before closure.
              </p>
            </div>
          </div>
          <Table
            headers={["Issue", "Severity", "Owner", "Status", "Note"]}
            rows={report.issues.map((issue) => ({
              key: issue.id,
              cells: [
                issue.type,
                <span key={issue.id} className={`${styles.badge} ${badgeClass(issue.severity)}`}>{issue.severity}</span>,
                issue.owner,
                issue.status,
                issue.note
              ]
            }))}
          />
        </article>
      </section>
    );
  };

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <strong>FTTH Rollout</strong>
          <span>Operational Control Demo</span>
        </div>
        <p className={styles.demoBadge}>Demo Environment — Sample Data Only</p>
        <nav className={styles.nav}>
          {sections.map((section) => (
            <button
              key={section.key}
              className={activeSection === section.key ? styles.activeNav : ""}
              onClick={() => setActiveSection(section.key)}
            >
              <strong>{section.label}</strong>
              <span>{section.caption}</span>
            </button>
          ))}
        </nav>
        <button className={styles.resetButton} onClick={resetDemo}>Reset Demo Data</button>
      </aside>

      <div className={styles.workspace}>
        {toast && (
          <button className={styles.toast} onClick={() => setToast("")}>
            {toast}
          </button>
        )}
        {activeSection === "overview" && renderDashboard()}
        {activeSection === "field" && renderFieldEntry()}
        {activeSection === "operations" && renderOperations()}
        {activeSection === "report" && renderReport()}
        {activeSection === "validation" && renderValidation()}
        {activeSection === "materials" && renderMaterials()}
      </div>
    </main>
  );
}

function NetworkDetail({ element }: { element: NetworkElement }) {
  const lengthDelta = element.actualCableLength - element.plannedCableLength;
  return (
    <div className={styles.detailStack}>
      <span className={`${styles.badge} ${badgeClass(element.status)}`}>{element.status}</span>
      <h3>{element.id}</h3>
      <dl className={styles.metaGrid}>
        <div><dt>Area</dt><dd>{areaName(element.areaId)}</dd></div>
        <div><dt>Distribution Node</dt><dd>{element.distributionNode}</dd></div>
        <div><dt>Element Type</dt><dd>{element.type}</dd></div>
        <div><dt>Planned Code</dt><dd>{element.plannedCode}</dd></div>
        <div><dt>Actual Code</dt><dd>{element.actualCode}</dd></div>
        <div><dt>Length Delta</dt><dd>{formatMeters(lengthDelta)}</dd></div>
      </dl>
      <p className={styles.noteBox}>
        Validation compares planned topology with field submitted installation records. Match, mismatch and missing states
        are sample public-demo outcomes only.
      </p>
    </div>
  );
}

function Table({
  headers,
  rows
}: {
  headers: string[];
  rows: { key: string; cells: ReactNode[]; onClick?: () => void }[];
}) {
  if (rows.length === 0) {
    return <p className={styles.empty}>No sample records match the current filters.</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table>
        <thead>
          <tr>
            {headers.map((header) => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} onClick={row.onClick} className={row.onClick ? styles.clickableRow : ""}>
              {row.cells.map((cell, index) => <td key={`${row.key}-${index}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
