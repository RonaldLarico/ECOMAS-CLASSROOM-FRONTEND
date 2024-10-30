export interface Corporation {
  id: string;
  name: string;
}

export interface Graduate {
  id: number;
  name: string;
  credits: string;
  totalPrice: string;
  state: boolean;
  corporation: { corporation: Corporation }[];
}

export interface GraduateResponse {
  totalGraduates: number;
  result: Graduate[];
}

export interface FetchGraduatesParams {
  offset: number;
  limit: number;
  token: string;
  search?: string;
}

export interface ListParams {
  token: string;
  search?: string;
  graduateId?: number;
}

export interface GraduateList {
  id: number;
  name: string;
}

export interface CorporationList {
  id: number;
  name: string;
}

export interface ModuleParams {
  graduateId: number;
  name: string;
  token: string;
}

export interface SpeakerList {
  id: number;
  fullName: string;
}

interface SessionList {
  id: number;
  name: string;
  linkZoom: string;
  date: Date;
  speaker: SpeakerList;
}

export interface ModuleList {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  hours: string;
  topics: string[];
  totalPrice: number;
  state: boolean;
  session: SessionList[];
}