export interface TowUser {
    id?: number,
    last_name: string,
    first_name: string,
    username: string,
    password: string,
    email: string,
    phone_number: string,
    price_per_km: number,
    latitude?: number,
    longitude?: number,
    rating: number,
    rating_count: number,
    status: string,
    distance?: number;
}