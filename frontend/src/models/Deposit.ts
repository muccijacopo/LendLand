export interface Deposit {
    id: number;
    amount: string;
    amountWithInterest: string;
    date: Date;
    isClosed: boolean;
}
