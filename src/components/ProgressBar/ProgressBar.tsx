type Props = {
  count: number;
  filled: number;
};

export default function ProgressBar({ count, filled }: Props) {
  return (
    <div className="flex flex-wrap gap-1 max-w-full">
      {Array.from({ length: count }).map((_, i) => {
        const isFilled = i < filled;
        const isOver = filled > count;
        console.log("isover", isOver, "filled", filled, "count", count, "i", i);
        return (
          <div
            key={i}
            className={`
          w-3 h-4 rounded-sm
          ${isOver ? "bg-red-500" : isFilled ? "bg-purple-500" : "bg-gray-700"}
        `}
          />
        );
      })}
    </div>
  );
}
