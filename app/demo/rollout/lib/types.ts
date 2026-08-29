export type SectionKey =
  | "overview"
  | "field"
  | "operations"
  | "validation"
  | "materials"
  | "report";

export type HealthStatus = "Healthy" | "Watch" | "Critical";
export type ValidationStatus = "Match" | "Mismatch" | "Missing";
export type IssueSeverity = "High" | "Medium" | "Low";
export type MaterialStatus = "Reconciled" | "Review Required" | "Variance";

export type Area = {
  id: string;
  name: string;
  plannedProgress: number;
  actualProgress: number;
  status: HealthStatus;
  cablePlanned: number;
  cableInstalled: number;
  boxesPlanned: number;
  boxesInstalled: number;
  plannedUsers: number;
  passedUsers: number;
  openIssues: number;
  fieldTeams: number;
  startDate: string;
  forecastCompletion: string;
};

export type FieldRecord = {
  id: string;
  date: string;
  supervisor: string;
  teamLeader: string;
  city: string;
  areaId: string;
  activityType: string;
  networkElement: "HUB" | "SUB" | "END" | "XBOX" | "Cable";
  distributionNode: string;
  material: string;
  itemDetail: string;
  cableRoute: string;
  cableCode: string;
  plannedLength: number;
  actualLength: number;
  mountType: string;
  boxCode: string;
  serialNumber: string;
  quantity: number;
  status: HealthStatus;
  notes: string;
};

export type TeamPerformance = {
  supervisor: string;
  team: string;
  areaId: string;
  cableInstalled: number;
  endBoxes: number;
  subBoxes: number;
  hubBoxes: number;
  xboxUnits: number;
  productivityScore: number;
};

export type NetworkElement = {
  id: string;
  areaId: string;
  distributionNode: string;
  type: "Distribution Node" | "HUB" | "SUB" | "END" | "Cable";
  plannedCode: string;
  actualCode: string;
  plannedCableLength: number;
  actualCableLength: number;
  status: ValidationStatus;
};

export type MaterialReconciliation = {
  id: string;
  areaId: string;
  team: string;
  material: string;
  partNumber: string;
  issued: number;
  fieldUsed: number;
  returned: number;
  reportedBalance: number;
  unit: string;
  status: MaterialStatus;
};

export type Issue = {
  id: string;
  areaId: string;
  type: string;
  severity: IssueSeverity;
  owner: string;
  status: "Open" | "In Review" | "Resolved";
  note: string;
};

export type Activity = {
  id: string;
  time: string;
  areaId: string;
  title: string;
  note: string;
};

export type RolloutState = {
  fieldRecords: FieldRecord[];
  activities: Activity[];
};
