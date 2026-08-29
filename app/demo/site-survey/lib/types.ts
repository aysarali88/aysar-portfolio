export type SectionKey = "dashboard" | "entry" | "buildings" | "poles" | "map";

export type AreaId = "ZONE-A" | "ZONE-B" | "ZONE-C" | "ZONE-D";
export type SurveyType = "Building" | "Existing Pole" | "New Pole Location" | "Infrastructure Point";
export type ValidationStatus = "Validated" | "Review Required" | "Incomplete";
export type Difficulty = "Easy" | "Medium" | "Difficult";

export type Area = {
  id: AreaId;
  name: string;
  plannedPoints: number;
  completedPoints: number;
  buildings: number;
  poles: number;
  premises: number;
  status: ValidationStatus;
};

export type Evidence = {
  id: string;
  label: string;
  added: boolean;
};

export type SurveyRecord = {
  id: string;
  date: string;
  technician: string;
  team: string;
  city: string;
  areaId: AreaId;
  surveyType: SurveyType;
  latitude: string;
  longitude: string;
  gpsAccuracy: number;
  streetRef: string;
  objectId: string;
  usersOrUnits: number;
  validationStatus: ValidationStatus;
  validationIssues: string[];
  notes: string;
};

export type Building = {
  id: string;
  surveyId: string;
  date: string;
  technician: string;
  team: string;
  city: string;
  areaId: AreaId;
  latitude: string;
  longitude: string;
  gpsAccuracy: number;
  streetRef: string;
  type: "Residential" | "Commercial" | "Mixed Use" | "Villa" | "Apartment Block";
  status: "Occupied" | "Partially Occupied" | "Under Construction" | "Vacant";
  floors: number;
  entrances: number;
  units: number;
  occupiedUnits: number;
  estimatedPremises: number;
  commercialUnits: number;
  existingTelecom: string;
  accessType: string;
  facadeType: string;
  dropCableAccess: string;
  closestNetworkPoint: string;
  distanceToNetwork: number;
  difficulty: Difficulty;
  powerAvailability: string;
  validationStatus: ValidationStatus;
  validationIssues: string[];
  evidence: Evidence[];
  notes: string;
};

export type InfrastructurePoint = {
  id: string;
  surveyId: string;
  date: string;
  technician: string;
  team: string;
  city: string;
  areaId: AreaId;
  latitude: string;
  longitude: string;
  gpsAccuracy: number;
  streetRef: string;
  surveyType: Exclude<SurveyType, "Building">;
  poleType: string;
  poleMaterial: string;
  existingOrProposed: "Existing" | "Proposed";
  condition: "Suitable" | "Review Required" | "Damaged" | "Replacement Recommended" | "New Pole Required";
  heightMeters: number;
  mountingAvailability: string;
  existingCables: string;
  spaceAvailable: string;
  roadSide: string;
  accessCondition: string;
  nearbyBuildingCount: number;
  distributionUse: string;
  poleInstallationRequired: boolean;
  civilWorkRequired: boolean;
  pointType: string;
  routeType: "Underground" | "Aerial" | "Mixed";
  existingDuct: string;
  chamberOrManhole: string;
  roadCrossing: string;
  obstruction: string;
  estimatedRouteDistance: number;
  validationStatus: ValidationStatus;
  validationIssues: string[];
  relatedBuildings: string[];
  evidence: Evidence[];
  notes: string;
};

export type Activity = {
  id: string;
  time: string;
  areaId: AreaId;
  technician: string;
  title: string;
  note: string;
};

export type SurveyState = {
  records: SurveyRecord[];
  buildings: Building[];
  infrastructure: InfrastructurePoint[];
  activities: Activity[];
};
