export const SeparatorWithOr = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <div className="h-5 border-b my-2 text-center w-full">
      <span className="bg-background px-4 absolute left-1/2 -translate-x-1/2 mt-2 text-gray-500">
        {children ?? "or"}
      </span>
    </div>
  );
};
