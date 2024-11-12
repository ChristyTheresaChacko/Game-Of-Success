export function getRandomValueBetween(min, max, exceptions = [0, -1, 1])
{
    let value = Math.random() * (max - min) + min;
    while(exceptions.includes(Math.round(value)))   
        value = Math.random() * (max - min) + min;
    return value;
}

export function radianToDegree(angle) 
{
    return 180 * angle / Math.PI;
}

export function degreeToRadian(angle) 
{
    return Math.PI * angle / 180;
}