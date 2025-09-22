// 간단한 유닛 테스트들
test('basic math operations', () => {
  expect(2 + 2).toBe(4);
  expect(10 - 5).toBe(5);
  expect(3 * 4).toBe(12);
  expect(8 / 2).toBe(4);
});

test('string operations', () => {
  expect('hello').toContain('he');
  expect('world').toHaveLength(5);
  expect('test').toMatch(/^t/);
});

test('array operations', () => {
  const arr = [1, 2, 3, 4, 5];
  expect(arr).toHaveLength(5);
  expect(arr).toContain(3);
  expect(arr[0]).toBe(1);
  expect(arr[arr.length - 1]).toBe(5);
});

test('object operations', () => {
  const obj = { name: 'test', value: 42 };
  expect(obj).toHaveProperty('name');
  expect(obj.name).toBe('test');
  expect(obj.value).toBe(42);
});
