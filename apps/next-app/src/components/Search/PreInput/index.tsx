import React from 'react';

import useTranslation from 'next-translate/useTranslation';

import { FiBarChart } from 'react-icons/fi';

import Header from './Header';
import styles from './PreInput.module.scss';
import SearchItem from './SearchItem';
import SearchQuerySuggestion from './SearchQuerySuggestion';

import Link from 'src/components/dls/Link/Link';
import SearchHistory from 'src/components/Search/SearchHistory';
import useGetChaptersData from 'src/hooks/useGetChaptersData';
import { getChapterData } from 'src/utils/chapter';
import { logButtonClick } from 'src/utils/eventLogger';
import { toLocalizedNumber, toLocalizedVerseKey } from 'src/utils/locale';
import { getSurahNavigationUrl } from 'src/utils/navigation';

interface Props {
  onSearchKeywordClicked: (searchQuery: string) => void;
  isSearchDrawer: boolean;
}

const POPULAR_SEARCH_QUERIES = { Mulk: 67, Noah: 71, Kahf: 18, Yaseen: 36 };

const PreInput: React.FC<Props> = ({ onSearchKeywordClicked, isSearchDrawer }) => {
  const { t, lang } = useTranslation('common');
  const chaptersData = useGetChaptersData(lang);
  if (!chaptersData) {
    return <></>;
  }
  const SEARCH_FOR_KEYWORDS = [
    `${t('juz')} ${toLocalizedNumber(1, lang)}`,
    `${t('page')} ${toLocalizedNumber(1, lang)}`,
    getChapterData(chaptersData, '36').transliteratedName,
    toLocalizedNumber(36, lang),
    toLocalizedVerseKey('2:255', lang),
  ];
  return (
    <div className={styles.container}>
      <div>
        <Header text={t('search.popular')} />
        <div>
          {Object.keys(POPULAR_SEARCH_QUERIES).map((popularSearchQuery) => {
            const chapterId = POPULAR_SEARCH_QUERIES[popularSearchQuery];
            const url = getSurahNavigationUrl(POPULAR_SEARCH_QUERIES[popularSearchQuery]);
            const chapterData = getChapterData(chaptersData, chapterId);
            return (
              <Link href={url} key={url} className={styles.popularSearchItem}>
                <SearchItem
                  prefix={<FiBarChart />}
                  title={chapterData.transliteratedName}
                  url={url}
                  key={url}
                  onClick={() => {
                    logButtonClick(
                      `search_${
                        isSearchDrawer ? 'drawer' : 'page'
                      }_popular_search_${popularSearchQuery}`
                    );
                  }}
                />
              </Link>
            );
          })}
        </div>
        <SearchHistory
          onSearchKeywordClicked={onSearchKeywordClicked}
          isSearchDrawer={isSearchDrawer}
        />
        <Header text={t('search.hint')} />
        {SEARCH_FOR_KEYWORDS.map((keyword, index) => {
          return (
            <SearchQuerySuggestion
              searchQuery={keyword}
              key={keyword}
              onSearchKeywordClicked={(searchQuery: string) => {
                logButtonClick(`search_${isSearchDrawer ? 'drawer' : 'page'}_search_hint_${index}`);
                onSearchKeywordClicked(searchQuery);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PreInput;
