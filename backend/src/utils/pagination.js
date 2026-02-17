export function pagination(request){
    const pageValue = request.query.page;
    const limitValue = request.query.limit;

    let pageNumber = 1;
    let limitNumber = 5;

    if(pageValue){
        const p = Number(pageValue);
        if(p > 0){
            pageNumber = p;
        }
    }

    if(limitValue){
        const l = Number(limitValue);
        if(l > 0){
            limitNumber = l;
        }
    }

    const skip = (pageNumber - 1) * limitNumber;

    return {
        page: pageNumber,
        limit: limitNumber,
        skip: skip
    };
}