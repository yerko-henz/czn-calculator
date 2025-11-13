import type { Character } from '@/api/characters';
import { characters } from '@/api/characters';


type Props = {
  onPick: (char: Character) => void;
  onClose: () => void;
  taken: Character[];
};

export default function NewCharacterModal({ onPick, onClose, taken }: Props) {
  const available = characters.filter(
    c => !taken.some(t => t.name === c.name)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Select Character</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
          {available.map(char => (
            <button
              key={char.name}
              onClick={() => onPick(char)}
              className="bg-gray-700 hover:bg-purple-700 border border-purple-500 border-opacity-30 rounded-lg p-3 transition-all flex flex-col items-center gap-2"
            >
              <img src={char.img} alt={char.name} className="w-20 h-20 rounded" />
              <span className="text-white text-xs text-center">{char.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
