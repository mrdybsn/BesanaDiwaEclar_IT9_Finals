export interface AuthUser {
    user_id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix_name?: string | null;
    role: "admin" | "rider";
    birth_date: string;
    age: number | string;
    contact_number?: string | null;
    username: string;
    profile_picture?: string | null;
}

export interface UserDetails {
    user: AuthUser;
    token?: string;
}

export interface LoginCredentialsErrorFields {
    username?: string[];
    password?: string[];
}
