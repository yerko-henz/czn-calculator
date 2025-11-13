import { useState, useMemo, useEffect } from "react";
import type { Character } from "@/api/characters";
import { rules, type Rule } from "@/api/rules";
import type { SaveDataTier } from "@/api/saveDatatiers";

type Props = {
  index: number;
  character: Character | null;
  onOpenModal: () => void;
  selectedTier: SaveDataTier;
};

export default function CharacterCard({
  character,
  onOpenModal,
  selectedTier,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [rulesCounter, setRulesCounter] = useState(
    rules.map((rule) => ({ ...rule, count: 0 }))
  );

  const [totalPoints, setTotalPoints] = useState(0);

  const handleClick = () => {
    if (!character) onOpenModal();
    else setExpanded(!expanded);
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
    console.log("updating", key, newVal);

    setRulesCounter((prev) => {
      return prev.map((rule) => {
        if (rule.key === key) {
          const newCount = rule.count + newVal;
          return {
            ...rule,
            count: newCount,
            value: (rule.calculateValue
              ? rule.calculateValue(newCount)
              : rule.value) as number,
          };
        }
        return rule;
      });
    });
  };

  console.log("rules", rulesCounter, "totalPoints", totalPoints);

  const bg = character ? `${character.color}33` : "rgba(31,41,55,0.7)";
  const border = character ? character.color : "rgba(168,85,247,0.4)";

  const cap = selectedTier.cap;

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div
        onClick={handleClick}
        className=" rounded-lg flex items-center justify-center cursor-pointer transition-all"
        style={{
          backgroundColor: bg,
          border: `2px solid ${border}`,
        }}
      >
        {!character ? (
          <span className="text-6xl text-purple-400 font-light">+</span>
        ) : (
          <span
            className="text-2xl font-bold text-center px-2"
            style={{ color: character.color }}
          >
            {character.name}
          </span>
        )}
      </div>

      {character && expanded && (
        <div
          className="rounded-lg p-4 transition-all flex flex-col items-center text-center"
          style={{
            backgroundColor: `${character.color}22`,
            border: `2px solid ${character.color}`,
          }}
        >
          {rulesCounter.map(({ key, label, value, count }, index) => (
            <div
              key={key}
              className="flex flex-col gap-1 mb-3 items-center w-full"
            >
              <label className="text-xs font-medium text-gray-100">
                {label}
              </label>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => updateRules(key, -1)}
                  className="w-7 h-7 rounded flex items-center justify-center text-lg text-white transition-all"
                  style={{ backgroundColor: character.color, opacity: 0.8 }}
                  // disabled={totalPoints <= 0}
                >
                  -
                </button>
                <span className="w-12 h-7 text-white text-center rounded">
                  {count}
                </span>

                <button
                  onClick={
                    () => updateRules(key, 1)
                    // setTotalPoints((prev) => Math.max(0, prev + (value || 0)))
                  }
                  className="w-7 h-7 rounded flex items-center justify-center text-lg text-white transition-all"
                  style={{ backgroundColor: character.color, opacity: 0.8 }}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* total stats vs cap */}
          <div className="mt-2 text-sm font-semibold">
            <span
              className={`${
                totalPoints > cap ? "text-red-400" : "text-gray-100"
              }`}
            >
              Total: {totalPoints} / {cap}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
