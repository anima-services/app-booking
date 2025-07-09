import { useEffect, useState } from 'react';

export const useSpaceData = (data) => {
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
    if (!data.space_data || !data.space_size || !data.space_data.name || !data.space_data.equipments) return;
    setSpaceData({
      properties: data.space_data.equipments.map(item => {
        const count = item.count && item.count > 1 ? ` ${item.count}шт` : "";
        return { name: item.type.name + count }
      }),
      quantity: data.space_size ?? null,
      title: data.space_data.name ?? "Переговорная альфа",
    });
  }, [data.space_data, data.space_size]);

  return spaceData;
}; 