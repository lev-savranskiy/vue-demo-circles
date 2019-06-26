function calcSphere(x, y, z) {
    const radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2))
    return {radius: radius};
}
module.exports = calcSphere;
