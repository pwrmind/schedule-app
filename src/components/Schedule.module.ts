export function getDayTimeIntervals(interValsInHour: number) {
    if (60%interValsInHour > 0 ) {
        throw new Error(`No valid time interval for hour`);
    }
    const intervalsCount = Math.round(24*(60/interValsInHour));
    return Array(intervalsCount).fill('').map((value, index) => {
        return `${Math.floor(index * 0.5)}:${(index % 2 > 0) || (index === 1) ? '30' : '00' }`
    });
}