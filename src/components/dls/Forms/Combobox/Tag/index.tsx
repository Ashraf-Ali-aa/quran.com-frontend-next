import React, { memo } from 'react';

import classNames from 'classnames';
import { FiX } from 'react-icons/fi';

import styles from './Tag.module.scss';

import ComboboxSize from 'src/components/dls/Forms/Combobox/types/ComboboxSize';

interface Props {
  onRemoveTagClicked: (event: React.MouseEvent<HTMLSpanElement>, tag: string) => void;
  size: ComboboxSize;
  tag: string;
}

const Tag: React.FC<Props> = ({ onRemoveTagClicked, size, tag }) => (
  <span
    className={classNames(styles.item, {
      [styles.largeItem]: size === ComboboxSize.Large,
    })}
  >
    <span className={styles.itemContent}>{tag}</span>
    <span
      className={styles.itemRemove}
      unselectable="on"
      aria-hidden="true"
      onClick={(event) => {
        onRemoveTagClicked(event, tag);
      }}
    >
      <span role="img" aria-label="close" className={styles.icon}>
        <FiX />
      </span>
    </span>
  </span>
);

export default memo(Tag);
