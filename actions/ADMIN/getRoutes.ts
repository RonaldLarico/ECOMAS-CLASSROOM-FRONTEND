import {
  CorporationList,
  FetchGraduatesParams,
  Graduate,
  GraduateList,
  GraduateResponse,
  ListParams,
  ModuleList,
  ModuleParams,
  SpeakerList,
} from "./interface/interface";

export const GraduateAllList = async ({
  offset,
  limit,
  token,
  search,
}: FetchGraduatesParams): Promise<GraduateResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/graduates/search/?limit=${limit}&offset=${offset}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error response:", errorBody);
      throw new Error("Failed to fetch graduates list");
    }

    const data = await response.json();
    if (!data || typeof data.totalGraduates === "undefined") {
      console.error("Unexpected response format:", data);
      throw new Error("Invalid response format: totalGraduates is missing");
    }

    return {
      totalGraduates: data.totalGraduates,
      result: data.result as Graduate[],
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const GraduateAllListSearch = async ({
  token,
  search,
}: ListParams): Promise<GraduateList[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/graduate/list/search?search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error response:", errorBody);
      throw new Error("Failed to fetch graduates list");
    }

    const data = await response.json();

    return data as GraduateList[];
  } catch (error) {
    console.log("Error fetching graduates:", error);
    throw error;
  }
};

export const SpeakerAllListSearch = async ({
  token,
  search,
}: ListParams): Promise<SpeakerList[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/speakers/search?search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error response:", errorBody);
      throw new Error("Failed to fetch graduates list");
    }

    const data = await response.json();

    return data as SpeakerList[];
  } catch (error) {
    console.log("Error fetching graduates:", error);
    throw error;
  }
};

export const CorporationAllList = async ({
  token,
}: ListParams): Promise<CorporationList[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/corporations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error response:", errorBody);
      throw new Error("Failed to fetch corporation list");
    }

    const data = await response.json();

    return data as CorporationList[];
  } catch (error) {
    console.log("Error fetching graduates:", error);
    throw error;
  }
};

export const ModuleAllListSearch = async ({
  graduateId,
  corporationId,
  token,
}: ModuleParams): Promise<ModuleList[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/modules/graduate/${graduateId}/corporation/${corporationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response)
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error response:", errorBody);
      throw new Error("Failed to fetch graduates list");
    }

    const data = await response.json();

    return data as ModuleList[];
  } catch (error) {
    console.log("Error fetching graduates:", error);
    throw error;
  }
};

export const showCorporation = async ({
  graduateId,
  token,
}: ListParams): Promise<CorporationList[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/corporation/graduate/${graduateId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error response:", errorBody);
      throw new Error("Failed to fetch graduates list");
    }

    const data = await response.json();

    return data as CorporationList[];
  } catch (error) {
    console.log("Error fetching graduates:", error);
    throw error;
  }
};