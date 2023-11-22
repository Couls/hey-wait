import TokenCalculator from 'module/TokenCalculator';

it('can calculate the token coordinates', () => {
  const calculator = new TokenCalculator();
  const scene = {
    grid: {
      size: 10
    },
  };

  const token = {
    x: 1,
    y: 2,
    document: {
      width: 6,
      height: 2,
    },
  };

  const result = calculator.calculateCoordinates(scene, token);

  expect(result).toEqual({
    x: 31,
    y: 12,
  });
});
