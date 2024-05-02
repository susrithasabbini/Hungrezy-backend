
// add

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

test('add', () => {
    expect(add(1, 2)).toBe(3);
});

// subtract
test('subtract', () => {
    expect(subtract(2, 1)).toBe(1);
});

// multiply
test('multiply', () => {
    expect(multiply(2, 2)).toBe(4);
});

// divide
test('divide', () => {
    expect(divide(4, 2)).toBe(2);
});

