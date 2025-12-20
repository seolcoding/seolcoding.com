interface ChosungDisplayProps {
  chosung: string;
}

export function ChosungDisplay({ chosung }: ChosungDisplayProps) {
  const letters = chosung.split('');

  return (
    <div className="flex justify-center items-center gap-3 my-8 flex-wrap">
      {letters.map((letter, index) => (
        <div
          key={index}
          className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center
                     bg-purple-600 rounded-2xl shadow-lg
                     text-4xl md:text-6xl font-bold text-white
                     animate-bounce"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '1s',
            animationIterationCount: '1',
            animationFillMode: 'forwards'
          }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}
