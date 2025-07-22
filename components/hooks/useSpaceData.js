import { useEffect, useState } from 'react';

export const useSpaceData = (space_data, space_size) => {
  const [spaceData, setSpaceData] = useState({
    properties: [
      { name: "Интерактивная доска" },
      { name: "Кондиционер" },
      { name: "Проветривание" },
      { name: "Маскирование звука" },
      { name: "Биодинамическое освещение" },
    ],
    title: "Переговорная альфа",
    quantity: "до 15"
  });

  useEffect(() => {
    if (!space_data || !space_size || !space_data.name || !space_data.equipments) return;
    setSpaceData({
      properties: space_data.equipments.map(item => {
        const count = item.count && item.count > 1 ? ` ${item.count}шт` : "";
        return { name: item.type.name + count }
      }),
      quantity: space_size ?? null,
      title: space_data.name ?? "Переговорная альфа",
    });
  }, [space_data, space_size]);

  return spaceData;
}; 