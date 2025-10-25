import { Status } from "./enums/status.enum";
import { UserLevel } from "./enums/user-level.enum";

export interface UserCreateDTO {
    name: string;
    email: string;
    password: string;
    department?: string; // Departamento (nombre)
    province?: string;   // Provincia (nombre)
    district?: string;   // Distrito (nombre)
    birthDate?: string;  // ISO date string yyyy-mm-dd
}

export interface UserUpdateDTO {
    name?: string;
    password?: string;
    department?: string;
    province?: string;
    district?: string;
}

export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    maxPets: number;
    userLevel: UserLevel;
    userXp: number;
    status: Status;
    createdAt: string;
    department?: string;
    province?: string;
    district?: string;
    birthDate?: string;
}
