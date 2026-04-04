export const getRandomInt = (min, max) => {
    // Make sure min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);

    // Math.random() returns [0,1), scale and shift to [min, max]
    return Math.floor(Math.random() * (max - min + 1)) + min;
}