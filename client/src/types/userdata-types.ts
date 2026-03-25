import { Roles, AccountStatus } from "./auth-types";

export interface Address {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: State | "";
    zipcode: number
}

export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    passwordExpiry: Date | string;
    dateOfBirth: Date | string;
    role: Roles | null;
    accountStatus: AccountStatus;
    address: Address;
    permissions?: string[]
}

export enum State {
    AL = "AL",
    AK = "AK",
    AZ = "AZ",
    AR = "AR",
    CA = "CA",
    CO = "CO",
    CT = "CT",
    DE = "DE",
    FL = "FL",
    GA = "GA",
    HI = "HI",
    ID = "ID",
    IL = "IL",
    IN = "IN",
    IA = "IA",
    KS = "KS",
    KY = "KY",
    LA = "LA",
    ME = "ME",
    MD = "MD",
    MA = "MA",
    MI = "MI",
    MN = "MN",
    MS = "MS",
    MO = "MO",
    MT = "MT",
    NE = "NE",
    NV = "NV",
    NH = "NH",
    NJ = "NJ",
    NM = "NM",
    NY = "NY",
    NC = "NC",
    ND = "ND",
    OH = "OH",
    OK = "OK",
    OR = "OR",
    PA = "PA",
    RI = "RI",
    SC = "SC",
    SD = "SD",
    TN = "TN",
    TX = "TX",
    UT = "UT",
    VT = "VT",
    VA = "VA",
    WA = "WA",
    WV = "WV",
    WI = "WI",
    WY = "WY",
}