export function CleanObject(obj) {
    delete obj.user;
    for (let propName in obj) {
        if (obj[propName] === undefined) {
            delete obj[propName];
        } else if (obj[propName] instanceof Date) {
            obj[propName] = (obj[propName] as Date).toISOString();
        }
    }
}