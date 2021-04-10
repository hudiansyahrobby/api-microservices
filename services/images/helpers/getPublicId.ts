export const getPublicId = (imageUrls: Array<string>) => {
    const public_ids = [];

    for (const imageUrl of imageUrls) {
        const extractURL = imageUrl.match(/upload\/(?:v\d+\/)?([^\.]+)/);
        if (extractURL) {
            const public_id = extractURL[1];
            public_ids.push(public_id);
        }
    }

    return public_ids;
};
