function hasCarryInOnesPlace(a, b) {
    if (a < b) [a, b] = [b, a];
    let digitA = a % 10;
    let digitB = b % 10;
    return (digitA + digitB) > 10
}