const years = [2020, 2021, 2022, 2023, 2024, 2025];
const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const days = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];
// const day = days[Math.ceil(Math.random() * 31)];

module.exports = {
  buildOrderList: (amount, user_id) => {
    const orders = Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map(
      (_, index) => {
        const orderAmount =
          Number(amount) + Number(Math.ceil(Math.random() * 10) + 1);
        const year = years[Math.ceil(Math.random() * 5)];
        const month = months[Math.ceil(Math.random() * 11)];
        const day = days[Math.ceil(Math.random() * 30)];
        const date = new Date(year, month, day);
        console.table({ year, month, day, date });
        return {
          notes: `This is Order ${index + 1} for user ${user_id}`,
          amount: Number(orderAmount),
          user_id,
          tax: (1 / 100) * orderAmount,
          created_at: date,
          updated_at: date,
        };
      }
    );
    return orders;
  },
};
// console.log(buildOrderList(10, 2));
