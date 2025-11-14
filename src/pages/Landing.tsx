import { useState } from "react";
import type { Character } from "@/api/characters";
import { saveDataTiers } from "@/api/saveDataTiers";
import CharacterCard from "../components/CharacterCard";
import Navbar from "../components/Navbar";
import NewCharacterModal from "../components/NewCharacterModal";

export default function Landing() {
  const [selectedCharacters, setSelectedCharacters] = useState<
    (Character | null)[]
  >([null, null, null]);
  const [modalSlot, setModalSlot] = useState<number | null>(null);
  const [maxSaveData, setMaxSaveData] = useState<number>(30);
  const [selectedTier, setSelectedTier] = useState(saveDataTiers[4]!);

  const assignCharacter = (index: number, char: Character) => {
    const updated = [...selectedCharacters];
    updated[index] = char;
    setSelectedCharacters(updated);
  };

  const removeCharacter = (index: number) => {
    const updated = [...selectedCharacters];
    updated[index] = null;
    setSelectedCharacters(updated);
  };

  const handleTierChange = (tier: string) => {
    const found = saveDataTiers.find((t) => t.tier === Number(tier));
    if (found) {
      setSelectedTier(found);
      setMaxSaveData(found.cap);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />

      {/* Tier selector */}
      <div className="container mx-auto mt-6 px-8">
        <div className="flex justify-center items-center gap-3">
          <label className="text-gray-100 text-sm font-semibold tracking-wide">
            Save Data Tier:
          </label>
          <select
            className="bg-gray-800 border border-purple-500 border-opacity-40 text-gray-100 text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors cursor-pointer"
            onChange={(e) => handleTierChange(e.target.value)}
            value={selectedTier.tier}
          >
            {saveDataTiers.map(({ tier }) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
          <span className="text-gray-400 text-sm flex items-center gap-2">
            Cap:{" "}
            <span className="text-gray-100 font-medium">{maxSaveData}</span>
            <button
              className="ml-2 px-2 py-1 bg-opacity-20 border border-red-500 border-opacity-40 text-red-400 rounded hover:bg-opacity-30 transition"
              onClick={() => setSelectedCharacters([null, null, null])}
            >
              Clear All
            </button>
          </span>
        </div>
      </div>

      <main className="container mx-auto p-8">
        <div
          className="
          flex
          flex-col
          gap-6 
          justify-center
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:flex-row
        "
        >
          {selectedCharacters.map((character, index) => (
            <CharacterCard
              character={character}
              index={index}
              key={index}
              onOpenModal={() => setModalSlot(index)}
              removeCharacter={removeCharacter}
              selectedTier={selectedTier}
            />
          ))}
        </div>
      </main>

      {modalSlot !== null && (
        <NewCharacterModal
          onClose={() => setModalSlot(null)}
          onPick={(char) => {
            assignCharacter(modalSlot, char);
            setModalSlot(null);
          }}
          taken={selectedCharacters.filter(Boolean) as Character[]}
        />
      )}
    </div>
  );
}
