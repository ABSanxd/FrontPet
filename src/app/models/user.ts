import { Status } from "./enums/status.enum";
import { UserLevel } from "./enums/user-level.enum";

export interface UserCreateDTO {
    name: string;
    email: string;
    password: string;
}

export interface UserUpdateDTO {
    name: string;
    password: string;
}

export interface UserResponseDTO {
    id: string; // UUID
    name: string;
    email: string;
    maxPets: number;
    userLevel: UserLevel; 
    userXp: number;
    status: Status; 
    createdAt: string;
}