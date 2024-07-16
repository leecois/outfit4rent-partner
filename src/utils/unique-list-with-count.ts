export const getUniqueListWithCount = <TData = any>(props: {
  list: Array<TData>;
  field: string;
}) => {
  const { list, field } = props;

  const uniqueList = list.reduce(
    (accumulator, item: any) => {
      if (accumulator[item[field]]) {
        accumulator[item[field]].count += 1;
      } else {
        accumulator[item[field]] = {
          ...item,
          count: 1,
        };
      }
      return accumulator;
    },
    {} as Record<string, TData & { count: number }>,
  );

  return Object.values(uniqueList);
};
