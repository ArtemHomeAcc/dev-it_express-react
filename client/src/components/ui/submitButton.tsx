'use client';

import { Button } from '@headlessui/react';
import { FC } from 'react';

type SubmitButtonProps = {
  loading: boolean;
  handleClick: () => void;
};

export const SubmitButton: FC<SubmitButtonProps> = ({
  loading,
  handleClick,
}) => {
  return (
    <Button
      onClick={handleClick}
      className={`rounded py-2 px-4 text-sm data-[active]:bg-sky-700 ${
        loading
          ? 'bg-sky-100 text-sky-700 cursor-wait data-[hover]:bg-sky-100 font-bold'
          : 'bg-sky-600 text-white data-[hover]:bg-sky-500'
      }`}
      disabled={loading}
      type="button"
    >
      Start
    </Button>
  );
};
