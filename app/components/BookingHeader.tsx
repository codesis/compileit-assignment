import React from 'react';

export function BookingHeader(titleProp: { title: string }) {
  const title: string = titleProp.title;

  return (
    <header>
      <h1 className="text-black text-5xl font-normal">{title}</h1>
    </header>
  );
}
