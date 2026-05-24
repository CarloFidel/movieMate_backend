import { ValidRoles } from '../../auth/interfaces/roles.interfaces';

interface SeedUser {
	email: string;
	password: string;
	fullName: string;
	isActive: boolean;
	avatarUrl?: string;
	roles: ValidRoles[];
}

interface SeedMovie {
	moviedbID: number;
	title: string;
}

interface SeedData {
	user: SeedUser;
	movies: SeedMovie[];
}

export const initialData: SeedData = {
	user: {
		email: 'admin@moviesapp.dev',
		password: 'Admin123*',
		fullName: 'Movies Admin',
		isActive: true,
		roles: [ValidRoles.admin, ValidRoles.user],
	},
	movies: [
		{ moviedbID: 11, title: 'Star Wars' },
		{ moviedbID: 13, title: 'Forrest Gump' },
		{ moviedbID: 78, title: 'Blade Runner' },
		{ moviedbID: 120, title: 'The Lord of the Rings: The Fellowship of the Ring' },
		{ moviedbID: 155, title: 'The Dark Knight' },
		{ moviedbID: 27205, title: 'Inception' },
		{ moviedbID: 278, title: 'The Shawshank Redemption' },
		{ moviedbID: 603, title: 'The Matrix' },
		{ moviedbID: 680, title: 'Pulp Fiction' },
		{ moviedbID: 157336, title: 'Interstellar' },
	],
};
