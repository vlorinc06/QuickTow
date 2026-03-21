import { TowUser } from "./towuser.model"
import { User } from "./user.model"

export interface RatingPost{
    user: number,
    tow_user: number,
    tow_request: number,
    rating: number,
    text?: string,
    date?: string
}

export interface Rating{
    id: number,
    user: User,
    tow_user: TowUser,
    tow_request: number,
    rating: number,
    text?: string,
    date?: string
}