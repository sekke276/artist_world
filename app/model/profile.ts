namespace Profile {
  export interface BasicInfo {
    avatarUrl: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  }

  export interface UserInfo extends BasicInfo{
    sex: 'man' | 'woman' | 'not',
    musicInterests: string[];
    musicRoles: string[];
    gallery: string[];
    about: string;
  }
}
