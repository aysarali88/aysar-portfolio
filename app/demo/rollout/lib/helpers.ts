import { areas, issues, materialReconciliation, networkElements, teamPerformance } from "./data";
import type {
  Area,
  FieldRecord,
  MaterialReconciliation,
  NetworkElement,
  RolloutState,
  ValidationStatus
} from "./types";

export function cloneState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function areaName(areaId: string) {
  return areas.find((area) => area.id === areaId)?.name ?? areaId;
}

export function formatMeters(value: number) {
  return `${value.toLocaleString()} m`;
}

export function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export function average(values: number[]) {
  return values.length === 0 ? 0 : Math.round(sum(values) / values.length);
}

export function overviewStats(state: RolloutState) {
  const installedCable = sum(areas.map((area) => area.cableInstalled)) + todayCable(state.fieldRecords);
  const plannedCable = sum(areas.map((area) => area.cablePlanned));
  const boxesInstalled = sum(areas.map((area) => area.boxesInstalled)) + todayBoxes(state.fieldRecords);

  return {
    overallProgress: Math.round((installedCable / plannedCable) * 100),
    plannedCable,
    installedCable,
    boxesInstalled,
    usersPassed: sum(areas.map((area) => area.passedUsers)),
    activeAreas: areas.length,
    activeTeams: sum(areas.map((area) => area.fieldTeams)),
    openIssues: issues.filter((issue) => issue.status !== "Resolved").length,
    scheduleVariance: average(areas.map((area) => area.actualProgress - area.plannedProgress))
  };
}

export function todayCable(records: FieldRecord[]) {
  return sum(records.filter((record) => record.date === "2026-08-29").map((record) => record.actualLength));
}

export function todayBoxes(records: FieldRecord[]) {
  return sum(
    records
      .filter((record) => record.date === "2026-08-29" && record.networkElement !== "Cable")
      .map((record) => record.quantity)
  );
}

export function networkProgress(state: RolloutState) {
  const dynamicRecords = state.fieldRecords;
  return [
    { label: "HUB", planned: 18, actual: sum(areas.map((area) => Math.floor(area.boxesInstalled / 52))) },
    { label: "SUB", planned: 76, actual: sum(areas.map((area) => Math.floor(area.boxesInstalled / 12))) },
    { label: "END", planned: 384, actual: sum(areas.map((area) => area.boxesInstalled)) },
    { label: "XBOX", planned: 92, actual: sum(dynamicRecords.filter((record) => record.networkElement === "XBOX").map((record) => record.quantity)) + 33 },
    { label: "Cable", planned: sum(areas.map((area) => area.cablePlanned)), actual: sum(areas.map((area) => area.cableInstalled)) + todayCable(dynamicRecords) }
  ];
}

export function validationCounts(elements: NetworkElement[]) {
  const count = (status: ValidationStatus, type?: NetworkElement["type"]) =>
    elements.filter((element) => element.status === status && (!type || element.type === type)).length;

  return {
    boxesMatched: elements.filter((element) => element.type !== "Cable" && element.status === "Match").length,
    boxesMismatched: count("Mismatch") - count("Mismatch", "Cable"),
    boxesMissing: count("Missing") - count("Missing", "Cable"),
    cablesCorrect: count("Match", "Cable"),
    cableLengthMismatch: count("Mismatch", "Cable"),
    cablesMissing: count("Missing", "Cable")
  };
}

export function reconciliationVariance(row: MaterialReconciliation) {
  const expectedBalance = row.issued - row.fieldUsed - row.returned;
  return {
    expectedBalance,
    variance: row.reportedBalance - expectedBalance
  };
}

export function areaReport(area: Area, state: RolloutState) {
  const records = state.fieldRecords.filter((record) => record.areaId === area.id);
  const areaIssues = issues.filter((issue) => issue.areaId === area.id);
  const validation = networkElements.filter((element) => element.areaId === area.id);
  const materials = materialReconciliation.filter((row) => row.areaId === area.id);
  const cableToday = sum(records.map((record) => record.actualLength));
  const boxesToday = sum(records.filter((record) => record.networkElement !== "Cable").map((record) => record.quantity));

  return { records, issues: areaIssues, validation, materials, cableToday, boxesToday };
}

export function enrichedTeamPerformance(state: RolloutState) {
  return teamPerformance
    .map((team) => {
      const records = state.fieldRecords.filter((record) => record.supervisor === team.supervisor);
      return {
        ...team,
        cableInstalled: team.cableInstalled + sum(records.map((record) => record.actualLength)),
        endBoxes:
          team.endBoxes +
          sum(records.filter((record) => record.networkElement === "END").map((record) => record.quantity)),
        xboxUnits:
          team.xboxUnits +
          sum(records.filter((record) => record.networkElement === "XBOX").map((record) => record.quantity))
      };
    })
    .sort((a, b) => b.productivityScore - a.productivityScore);
}
