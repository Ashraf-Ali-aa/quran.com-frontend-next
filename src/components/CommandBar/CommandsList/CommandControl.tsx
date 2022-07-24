import React, { MouseEvent } from 'react';

import { FiX } from 'react-icons/fi';

import Button, { ButtonSize, ButtonVariant } from 'src/components/dls/Button/Button';
// import KeyboardInput from 'src/components/dls/KeyboardInput';

interface Props {
  isClearable: boolean;
  isSelected: boolean;
  commandKey: number | string;
  onRemoveCommandClicked: (event: MouseEvent<Element>, key: number | string) => void;
}

const CommandControl: React.FC<Props> = ({
  isClearable,
  onRemoveCommandClicked,
  commandKey,
  isSelected,
}) => {
  if (isClearable) {
    return (
      <Button
        variant={ButtonVariant.Ghost}
        size={ButtonSize.Small}
        onClick={(e) => onRemoveCommandClicked(e, commandKey)}
      >
        <FiX />
      </Button>
    );
  }
  if (isSelected) {
    // return <KeyboardInput keyboardKey="Enter" />;
    return null;
  }
  return null;
};

export default CommandControl;
