export type UserRole = "admin" | "staff" | "rider" | "customer";

export interface UserColumns {
    user_id: number;
    profile_picture?: string | null;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix_name?: string | null;
    role: UserRole;
    birth_date: string;
    age: string | number;
    contact_number?: string | null;
    address?: string | null;
    gps_lat?: number | null;
    gps_lng?: number | null;
    username: string;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserFieldErrors {
    add_user_profile_picture?: string[];
    edit_user_profile_picture?: string[];
    first_name?: string[];
    middle_name?: string[];
    last_name?: string[];
    suffix_name?: string[];
    role?: string[];
    birth_date?: string[];
    age?: string[];
    contact_number?: string[];
    address?: string[];
    gps_lat?: string[];
    gps_lng?: string[];
    username?: string[];
    password?: string[];
    password_confirmation?: string[];
}