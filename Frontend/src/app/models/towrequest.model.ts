import { TowUser } from "./towuser.model";
import { User } from "./user.model";
import { Vehicle } from "./vehicle.model";

export interface TowRequest{
    id?: number,
    user: User,
    vehicle: Vehicle,
    tow_user: TowUser,
    pickup_lat: number,
    pickup_long: number,
    pickup_note: string,
    dropoff_lat: number,
    dropoff_long: number,
    status: string,
    price: number,
    user_confirmed: number,
    tow_user_confirmed: number
}

export interface TowRequestPost{
    user: number,
    vehicle: number,
    tow_user: number,
    pickup_lat: number,
    pickup_long: number,
    pickup_note: string,
    dropoff_lat: number,
    dropoff_long: number,
    status: string,
    price: number
}

export interface TowRequestEndDialogData{
    request: TowRequest,
    isTowUser: boolean
}