"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import styles from "./site-survey.module.css";
import { activities, areas, buildings, infrastructure, surveyRecords, technicians } from "./lib/data";
import {
  areaName,
  buildingsForArea,
  cloneState,
  dashboardStats,
  infrastructureForArea,
  percent,
  qualityBreakdown,
  statusFromIssues,
  sum,
  technicianSummary,
  typeBreakdown,
  validateBuilding,
  validateInfrastructure
} from "./lib/helpers";
import type {
  AreaId,
  Building,
  Evidence,
  InfrastructurePoint,
  SectionKey,
  SurveyRecord,
  SurveyState,
  SurveyType
} from "./lib/types";

const sections: { key: SectionKey; label: string; caption: string }[] = [
  { key: "dashboard", label: "Survey Dashboard", caption: "Progress, quality and productivity" },
  { key: "entry", label: "Field Survey Entry", caption: "Building, pole and route capture" },
  { key: "buildings", label: "Buildings & Premises", caption: "Consolidated premises database" },
  { key: "poles", label: "Poles & Infrastructure", caption: "Pole and route point inventory" },
  { key: "map", label: "Map & Validation", caption: "Schematic survey map" }
];

const initialState: SurveyState = {
  records: cloneState(surveyRecords),
  buildings: cloneState(buildings),
  infrastructure: cloneState(infrastructure),
  activities: cloneState(activities)
};

const sampleEvidence = ["Building Front", "Entrance", "Pole", "Route", "Obstruction", "Other"];

const blankForm = {
  date: "2026-08-29",
  technician: "Nadia Salem",
  team: "Survey Team North",
  city: "Harborview",
  areaId: "ZONE-A" as AreaId,
  surveyType: "Building" as SurveyType,
  latitude: "32.018940",
  longitude: "35.872910",
  gpsAccuracy: "5",
  streetRef: "Block A / Sample Street",
  locationNotes: "Sample point captured during demo workflow.",
  buildingId: "BLD-A-099",
  buildingType: "Residential",
  buildingStatus: "Occupied",
  floors: "4",
  entrances: "1",
  units: "16",
  occupiedUnits: "14",
  estimatedPremises: "16",
  commercialUnits: "0",
  existingTelecom: "Copper entry visible",
  accessType: "Entrance access available",
  facadeType: "External facade route",
  dropCableAccess: "Nearest pole route clear",
  closestNetworkPoint: "POL-A-001",
  distanceToNetwork: "42",
  difficulty: "Medium",
  powerAvailability: "Common area power available",
  poleId: "POL-A-099",
  poleType: "Distribution pole",
  poleMaterial: "Concrete",
  existingOrProposed: "Existing",
  poleCondition: "Suitable",
  heightMeters: "8",
  mountingAvailability: "Two mounting positions available",
  existingCables: "Low density telecom cables",
  spaceAvailable: "Available",
  roadSide: "North side",
  accessCondition: "Clear sidewalk access",
  nearbyBuildingCount: "6",
  distributionUse: "END box mounting",
  poleInstallationRequired: "No",
  civilWorkRequired: "No",
  pointType: "Route point",
  routeType: "Aerial",
  existingDuct: "N/A",
  chamberOrManhole: "N/A",
  roadCrossing: "No",
  obstruction: "None",
  estimatedRouteDistance: "88",
  notes: "Fictional public demo record."
};

function badgeClass(value: string) {
  if (value === "Validated" || value === "Suitable" || value === "Easy" || value === "No") return styles.good;
  if (value === "Review Required" || value === "Medium" || value === "Replacement Recommended") return styles.warn;
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

function ProgressRow({ label, done, total }: { label: string; done: number; total: number }) {
  const value = percent(done, total);
  return (
    <div className={styles.progressRow}>
      <div>
        <strong>{label}</strong>
        <span>
          {done.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div className={styles.track}>
        <span style={{ width: `${value}%` }} />
      </div>
      <b>{value}%</b>
    </div>
  );
}

export default function SiteSurveyDemoPage() {
  const [state, setState] = useState<SurveyState>(initialState);
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [selectedAreaId, setSelectedAreaId] = useState<AreaId | "All">("All");
  const [selectedRecord, setSelectedRecord] = useState<SurveyRecord | null>(state.records[0]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(state.buildings[0]);
  const [selectedPoint, setSelectedPoint] = useState<InfrastructurePoint | null>(state.infrastructure[0]);
  const [selectedMapId, setSelectedMapId] = useState(state.buildings[0].id);
  const [recordSearch, setRecordSearch] = useState("");
  const [technicianFilter, setTechnicianFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<SurveyType | "All">("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [buildingTypeFilter, setBuildingTypeFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [civilFilter, setCivilFilter] = useState("All");
  const [mapTypeFilter, setMapTypeFilter] = useState<SurveyType | "All">("All");
  const [form, setForm] = useState(blankForm);
  const [evidence, setEvidence] = useState<Evidence[]>(sampleEvidence.map((label, index) => ({ id: `FORM-EV-${index}`, label, added: index < 2 })));
  const [toast, setToast] = useState("");

  const stats = dashboardStats(state);

  const filteredRecords = useMemo(() => {
    const query = recordSearch.toLowerCase();
    return state.records.filter((record) => {
      const areaMatch = selectedAreaId === "All" || record.areaId === selectedAreaId;
      const technicianMatch = technicianFilter === "All" || record.technician === technicianFilter;
      const typeMatch = typeFilter === "All" || record.surveyType === typeFilter;
      const statusMatch = statusFilter === "All" || record.validationStatus === statusFilter;
      const searchMatch = [record.id, record.objectId, record.streetRef, record.technician, record.city]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return areaMatch && technicianMatch && typeMatch && statusMatch && searchMatch;
    });
  }, [recordSearch, selectedAreaId, state.records, statusFilter, technicianFilter, typeFilter]);

  const filteredBuildings = state.buildings.filter((building) => {
    const areaMatch = selectedAreaId === "All" || building.areaId === selectedAreaId;
    const typeMatch = buildingTypeFilter === "All" || building.type === buildingTypeFilter;
    const difficultyMatch = difficultyFilter === "All" || building.difficulty === difficultyFilter;
    const statusMatch = statusFilter === "All" || building.validationStatus === statusFilter;
    return areaMatch && typeMatch && difficultyMatch && statusMatch;
  });

  const filteredInfrastructure = state.infrastructure.filter((point) => {
    const areaMatch = selectedAreaId === "All" || point.areaId === selectedAreaId;
    const typeMatch = typeFilter === "All" || point.surveyType === typeFilter;
    const statusMatch = statusFilter === "All" || point.validationStatus === statusFilter;
    const civilMatch = civilFilter === "All" || (civilFilter === "Yes") === point.civilWorkRequired;
    return areaMatch && typeMatch && statusMatch && civilMatch;
  });

  const mapObjects = [
    ...state.buildings.map((building) => ({ kind: "Building" as SurveyType, id: building.id, areaId: building.areaId, status: building.validationStatus, object: building })),
    ...state.infrastructure.map((point) => ({ kind: point.surveyType, id: point.id, areaId: point.areaId, status: point.validationStatus, object: point }))
  ].filter((item) => {
    const areaMatch = selectedAreaId === "All" || item.areaId === selectedAreaId;
    const typeMatch = mapTypeFilter === "All" || item.kind === mapTypeFilter;
    const statusMatch = statusFilter === "All" || item.status === statusFilter;
    return areaMatch && typeMatch && statusMatch;
  });

  const selectedMapObject = mapObjects.find((item) => item.id === selectedMapId) ?? mapObjects[0];

  const useSampleGps = () => {
    setForm({ ...form, latitude: "32.020510", longitude: "35.879240", gpsAccuracy: "4" });
    setToast("Sample GPS applied. No browser geolocation was requested.");
  };

  const toggleEvidence = (id: string) => {
    setEvidence((current) => current.map((item) => (item.id === id ? { ...item, added: !item.added } : item)));
  };

  const createSurveyRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const gpsAccuracy = Number(form.gpsAccuracy);
    const baseId = `SUR-${form.areaId.replace("ZONE-", "")}-${String(state.records.length + 1).padStart(4, "0")}`;
    const activeEvidence = evidence.filter((item) => item.added);

    if (form.surveyType === "Building") {
      const building: Building = {
        id: form.buildingId,
        surveyId: baseId,
        date: form.date,
        technician: form.technician,
        team: form.team,
        city: form.city,
        areaId: form.areaId,
        latitude: form.latitude,
        longitude: form.longitude,
        gpsAccuracy,
        streetRef: form.streetRef,
        type: form.buildingType as Building["type"],
        status: form.buildingStatus as Building["status"],
        floors: Number(form.floors),
        entrances: Number(form.entrances),
        units: Number(form.units),
        occupiedUnits: Number(form.occupiedUnits),
        estimatedPremises: Number(form.estimatedPremises),
        commercialUnits: Number(form.commercialUnits),
        existingTelecom: form.existingTelecom,
        accessType: form.accessType,
        facadeType: form.facadeType,
        dropCableAccess: form.dropCableAccess,
        closestNetworkPoint: form.closestNetworkPoint,
        distanceToNetwork: Number(form.distanceToNetwork),
        difficulty: form.difficulty as Building["difficulty"],
        powerAvailability: form.powerAvailability,
        validationStatus: "Validated",
        validationIssues: [],
        evidence: activeEvidence,
        notes: form.notes
      };
      building.validationIssues = validateBuilding(building);
      building.validationStatus = statusFromIssues(building.validationIssues);
      const record = toRecord(building, "Building");
      setState((current) => ({
        ...current,
        buildings: [building, ...current.buildings],
        records: [record, ...current.records],
        activities: [newActivity(baseId, form.areaId, form.technician, "Building survey submitted", `${building.id} captured with ${building.estimatedPremises} premises.`), ...current.activities]
      }));
      setSelectedBuilding(building);
      setSelectedRecord(record);
      setSelectedMapId(building.id);
      setToast(`${baseId} created and validation status set to ${building.validationStatus}.`);
      return;
    }

    const point: InfrastructurePoint = {
      id: form.surveyType === "Infrastructure Point" ? form.pointType.replaceAll(" ", "-").toUpperCase().slice(0, 3) + `-${form.areaId.slice(-1)}-099` : form.poleId,
      surveyId: baseId,
      date: form.date,
      technician: form.technician,
      team: form.team,
      city: form.city,
      areaId: form.areaId,
      latitude: form.latitude,
      longitude: form.longitude,
      gpsAccuracy,
      streetRef: form.streetRef,
      surveyType: form.surveyType as InfrastructurePoint["surveyType"],
      poleType: form.poleType,
      poleMaterial: form.poleMaterial,
      existingOrProposed: form.existingOrProposed as InfrastructurePoint["existingOrProposed"],
      condition: form.poleCondition as InfrastructurePoint["condition"],
      heightMeters: Number(form.heightMeters),
      mountingAvailability: form.mountingAvailability,
      existingCables: form.existingCables,
      spaceAvailable: form.spaceAvailable,
      roadSide: form.roadSide,
      accessCondition: form.accessCondition,
      nearbyBuildingCount: Number(form.nearbyBuildingCount),
      distributionUse: form.distributionUse,
      poleInstallationRequired: form.poleInstallationRequired === "Yes",
      civilWorkRequired: form.civilWorkRequired === "Yes",
      pointType: form.pointType,
      routeType: form.routeType as InfrastructurePoint["routeType"],
      existingDuct: form.existingDuct,
      chamberOrManhole: form.chamberOrManhole,
      roadCrossing: form.roadCrossing,
      obstruction: form.obstruction,
      estimatedRouteDistance: Number(form.estimatedRouteDistance),
      validationStatus: "Validated",
      validationIssues: [],
      relatedBuildings: state.buildings.filter((building) => building.areaId === form.areaId).slice(0, 2).map((building) => building.id),
      evidence: activeEvidence,
      notes: form.notes
    };
    point.validationIssues = validateInfrastructure(point);
    point.validationStatus = statusFromIssues(point.validationIssues);
    const record = toRecord(point, point.surveyType);
    setState((current) => ({
      ...current,
      infrastructure: [point, ...current.infrastructure],
      records: [record, ...current.records],
      activities: [newActivity(baseId, form.areaId, form.technician, `${point.surveyType} submitted`, `${point.id} captured for infrastructure validation.`), ...current.activities]
    }));
    setSelectedPoint(point);
    setSelectedRecord(record);
    setSelectedMapId(point.id);
    setToast(`${baseId} created and validation status set to ${point.validationStatus}.`);
  };

  const resetDemo = () => {
    setState(cloneState(initialState));
    setSelectedAreaId("All");
    setSelectedRecord(initialState.records[0]);
    setSelectedBuilding(initialState.buildings[0]);
    setSelectedPoint(initialState.infrastructure[0]);
    setSelectedMapId(initialState.buildings[0].id);
    setToast("Demo data reset to the fictional sample baseline.");
  };

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <strong>FTTH Survey</strong>
          <span>Infrastructure Intelligence</span>
        </div>
        <p className={styles.demoBadge}>Demo Environment — Sample Data Only</p>
        <nav className={styles.nav}>
          {sections.map((section) => (
            <button key={section.key} className={activeSection === section.key ? styles.activeNav : ""} onClick={() => setActiveSection(section.key)}>
              <strong>{section.label}</strong>
              <span>{section.caption}</span>
            </button>
          ))}
        </nav>
        <button className={styles.resetButton} onClick={resetDemo}>Reset Demo Data</button>
      </aside>

      <div className={styles.workspace}>
        {toast ? <button className={styles.toast} onClick={() => setToast("")}>{toast}</button> : null}
        {activeSection === "dashboard" ? renderDashboard() : null}
        {activeSection === "entry" ? renderEntry() : null}
        {activeSection === "buildings" ? renderBuildings() : null}
        {activeSection === "poles" ? renderPoles() : null}
        {activeSection === "map" ? renderMap() : null}
      </div>
    </main>
  );

  function renderDashboard() {
    return (
      <section className={styles.view}>
        <Title eyebrow="Survey command center" title="Survey Dashboard">
          <AreaSelect value={selectedAreaId} onChange={setSelectedAreaId} includeAll />
        </Title>
        <div className={styles.statGrid}>
          <StatCard label="Total Survey Points" value={stats.totalPoints.toString()} note="Buildings, poles and route points" />
          <StatCard label="Surveyed Buildings" value={stats.surveyedBuildings.toString()} note="Captured building profiles" />
          <StatCard label="Surveyed Poles" value={stats.surveyedPoles.toString()} note="Existing and proposed poles" />
          <StatCard label="Premises / Users Captured" value={stats.premises.toLocaleString()} note="Fictional planning estimate" />
          <StatCard label="Survey Completion" value={`${stats.completion}%`} note={`${stats.completed} of ${stats.planned} planned points`} />
          <StatCard label="Missing GPS Records" value={stats.missingGps.toString()} note="Require field correction" />
        </div>
        <div className={styles.gridTwo}>
          <article className={styles.panel}>
            <h2>Survey Progress</h2>
            <ProgressRow label="All survey points" done={stats.completed} total={stats.planned} />
            {areas.map((area) => (
              <ProgressRow key={area.id} label={area.name} done={area.completedPoints} total={area.plannedPoints} />
            ))}
          </article>
          <article className={styles.panel}>
            <h2>Progress by Area</h2>
            <Table
              headers={["Area", "Planned", "Completed", "Buildings", "Poles", "Premises", "Status"]}
              rows={areas.map((area) => ({
                key: area.id,
                cells: [area.name, area.plannedPoints, area.completedPoints, area.buildings, area.poles, area.premises, <Badge key={area.id} value={area.status} />]
              }))}
            />
          </article>
        </div>
        <div className={styles.gridThree}>
          <BreakdownPanel title="Survey Type Breakdown" rows={typeBreakdown(state.records)} />
          <BreakdownPanel title="Data Quality" rows={qualityBreakdown(state.records)} />
          <article className={styles.panel}>
            <h2>Technician Productivity</h2>
            <div className={styles.list}>
              {technicianSummary(state.records).map((item) => (
                <div className={styles.listItem} key={item.technician}>
                  <strong>{item.technician}</strong>
                  <small>{item.records} records - {item.valid} valid - {item.review} review</small>
                  <div className={styles.track}><span style={{ width: `${percent(item.valid, item.records)}%` }} /></div>
                </div>
              ))}
            </div>
          </article>
        </div>
        <article className={styles.panel}>
          <h2>Recent Field Activity</h2>
          <div className={styles.activityGrid}>
            {state.activities.slice(0, 6).map((activity) => (
              <div className={styles.activity} key={activity.id}>
                <span>{activity.time}</span>
                <strong>{activity.title}</strong>
                <p>{activity.note}</p>
                <small>{activity.technician} - {areaName(activity.areaId)}</small>
              </div>
            ))}
          </div>
        </article>
      </section>
    );
  }

  function renderEntry() {
    return (
      <section className={styles.view}>
        <Title eyebrow="Frontend-only sample capture" title="Field Survey Entry">
          <button className={styles.secondaryButton} onClick={useSampleGps}>Use Sample GPS</button>
        </Title>
        <div className={styles.gridTwoWide}>
          <form className={styles.panel} onSubmit={createSurveyRecord}>
            <div className={styles.panelHeader}>
              <h2>Survey Record Form</h2>
              <button className={styles.primaryButton} type="submit">Create Survey Record</button>
            </div>
            <div className={styles.formGrid}>
              <Input label="Date" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} />
              <Select label="Technician" value={form.technician} values={technicians} onChange={(value) => setForm({ ...form, technician: value })} />
              <Input label="Team" value={form.team} onChange={(value) => setForm({ ...form, team: value })} />
              <Input label="City" value={form.city} onChange={(value) => setForm({ ...form, city: value })} />
              <AreaSelect label="Area" value={form.areaId} onChange={(value) => setForm({ ...form, areaId: value as AreaId })} />
              <Select label="Survey Type" value={form.surveyType} values={["Building", "Existing Pole", "New Pole Location", "Infrastructure Point"]} onChange={(value) => setForm({ ...form, surveyType: value as SurveyType })} />
              <Input label="Latitude" value={form.latitude} onChange={(value) => setForm({ ...form, latitude: value })} />
              <Input label="Longitude" value={form.longitude} onChange={(value) => setForm({ ...form, longitude: value })} />
              <Input label="GPS Accuracy" type="number" value={form.gpsAccuracy} onChange={(value) => setForm({ ...form, gpsAccuracy: value })} />
              <Input label="Street / Zone Reference" value={form.streetRef} onChange={(value) => setForm({ ...form, streetRef: value })} />
              <Input label="Location Notes" value={form.locationNotes} onChange={(value) => setForm({ ...form, locationNotes: value })} />
            </div>
            {form.surveyType === "Building" ? buildingFields() : poleFields()}
            <div className={styles.evidenceBox}>
              <div>
                <h3>Demo photo evidence</h3>
                <p>No uploads are stored. These toggles simulate sample field attachments.</p>
              </div>
              <div className={styles.evidenceGrid}>
                {evidence.map((item) => (
                  <button type="button" key={item.id} className={item.added ? styles.evidenceActive : ""} onClick={() => toggleEvidence(item.id)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
          <aside className={styles.panel}>
            <h2>Selected Survey Record</h2>
            {selectedRecord ? <RecordDetail record={selectedRecord} /> : <p className={styles.empty}>Select or create a survey record.</p>}
          </aside>
        </div>
        <RecordsTable
          records={filteredRecords}
          onSelect={setSelectedRecord}
          controls={
            <div className={styles.filters}>
              <input
                placeholder="Search survey, object, technician or street"
                value={recordSearch}
                onChange={(event) => setRecordSearch(event.target.value)}
              />
              <AreaSelect value={selectedAreaId} onChange={setSelectedAreaId} includeAll />
              <Select value={technicianFilter} values={["All", ...technicians]} onChange={setTechnicianFilter} />
              <Select value={typeFilter} values={["All", "Building", "Existing Pole", "New Pole Location", "Infrastructure Point"]} onChange={(value) => setTypeFilter(value as SurveyType | "All")} />
              <Select value={statusFilter} values={["All", "Validated", "Review Required", "Incomplete"]} onChange={setStatusFilter} />
            </div>
          }
        />
      </section>
    );
  }

  function buildingFields() {
    return (
      <div className={styles.formSection}>
        <h3>Building Survey Fields</h3>
        <div className={styles.formGrid}>
          <Input label="Building ID" value={form.buildingId} onChange={(value) => setForm({ ...form, buildingId: value })} />
          <Select label="Building Type" value={form.buildingType} values={["Residential", "Commercial", "Mixed Use", "Villa", "Apartment Block"]} onChange={(value) => setForm({ ...form, buildingType: value })} />
          <Select label="Building Status" value={form.buildingStatus} values={["Occupied", "Partially Occupied", "Under Construction", "Vacant"]} onChange={(value) => setForm({ ...form, buildingStatus: value })} />
          <Input label="Number of Floors" type="number" value={form.floors} onChange={(value) => setForm({ ...form, floors: value })} />
          <Input label="Number of Entrances" type="number" value={form.entrances} onChange={(value) => setForm({ ...form, entrances: value })} />
          <Input label="Apartments / Units" type="number" value={form.units} onChange={(value) => setForm({ ...form, units: value })} />
          <Input label="Occupied Units" type="number" value={form.occupiedUnits} onChange={(value) => setForm({ ...form, occupiedUnits: value })} />
          <Input label="Estimated Users / Premises" type="number" value={form.estimatedPremises} onChange={(value) => setForm({ ...form, estimatedPremises: value })} />
          <Input label="Commercial Units" type="number" value={form.commercialUnits} onChange={(value) => setForm({ ...form, commercialUnits: value })} />
          <Input label="Existing Telecom Infrastructure" value={form.existingTelecom} onChange={(value) => setForm({ ...form, existingTelecom: value })} />
          <Input label="Building Access Type" value={form.accessType} onChange={(value) => setForm({ ...form, accessType: value })} />
          <Input label="Facade / Installation Type" value={form.facadeType} onChange={(value) => setForm({ ...form, facadeType: value })} />
          <Input label="Drop Cable Access" value={form.dropCableAccess} onChange={(value) => setForm({ ...form, dropCableAccess: value })} />
          <Input label="Closest Pole / Distribution Point" value={form.closestNetworkPoint} onChange={(value) => setForm({ ...form, closestNetworkPoint: value })} />
          <Input label="Estimated Distance to Network" type="number" value={form.distanceToNetwork} onChange={(value) => setForm({ ...form, distanceToNetwork: value })} />
          <Select label="Installation Difficulty" value={form.difficulty} values={["Easy", "Medium", "Difficult"]} onChange={(value) => setForm({ ...form, difficulty: value })} />
          <Input label="Power Availability" value={form.powerAvailability} onChange={(value) => setForm({ ...form, powerAvailability: value })} />
          <Input label="Notes" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} wide />
        </div>
      </div>
    );
  }

  function poleFields() {
    return (
      <div className={styles.formSection}>
        <h3>{form.surveyType === "Infrastructure Point" ? "Infrastructure / Route Point Fields" : "Pole Survey Fields"}</h3>
        <div className={styles.formGrid}>
          <Input label="Pole ID" value={form.poleId} onChange={(value) => setForm({ ...form, poleId: value })} />
          <Input label="Pole Type" value={form.poleType} onChange={(value) => setForm({ ...form, poleType: value })} />
          <Input label="Pole Material" value={form.poleMaterial} onChange={(value) => setForm({ ...form, poleMaterial: value })} />
          <Select label="Existing / Proposed" value={form.existingOrProposed} values={["Existing", "Proposed"]} onChange={(value) => setForm({ ...form, existingOrProposed: value })} />
          <Select label="Pole Condition" value={form.poleCondition} values={["Suitable", "Review Required", "Damaged", "Replacement Recommended", "New Pole Required"]} onChange={(value) => setForm({ ...form, poleCondition: value })} />
          <Input label="Approximate Height" type="number" value={form.heightMeters} onChange={(value) => setForm({ ...form, heightMeters: value })} />
          <Input label="Mounting Availability" value={form.mountingAvailability} onChange={(value) => setForm({ ...form, mountingAvailability: value })} />
          <Input label="Existing Cables" value={form.existingCables} onChange={(value) => setForm({ ...form, existingCables: value })} />
          <Input label="Space Available" value={form.spaceAvailable} onChange={(value) => setForm({ ...form, spaceAvailable: value })} />
          <Input label="Road Side" value={form.roadSide} onChange={(value) => setForm({ ...form, roadSide: value })} />
          <Input label="Access Condition" value={form.accessCondition} onChange={(value) => setForm({ ...form, accessCondition: value })} />
          <Input label="Nearby Building Count" type="number" value={form.nearbyBuildingCount} onChange={(value) => setForm({ ...form, nearbyBuildingCount: value })} />
          <Input label="Distribution Use" value={form.distributionUse} onChange={(value) => setForm({ ...form, distributionUse: value })} />
          <Select label="Pole Installation Required" value={form.poleInstallationRequired} values={["No", "Yes"]} onChange={(value) => setForm({ ...form, poleInstallationRequired: value })} />
          <Select label="Civil Work Required" value={form.civilWorkRequired} values={["No", "Yes"]} onChange={(value) => setForm({ ...form, civilWorkRequired: value })} />
          <Input label="Point Type" value={form.pointType} onChange={(value) => setForm({ ...form, pointType: value })} />
          <Select label="Route Type" value={form.routeType} values={["Underground", "Aerial", "Mixed"]} onChange={(value) => setForm({ ...form, routeType: value })} />
          <Input label="Existing Duct" value={form.existingDuct} onChange={(value) => setForm({ ...form, existingDuct: value })} />
          <Input label="Chamber / Manhole" value={form.chamberOrManhole} onChange={(value) => setForm({ ...form, chamberOrManhole: value })} />
          <Input label="Road Crossing" value={form.roadCrossing} onChange={(value) => setForm({ ...form, roadCrossing: value })} />
          <Input label="Obstruction" value={form.obstruction} onChange={(value) => setForm({ ...form, obstruction: value })} />
          <Input label="Estimated Route Distance" type="number" value={form.estimatedRouteDistance} onChange={(value) => setForm({ ...form, estimatedRouteDistance: value })} />
          <Input label="Notes" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} wide />
        </div>
      </div>
    );
  }

  function renderBuildings() {
    const scoped = buildingsForArea(state.buildings, selectedAreaId);
    return (
      <section className={styles.view}>
        <Title eyebrow="Premises and access intelligence" title="Buildings & Premises">
          <FilterGroup />
        </Title>
        <div className={styles.statGrid}>
          <StatCard label="Total Buildings" value={scoped.length.toString()} note="Filtered building records" />
          <StatCard label="Residential Buildings" value={scoped.filter((item) => ["Residential", "Villa", "Apartment Block"].includes(item.type)).length.toString()} note="Residential survey base" />
          <StatCard label="Commercial Buildings" value={scoped.filter((item) => item.type === "Commercial" || item.commercialUnits > 0).length.toString()} note="Commercial or mixed units" />
          <StatCard label="Total Units" value={sum(scoped.map((item) => item.units)).toString()} note="Captured units" />
          <StatCard label="Occupied Units" value={sum(scoped.map((item) => item.occupiedUnits)).toString()} note="Occupied sample count" />
          <StatCard label="Ready for FTTH" value={scoped.filter((item) => item.validationStatus === "Validated").length.toString()} note="Validated records" />
        </div>
        <div className={styles.gridTwoWide}>
          <article className={styles.panel}>
            <Table
              headers={["Building ID", "Area", "Type", "Floors", "Units", "Occupied", "Users", "Closest Point", "Distance", "Difficulty", "Status"]}
              rows={filteredBuildings.map((building) => ({
                key: building.id,
                onClick: () => setSelectedBuilding(building),
                cells: [building.id, areaName(building.areaId), building.type, building.floors, building.units, building.occupiedUnits, building.estimatedPremises, building.closestNetworkPoint, `${building.distanceToNetwork} m`, <Badge key={`${building.id}-diff`} value={building.difficulty} />, <Badge key={building.id} value={building.validationStatus} />]
              }))}
            />
          </article>
          <aside className={styles.panel}>
            <h2>Building Detail</h2>
            {selectedBuilding ? <BuildingDetail building={selectedBuilding} /> : <p className={styles.empty}>Select a building.</p>}
          </aside>
        </div>
      </section>
    );
  }

  function renderPoles() {
    const scoped = infrastructureForArea(state.infrastructure, selectedAreaId);
    return (
      <section className={styles.view}>
        <Title eyebrow="Pole and route inventory" title="Poles & Infrastructure">
          <InfrastructureFilters />
        </Title>
        <div className={styles.statGrid}>
          <StatCard label="Existing Poles" value={scoped.filter((item) => item.surveyType === "Existing Pole").length.toString()} note="Surveyed existing poles" />
          <StatCard label="Suitable Poles" value={scoped.filter((item) => item.condition === "Suitable").length.toString()} note="Available for FTTH mounting" />
          <StatCard label="Poles Requiring Review" value={scoped.filter((item) => item.validationStatus === "Review Required").length.toString()} note="Engineering follow-up" />
          <StatCard label="New Poles Required" value={scoped.filter((item) => item.poleInstallationRequired).length.toString()} note="Proposed or replacement poles" />
          <StatCard label="Civil Work Points" value={scoped.filter((item) => item.civilWorkRequired).length.toString()} note="Requires civil planning" />
          <StatCard label="Route Obstructions" value={scoped.filter((item) => item.obstruction !== "None").length.toString()} note="Field constraints" />
        </div>
        <div className={styles.gridTwoWide}>
          <article className={styles.panel}>
            <Table
              headers={["Pole / Point ID", "Area", "Type", "GPS", "Condition", "Existing / Proposed", "Nearby Premises", "Civil Work", "Status"]}
              rows={filteredInfrastructure.map((point) => ({
                key: point.id,
                onClick: () => setSelectedPoint(point),
                cells: [point.id, areaName(point.areaId), point.surveyType, gpsText(point), <Badge key={`${point.id}-condition`} value={point.condition} />, point.existingOrProposed, point.nearbyBuildingCount, point.civilWorkRequired ? "Yes" : "No", <Badge key={point.id} value={point.validationStatus} />]
              }))}
            />
          </article>
          <aside className={styles.panel}>
            <h2>Infrastructure Detail</h2>
            {selectedPoint ? <InfrastructureDetail point={selectedPoint} state={state} /> : <p className={styles.empty}>Select a pole or infrastructure point.</p>}
          </aside>
        </div>
      </section>
    );
  }

  function renderMap() {
    return (
      <section className={styles.view}>
        <Title eyebrow="Schematic Survey Map — Not to Scale" title="Map & Validation">
          <div className={styles.filters}>
            <AreaSelect value={selectedAreaId} onChange={setSelectedAreaId} includeAll />
            <Select value={mapTypeFilter} values={["All", "Building", "Existing Pole", "New Pole Location", "Infrastructure Point"]} onChange={(value) => setMapTypeFilter(value as SurveyType | "All")} />
            <Select value={statusFilter} values={["All", "Validated", "Review Required", "Incomplete"]} onChange={setStatusFilter} />
          </div>
        </Title>
        <div className={styles.legend}>
          <span><i className={styles.squareIcon} /> Building</span>
          <span><i className={styles.circleIcon} /> Existing pole</span>
          <span><i className={styles.outlineCircleIcon} /> Proposed pole</span>
          <span><i className={styles.diamondIcon} /> Infrastructure point</span>
        </div>
        <div className={styles.gridTwoWide}>
          <article className={`${styles.panel} ${styles.mapPanel}`}>
            <div className={styles.mapCanvas}>
              {mapObjects.map((item, index) => (
                <button
                  key={item.id}
                  className={`${styles.mapPoint} ${mapShape(item.kind)} ${badgeClass(item.status)} ${selectedMapId === item.id ? styles.selectedPoint : ""}`}
                  style={{ left: `${10 + (index % 5) * 17}%`, top: `${16 + Math.floor(index / 5) * 24}%` }}
                  onClick={() => setSelectedMapId(item.id)}
                >
                  <span>{item.id}</span>
                </button>
              ))}
              <div className={styles.routeLineA} />
              <div className={styles.routeLineB} />
            </div>
          </article>
          <aside className={styles.panel}>
            <h2>Selected Survey Object</h2>
            {selectedMapObject ? <MapDetail object={selectedMapObject.object} kind={selectedMapObject.kind} /> : <p className={styles.empty}>No map objects match current filters.</p>}
          </aside>
        </div>
        <article className={styles.panel}>
          <h2>Data Quality / Validation Panel</h2>
          <Table
            headers={["Object", "Type", "Area", "GPS", "Status", "Issues"]}
            rows={mapObjects.map((item) => ({
              key: item.id,
              cells: [item.id, item.kind, areaName(item.areaId), gpsText(item.object), <Badge key={item.id} value={item.status} />, issueText(item.object.validationIssues)]
            }))}
          />
        </article>
      </section>
    );
  }

  function FilterGroup() {
    return (
      <div className={styles.filters}>
        <AreaSelect value={selectedAreaId} onChange={setSelectedAreaId} includeAll />
        <Select value={buildingTypeFilter} values={["All", "Residential", "Commercial", "Mixed Use", "Villa", "Apartment Block"]} onChange={setBuildingTypeFilter} />
        <Select value={statusFilter} values={["All", "Validated", "Review Required", "Incomplete"]} onChange={setStatusFilter} />
        <Select value={difficultyFilter} values={["All", "Easy", "Medium", "Difficult"]} onChange={setDifficultyFilter} />
      </div>
    );
  }

  function InfrastructureFilters() {
    return (
      <div className={styles.filters}>
        <AreaSelect value={selectedAreaId} onChange={setSelectedAreaId} includeAll />
        <Select value={typeFilter} values={["All", "Existing Pole", "New Pole Location", "Infrastructure Point"]} onChange={(value) => setTypeFilter(value as SurveyType | "All")} />
        <Select value={statusFilter} values={["All", "Validated", "Review Required", "Incomplete"]} onChange={setStatusFilter} />
        <Select value={civilFilter} values={["All", "Yes", "No"]} onChange={setCivilFilter} />
      </div>
    );
  }
}

function toRecord(source: Building | InfrastructurePoint, surveyType: SurveyType): SurveyRecord {
  return {
    id: source.surveyId,
    date: source.date,
    technician: source.technician,
    team: source.team,
    city: source.city,
    areaId: source.areaId,
    surveyType,
    latitude: source.latitude,
    longitude: source.longitude,
    gpsAccuracy: source.gpsAccuracy,
    streetRef: source.streetRef,
    objectId: source.id,
    usersOrUnits: "estimatedPremises" in source ? source.estimatedPremises : source.nearbyBuildingCount,
    validationStatus: source.validationStatus,
    validationIssues: source.validationIssues,
    notes: source.notes
  };
}

function newActivity(id: string, areaId: AreaId, technician: string, title: string, note: string) {
  return { id: `ACT-${id}`, time: "2026-08-29 15:45", areaId, technician, title, note };
}

function Title({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className={styles.titleRow}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  );
}

function Badge({ value }: { value: string }) {
  return <span className={`${styles.badge} ${badgeClass(value)}`}>{value}</span>;
}

function BreakdownPanel({ title, rows }: { title: string; rows: { label: string; value: number }[] }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <article className={styles.panel}>
      <h2>{title}</h2>
      <div className={styles.list}>
        {rows.map((row) => (
          <div className={styles.listItem} key={row.label}>
            <strong>{row.label}</strong>
            <small>{row.value.toLocaleString()} records</small>
            <div className={styles.track}><span style={{ width: `${percent(row.value, max)}%` }} /></div>
          </div>
        ))}
      </div>
    </article>
  );
}

function RecordsTable({
  records,
  onSelect,
  controls
}: {
  records: SurveyRecord[];
  onSelect: (record: SurveyRecord) => void;
  controls?: ReactNode;
}) {
  return (
    <article className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2>Recent Survey Records</h2>
        {controls}
      </div>
      <Table
        headers={["Survey ID", "Date", "Technician", "Area", "Type", "Object ID", "GPS", "Users / Units", "Status"]}
        rows={records.map((record) => ({
          key: record.id,
          onClick: () => onSelect(record),
          cells: [record.id, record.date, record.technician, areaName(record.areaId), record.surveyType, record.objectId, gpsText(record), record.usersOrUnits, <Badge key={record.id} value={record.validationStatus} />]
        }))}
      />
    </article>
  );
}

function RecordDetail({ record }: { record: SurveyRecord }) {
  return (
    <div className={styles.detailStack}>
      <Badge value={record.validationStatus} />
      <h3>{record.id}</h3>
      <dl className={styles.metaGrid}>
        <Meta label="Object" value={record.objectId} />
        <Meta label="Type" value={record.surveyType} />
        <Meta label="Area" value={areaName(record.areaId)} />
        <Meta label="Technician" value={record.technician} />
        <Meta label="GPS" value={gpsText(record)} />
        <Meta label="Users / Units" value={record.usersOrUnits.toString()} />
      </dl>
      <p className={styles.noteBox}>{record.notes}</p>
      <IssueList issues={record.validationIssues} />
    </div>
  );
}

function BuildingDetail({ building }: { building: Building }) {
  return (
    <div className={styles.detailStack}>
      <Badge value={building.validationStatus} />
      <h3>{building.id}</h3>
      <dl className={styles.metaGrid}>
        <Meta label="Location" value={`${building.city} / ${building.streetRef}`} />
        <Meta label="GPS" value={gpsText(building)} />
        <Meta label="Profile" value={`${building.type}, ${building.floors} floors`} />
        <Meta label="Units" value={`${building.occupiedUnits}/${building.units} occupied`} />
        <Meta label="Premises" value={building.estimatedPremises.toString()} />
        <Meta label="Closest Point" value={`${building.closestNetworkPoint} (${building.distanceToNetwork} m)`} />
        <Meta label="Access" value={building.accessType} />
        <Meta label="Difficulty" value={building.difficulty} />
      </dl>
      <EvidenceList evidence={building.evidence} />
      <p className={styles.noteBox}>{building.notes}</p>
      <IssueList issues={building.validationIssues} />
    </div>
  );
}

function InfrastructureDetail({ point, state }: { point: InfrastructurePoint; state: SurveyState }) {
  const related = state.buildings.filter((building) => point.relatedBuildings.includes(building.id));
  return (
    <div className={styles.detailStack}>
      <Badge value={point.validationStatus} />
      <h3>{point.id}</h3>
      <dl className={styles.metaGrid}>
        <Meta label="Type" value={point.surveyType} />
        <Meta label="GPS" value={gpsText(point)} />
        <Meta label="Condition" value={point.condition} />
        <Meta label="Mounting" value={point.mountingAvailability} />
        <Meta label="Civil Work" value={point.civilWorkRequired ? "Yes" : "No"} />
        <Meta label="Route" value={`${point.routeType}, ${point.estimatedRouteDistance} m`} />
        <Meta label="Nearby Buildings" value={point.nearbyBuildingCount.toString()} />
        <Meta label="Obstruction" value={point.obstruction} />
      </dl>
      <EvidenceList evidence={point.evidence} />
      <p className={styles.noteBox}>{point.notes}</p>
      <IssueList issues={point.validationIssues} />
      {related.length ? <p className={styles.related}>Related buildings: {related.map((item) => item.id).join(", ")}</p> : null}
    </div>
  );
}

function MapDetail({ object, kind }: { object: Building | InfrastructurePoint; kind: SurveyType }) {
  return (
    <div className={styles.detailStack}>
      <Badge value={object.validationStatus} />
      <h3>{object.id}</h3>
      <dl className={styles.metaGrid}>
        <Meta label="Type" value={kind} />
        <Meta label="Area" value={areaName(object.areaId)} />
        <Meta label="GPS" value={gpsText(object)} />
        <Meta label="Technician" value={object.technician} />
        <Meta label="Date" value={object.date} />
        <Meta label="Premises" value={"estimatedPremises" in object ? object.estimatedPremises.toString() : object.nearbyBuildingCount.toString()} />
      </dl>
      <IssueList issues={object.validationIssues} />
      <p className={styles.noteBox}>{object.notes}</p>
    </div>
  );
}

function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  return (
    <div className={styles.evidenceList}>
      {evidence.map((item) => <span key={item.id}>{item.label}</span>)}
    </div>
  );
}

function IssueList({ issues }: { issues: string[] }) {
  return issues.length ? (
    <div className={styles.issueList}>
      {issues.map((issue) => <span key={issue}>{issue}</span>)}
    </div>
  ) : <p className={styles.validNote}>No validation issues.</p>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: { key: string; cells: ReactNode[]; onClick?: () => void }[] }) {
  if (!rows.length) return <p className={styles.empty}>No sample records match the current filters.</p>;
  return (
    <div className={styles.tableWrap}>
      <table>
        <thead>
          <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
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

function Input({ label, value, onChange, type = "text", wide = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; wide?: boolean }) {
  return (
    <label className={wide ? styles.wide : ""}>
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Select({ label, value, values, onChange }: { label?: string; value: string; values: string[]; onChange: (value: string) => void }) {
  const control = (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {values.map((item) => <option key={item} value={item}>{item}</option>)}
    </select>
  );
  return label ? <label>{label}{control}</label> : control;
}

function AreaSelect({ label, value, onChange, includeAll = false }: { label?: string; value: AreaId | "All"; onChange: (value: AreaId | "All") => void; includeAll?: boolean }) {
  const control = (
    <select value={value} onChange={(event) => onChange(event.target.value as AreaId | "All")}>
      {includeAll ? <option value="All">All areas</option> : null}
      {areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
    </select>
  );
  return label ? <label>{label}{control}</label> : control;
}

function gpsText(record: { latitude: string; longitude: string; gpsAccuracy: number }) {
  return record.latitude && record.longitude ? `${record.latitude}, ${record.longitude} (${record.gpsAccuracy}m)` : "Missing GPS";
}

function issueText(issues: string[]) {
  return issues.length ? issues.join(", ") : "No issues";
}

function mapShape(type: SurveyType) {
  if (type === "Building") return styles.buildingPoint;
  if (type === "Existing Pole") return styles.polePoint;
  if (type === "New Pole Location") return styles.proposedPoint;
  return styles.infrastructurePoint;
}
