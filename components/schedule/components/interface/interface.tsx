import { CorporationList, GraduateList } from "@/actions/ADMIN/interface/interface";
import { Control } from "react-hook-form";

export interface SessionData {
  linkZoom: string;
  date: string;
  hour: string;
  speakerId?: string;
}

export interface ModuleData {
  name: string;
  hours: string;
  totalPrice: number;
  topics: string[];
  graduateId: number;
  session: SessionData[];
}

export interface ExtendedModuleData extends ModuleData {
  numArrays: number;
  corporationIds: number[];
  amountIds: number[];
}

export interface FormattedData {
  modules: ModuleData[];
  numArrays: number;
  corporationIds: number[];
  amountIds: number[];
}

export interface ModuleFormValues {
  name: string;
  hours: string;
  totalPrice: number;
  topics: string[];
  session: SessionData[];
  graduateId: number;
  numArrays: number;
  corporationIds: number[];
  amountIds: number[];
}

export interface ChildFormProps {
  control: Control<ModuleFormValues>;
  token: string;
}

export interface ChildrenFormModuleState {
  searchTerm: string;
  graduates: GraduateList[];
  selectedGraduate: GraduateList | null;
  loading: boolean;
  cache: { [key: string]: GraduateList[] };
  corporations: CorporationList[];
  selectedCorporations: number[];
}
