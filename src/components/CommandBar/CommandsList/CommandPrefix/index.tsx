import React from 'react';

import useTranslation from 'next-translate/useTranslation';
import { FiChevronLeft } from 'react-icons/fi';

import styles from './CommandPrefix.module.scss';

import { SearchNavigationType } from 'types/SearchNavigationResult';

interface Props {
  name: string;
  type: SearchNavigationType;
}

const CommandPrefix: React.FC<Props> = ({ name, type }) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.container}>
      <span className={styles.commandPrefix}>
        <FiChevronLeft />
      </span>
      <p className={styles.name}>
        {type === SearchNavigationType.SEARCH_PAGE
          ? t('search-for', {
              searchQuery: name,
            })
          : name}
      </p>
    </div>
  );
};

export default CommandPrefix;
