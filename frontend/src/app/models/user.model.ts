
export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}
export interface Geo {
    lat: number;
    lng: number;
}
export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}
export class User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}
export interface Album {
    title: string;
    id: number;
}
export interface Photo {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}


export interface Comment {
    id: number;
    name: string;
    email: string;
    body: string;
    post: Post;
}
export interface Post {
    id: number;
    title: string;
    body: string;
    user: User;
}
export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    user: User;
}

export const fields = {
    'Address': [
        'street',
        'suite',
        'city',
        'zipcode',
        'geo',
    ],
    'Geo': [
        'lat',
        'lng',
    ],
    'Company': [
        'name',
        'catchPhrase',
        'bs',
    ],
    'User': [
        'id',
        'name',
        'username',
        'email',
        'address',
        'phone',
        'website',
        'company',
    ],
}