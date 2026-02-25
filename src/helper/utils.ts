// features/admin/profile/utils/index.ts

export interface ProfileFormData {
    fullname: string;
    email: string;
    phone: string;
    dob: string;
    location: string;
    bio: string;
}

export interface PasswordFormData {
    currentPwd: string;
    newPwd: string;
    confirmPwd: string;
}

export interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    segments: number;
}

export interface ProfileField {
    id: string;
    name: keyof ProfileFormData;
    label: string;
    type?: string;
    icon: React.ReactNode;
}

export interface PasswordField {
    id: string;
    name: keyof PasswordFormData;
    label: string;
    placeholder: string;
    icon: React.ReactNode;
}

// API Response Types (if needed)
export interface ProfileUpdateResponse {
    success: boolean;
    message: string;
    data?: ProfileFormData;
}

export interface PasswordUpdateResponse {
    success: boolean;
    message: string;
}

// Default values
export const defaultProfileValues: ProfileFormData = {
    fullname: "",
    email: "",
    phone: "",
    dob: "",
    location: "",
    bio: ""
};

export const defaultPasswordValues: PasswordFormData = {
    currentPwd: "",
    newPwd: "",
    confirmPwd: ""
};