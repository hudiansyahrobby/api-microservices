import { IUser } from '../interfaces/user.interface';

interface UserData {
    rows: IUser[];
    count: number;
}

export const getPaginationData = (data: UserData, page: number, limit: number) => {
    const { count: totalItems, rows: results } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, totalPages, results, currentPage, limit };
};
