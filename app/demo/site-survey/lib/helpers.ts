import { areas } from "./data";
import type { AreaId, Building, InfrastructurePoint, SurveyRecord, SurveyState, SurveyType, ValidationStatus } from "./types";

export function cloneState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export function percent(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function areaName(areaId: string) {
  return areas.find((area) => area.id === areaId)?.name ?? areaId;
}

export function hasGps(record: { latitude: string; longitude: string }) {
  return Boolean(record.latitude && record.longitude);
}

export function validateBuilding(building: Building): string[] {
  const issues: string[] = [];
  if (!hasGps(building)) issues.push("Missing GPS");
  if (building.gpsAccuracy > 10) issues.push("GPS accuracy above threshold");
  if (building.units <= 0) issues.push("Missing unit count");
  if (!building.closestNetworkPoint) issues.push("No nearby distribution point");
  if (building.evidence.filter((item) => item.added).length < 2) issues.push("Missing evidence");
  if (building.distanceToNetwork > 100) issues.push("Network distance requires review");
  return issues;
}

export function validateInfrastructure(point: InfrastructurePoint): string[] {
  const issues: string[] = [];
  if (!hasGps(point)) issues.push("Missing GPS");
  if (point.gpsAccuracy > 10) issues.push("GPS accuracy above threshold");
  if (["Damaged", "Replacement Recommended", "Review Required"].includes(point.condition)) {
    issues.push("Pole condition requires review");
  }
  if (point.civilWorkRequired) issues.push("Civil work required");
  if (point.evidence.filter((item) => item.added).length < 2) issues.push("Missing evidence");
  return issues;
}

export function statusFromIssues(issues: string[]): ValidationStatus {
  if (issues.some((issue) => issue.includes("Missing GPS") || issue.includes("unit count"))) return "Incomplete";
  if (issues.length > 0) return "Review Required";
  return "Validated";
}

export function dashboardStats(state: SurveyState) {
  const totalPoints = state.records.length;
  const surveyedBuildings = state.buildings.length;
  const surveyedPoles = state.infrastructure.filter((point) => point.surveyType !== "Infrastructure Point").length;
  const premises = sum(state.buildings.map((building) => building.estimatedPremises));
  const validated = state.records.filter((record) => record.validationStatus === "Validated").length;
  const review = state.records.filter((record) => record.validationStatus === "Review Required").length;
  const missingGps = state.records.filter((record) => !hasGps(record)).length;
  const technicians = new Set(state.records.map((record) => record.technician)).size;
  const planned = sum(areas.map((area) => area.plannedPoints));
  const completed = sum(areas.map((area) => area.completedPoints)) + totalPoints;

  return {
    totalPoints,
    surveyedBuildings,
    surveyedPoles,
    premises,
    completion: percent(completed, planned),
    validated,
    review,
    technicians,
    activeAreas: areas.length,
    missingGps,
    planned,
    completed
  };
}

export function typeBreakdown(records: SurveyRecord[]) {
  const count = (type: SurveyType) => records.filter((record) => record.surveyType === type).length;
  return [
    { label: "Buildings", value: count("Building") },
    { label: "Existing Poles", value: count("Existing Pole") },
    { label: "New Pole Required", value: count("New Pole Location") },
    { label: "Infrastructure / Route Points", value: count("Infrastructure Point") }
  ];
}

export function qualityBreakdown(records: SurveyRecord[]) {
  return [
    { label: "Valid", value: records.filter((record) => record.validationStatus === "Validated").length },
    { label: "Review Required", value: records.filter((record) => record.validationStatus === "Review Required").length },
    { label: "Missing GPS", value: records.filter((record) => record.validationIssues.includes("Missing GPS")).length },
    { label: "Missing Photo", value: records.filter((record) => record.validationIssues.includes("Missing evidence")).length },
    { label: "Duplicate / Possible Duplicate", value: 1 }
  ];
}

export function technicianSummary(records: SurveyRecord[]) {
  return Array.from(new Set(records.map((record) => record.technician)))
    .map((technician) => {
      const owned = records.filter((record) => record.technician === technician);
      return {
        technician,
        records: owned.length,
        valid: owned.filter((record) => record.validationStatus === "Validated").length,
        review: owned.filter((record) => record.validationStatus !== "Validated").length
      };
    })
    .sort((a, b) => b.records - a.records);
}

export function buildingsForArea(buildings: Building[], areaId: AreaId | "All") {
  return areaId === "All" ? buildings : buildings.filter((building) => building.areaId === areaId);
}

export function infrastructureForArea(points: InfrastructurePoint[], areaId: AreaId | "All") {
  return areaId === "All" ? points : points.filter((point) => point.areaId === areaId);
}
