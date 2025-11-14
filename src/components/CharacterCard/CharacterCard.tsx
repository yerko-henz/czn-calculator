import { useEffect, useMemo, useState } from "react";
import type { Character } from "@/api/characters";
import { type Rule, rules } from "@/api/rules";
import type { SaveDataTier } from "@/api/saveDataTiers";
import ProgressBar from "../ProgressBar";

type Props = {
  index: number;
  character: Character | null;
  onOpenModal: () => void;
  selectedTier: SaveDataTier;
  removeCharacter: (index: number) => void;
};

export default function CharacterCard({
  character,
  onOpenModal,
  selectedTier,
  removeCharacter,
  index,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [rulesCounter, setRulesCounter] = useState(
    rules.map((rule) => ({ ...rule, ogValue: rule.value, count: 0 }))
  );

  const [totalPoints, setTotalPoints] = useState(0);

  const handleClick = () => {
    if (character) setExpanded(!expanded);
    else onOpenModal();
  };

  useEffect(() => {
    setTotalPoints(() =>
      rulesCounter.reduce(
        (acc, rule) => acc + ((rule.count ?? 0) > 0 ? rule.value ?? 0 : 0),
        0
      )
    );
  }, [rulesCounter]);

  const updateRules = (key: string, newVal: number) => {
    setRulesCounter((prev) => {
      return prev.map((rule) => {
        if (rule.key === key) {
          const newCount = rule.count + newVal;
          return {
            ...rule,
            count: newCount,
            value: (rule.calculateValue
              ? rule.calculateValue(newCount)
              : rule.ogValue * newCount) as number,
          };
        }
        return rule;
      });
    });
  };

  const cap = selectedTier.cap;
  const bg = character ? `${character.color}33` : "rgba(31,41,55,0.7)";
  const border = character ? character.color : "rgba(168,85,247,0.4)";

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div
        className=" rounded-lg flex items-center justify-center cursor-pointer transition-all min-h-20 text-center"
        onClick={handleClick}
        style={{
          backgroundColor: bg,
          border: `2px solid ${border}`,
        }}
      >
        {character ? (
          <span
            className="text-2xl font-bold text-center px-2 relative w-full"
            style={{ color: character.color }}
          >
            {character.name}
            <button
              className=" text-gray-400 absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => removeCharacter(index)}
            >
              🗑️
            </button>
          </span>
        ) : (
          <span className="text-6xl text-purple-400 font-light">+</span>
        )}
      </div>

      {character && expanded && (
        <div
          className="rounded-lg p-4 transition-allitems-center text-center grid grid-cols-2"
          style={{
            backgroundColor: `${character.color}22`,
            border: `2px solid ${totalPoints > cap ? "red" : character.color}`,
          }}
        >
          {rulesCounter.map(({ key, label, count }) => (
            <div
              className="flex flex-col gap-1 mb-3 items-center w-full"
              key={key}
            >
              <label className="text-xs font-medium text-gray-100">
                {label}
              </label>
              <div className="flex flex-col-reverse items-center justify-center gap-1">
                <button
                  className="w-7 h-7 rounded flex items-center justify-center text-lg text-white transition-all"
                  disabled={count === 0}
                  onClick={() => updateRules(key, -1)}
                  style={{ backgroundColor: character.color, opacity: 0.8 }}
                >
                  -
                </button>
                <span className="w-12 h-7 text-white text-center rounded">
                  {count}
                </span>

                <button
                  className="w-7 h-7 rounded flex items-center justify-center text-lg text-white transition-all"
                  onClick={
                    () => updateRules(key, 1)
                    // setTotalPoints((prev) => Math.max(0, prev + (value || 0)))
                  }
                  style={{ backgroundColor: character.color, opacity: 0.8 }}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* total stats vs cap */}
          <span
            className={`${
              totalPoints > cap ? "text-red-400" : "text-gray-100"
            } col-span-2`}
          >
            {totalPoints} / {cap} Points
            <ProgressBar count={selectedTier.cap} filled={totalPoints} />
          </span>
        </div>
      )}
    </div>
  );
}
