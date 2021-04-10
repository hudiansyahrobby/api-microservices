export const getSort = (sort: string) => {
    let sortBy;
    switch (sort) {
        case 'latest':
            sortBy = ['createdAt', 'DESC'];
            break;
        case 'oldest':
            sortBy = ['createdAt', 'ASC'];
        default:
            sortBy = ['createdAt', 'DESC'];
            break;
    }
    return sortBy;
};
