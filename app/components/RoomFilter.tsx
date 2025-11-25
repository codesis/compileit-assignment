import React, { useState, useEffect } from 'react';
import { ROOMS } from '@/lib/rooms';

interface RoomFilterProps {
  filteredRooms: Set<string>;
  filterDropdownOpen: boolean;
  onToggleDropdown: () => void;
  onApplyFilter: (rooms: Set<string>) => void;
}

export function RoomFilter({
  filteredRooms,
  filterDropdownOpen,
  onToggleDropdown,
  onApplyFilter,
}: RoomFilterProps) {
  const [tempSelectedRooms, setTempSelectedRooms] = useState<Set<string>>(new Set(filteredRooms));

  useEffect(() => {
    if (filterDropdownOpen) {
      setTempSelectedRooms(new Set(filteredRooms));
    }
  }, [filterDropdownOpen, filteredRooms]);

  const handleToggleRoom = (roomId: string) => {
    setTempSelectedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) {
        next.delete(roomId);
      } else {
        next.add(roomId);
      }
      return next;
    });
  };

  const handleApply = () => {
    onApplyFilter(tempSelectedRooms);
    onToggleDropdown();
  };

  const handleClearAll = () => {
    setTempSelectedRooms(new Set());
  };

  const getFilterText = () => {
    const count = filteredRooms.size;
    const total = ROOMS.length;

    if (count === 0) {
      return 'Inga valda rum';
    } else if (count === 1) {
      return '1 valt rum';
    } else if (count === total) {
      return 'Mötesrum';
    } else {
      return `${count} valda rum`;
    }
  };

  return (
    <div className="relative mb-12" data-filter-dropdown>
      <button
        type="button"
        onClick={onToggleDropdown}
        aria-controls="filter"
        aria-expanded={filterDropdownOpen}
        className="
        cursor-pointer 
        flex 
        items-center 
        justify-between 
        w-42 
        rounded-md 
        border 
      border-neutral-500
        bg-white 
        px-3 
        py-1 
        text-lg 
        font-normal 
        text-black 
        hover:outline-2 
        hover:border-transparent 
        focus-visible:outline 
        focus-visible:outline-black
        "
      >
        <span>{getFilterText()}</span>
        <span
          aria-hidden="true"
          className={`text-3xl font-extralight scale-y-50
            ${filterDropdownOpen ? 'rotate-180' : ''}
            `}
        >
          v
        </span>
      </button>

      {filterDropdownOpen && (
        <div
          id="filter"
          role="group"
          aria-label="Filtrera rum"
          className="
          absolute 
          top-full 
          left-0 
          mt-1 
          w-full 
          bg-white 
          border 
          border-neutral-500 
          rounded-md 
          shadow-xl/30 
          z-20"
        >
          <div className="p-2 space-y-1">
            <ul className="list-none">
              {ROOMS.map((room) => (
                <li key={room.id}>
                  <label
                    className="
                  flex 
                  items-center 
                  justify-between 
                  px-4 
                  py-2 
                  text-black 
                  hover:bg-emerald-900 
                  hover:text-white 
                  cursor-pointer 
                  rounded 
                  focus-within:bg-emerald-900 
                  focus-within:text-white
                  "
                  >
                    <span className="text-base ">
                      {room.name} ({room.capacity} personer)
                    </span>
                    <input
                      type="checkbox"
                      checked={tempSelectedRooms.has(room.id)}
                      onChange={() => handleToggleRoom(room.id)}
                      className="
                    appearance-none 
                    relative 
                    h-5 
                    w-5 
                    cursor-pointer 
                    bg-white 
                    before:absolute 
                    before:left-1/5 
                    before:bottom-0 
                    before:content-['']
                    before:text-emerald-800 
                    checked:before:content-['✓'] 
                    rounded-xs outline-1 
                    focus:ring-brand-500 
                    focus-visible:outline-white
                    "
                    />
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex px-4 py-2 gap-2 mt-6">
              <button
                type="button"
                className="
                rounded-xl 
                px-4 
                py-3 
                bg-black 
                text-white 
                flex-1/2 
                active:bg-emerald-900 
                hover:bg-emerald-900 
                focus-visible:outline-2 
                focus-visible:outline-offset-2 
                focus-visible:outline-black
                "
                onClick={handleApply}
              >
                Välj
              </button>
              <button
                type="button"
                className="
                rounded-xl 
                px-4 
                py-3 
                bg-neutral-700 
                text-white flex-1/2 
                active:bg-emerald-900
                hover:bg-emerald-900 
                focus-visible:outline-2 
                focus-visible:outline-offset-2 
                focus-visible:outline-black
                "
                onClick={handleClearAll}
              >
                Avmarkera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
