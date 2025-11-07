export interface VaccineDoseDTO {
  id: string;
  applicationDate: string; 
  applied: boolean;
}

export interface VaccineResponseDTO {
  id: string;
  name: string;
  status: string; 
  createdAt: string;
  updatedAt?: string;
  doses: VaccineDoseDTO[];
}

export interface VaccineCreateDTO {
  name: string;
  doses: Array<{
    applicationDate: string;
    applied: boolean;
  }>;
}

export interface VaccineUpdateDTO {
  name: string;
  doses: Array<{
    id?: string; 
    applicationDate: string;
    applied: boolean;
  }>;
}