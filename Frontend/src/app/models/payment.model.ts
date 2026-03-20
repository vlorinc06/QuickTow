export interface Payment{
    id: number,
    price: number,
    date: string,
    user: number,
    tow_user: number,
    tow_request: number,
    payment_method: string
}