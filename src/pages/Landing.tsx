import { useState } from "react";
import Navbar from "../components/Navbar";
import CharacterCard from "../components/CharacterCard";
import NewCharacterModal from "../components/NewCharacterModal";
import type { Character } from "@/api/characters";
import { saveDataTiers } from "@/api/saveDatatiers";

export default function Landing() {
  const [selectedCharacters, setSelectedCharacters] = useState<
    (Character | null)[]
  >([null, null, null]);
  const [modalSlot, setModalSlot] = useState<number | null>(null);
  const [maxSaveData, setMaxSaveData] = useState<number>(30);
  const [selectedTier, setSelectedTier] = useState(saveDataTiers[0]!);

  const assignCharacter = (index: number, char: Character) => {
    const updated = [...selectedCharacters];
    updated[index] = char;
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
            value={selectedTier.tier}
            onChange={(e) => handleTierChange(e.target.value)}
            className="bg-gray-800 border border-purple-500 border-opacity-40 text-gray-100 text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors cursor-pointer"
          >
            {saveDataTiers.map(({ tier }) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
          <span className="text-gray-400 text-sm">
            Cap:{" "}
            <span className="text-gray-100 font-medium">{maxSaveData}</span>
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
              key={index}
              index={index}
              character={character}
              onOpenModal={() => setModalSlot(index)}
              selectedTier={selectedTier}
            />
          ))}
        </div>
      </main>

      {modalSlot !== null && (
        <NewCharacterModal
          onPick={(char) => {
            assignCharacter(modalSlot, char);
            setModalSlot(null);
          }}
          onClose={() => setModalSlot(null)}
          taken={selectedCharacters.filter(Boolean) as Character[]}
        />
      )}
    </div>
  );
}
