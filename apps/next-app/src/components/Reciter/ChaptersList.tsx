import { useState } from 'react';

import classNames from 'classnames';
import clipboardCopy from 'clipboard-copy';
import useTranslation from 'next-translate/useTranslation';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { FiLink } from 'react-icons/fi';
import { FiDownload } from 'react-icons/fi';
import { FiPause } from 'react-icons/fi';
import { FiPlay } from 'react-icons/fi';
import { download } from '../AudioPlayer/Buttons/DownloadAudioButton';
import { triggerPauseAudio } from '../AudioPlayer/EventTriggers';
import ChapterIconContainer from '../chapters/ChapterIcon/ChapterIconContainer';
import Button, { ButtonShape, ButtonSize, ButtonVariant } from '../dls/Button/Button';
import Spinner, { SpinnerSize } from '../dls/Spinner/Spinner';
import { ToastStatus, useToast } from '../dls/Toast/Toast';

import styles from './ChapterList.module.scss';

import { getChapterAudioData } from 'src/api';
import { playFrom, selectAudioData, selectIsPlaying } from 'src/redux/slices/AudioPlayer/state';
import { logButtonClick, logEvent } from 'src/utils/eventLogger';
import { getReciterChapterNavigationUrl } from 'src/utils/navigation';
import { getWindowOrigin } from 'src/utils/url';
import Chapter from 'types/Chapter';
import Reciter from 'types/Reciter';

type ChaptersListProps = {
  filteredChapters: Chapter[];
  selectedReciter: Reciter;
};

const ChaptersList = ({ filteredChapters, selectedReciter }: ChaptersListProps) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { t, lang } = useTranslation();
  const isAudioPlaying = useSelector(selectIsPlaying);
  const currentAudioData = useSelector(selectAudioData, shallowEqual);

  const [currentlyDownloadChapterAudioId, setCurrentlyDownloadChapterAudioId] = useState(null);

  const playChapter = (chapterId: string) => {
    const selectedChapterId = chapterId;

    logEvent('reciter_page_chapter_played', {
      stationId: selectedChapterId,
    });

    dispatch(
      playFrom({
        chapterId: Number(selectedChapterId),
        reciterId: Number(selectedReciter.id),
        timestamp: 0,
      }),
    );
  };

  const onCopyUrlClicked = (chapterId) => {
    logButtonClick('reciter_page_chapter_url_copy');
    const origin = getWindowOrigin(lang);
    const path = getReciterChapterNavigationUrl(selectedReciter.id.toString(), chapterId);
    clipboardCopy(origin + path).then(() => {
      toast(t('common:shared'), { status: ToastStatus.Success });
    });
  };

  const onAudioDownloadClicked = async (chapterId) => {
    logButtonClick('reciter_page_chapter_audio_download');
    const audioData = await getChapterAudioData(Number(selectedReciter.id), Number(chapterId));

    setCurrentlyDownloadChapterAudioId(chapterId);
    download(audioData.audioUrl, () => {
      setCurrentlyDownloadChapterAudioId(null);
    });
  };

  return (
    <div className={styles.chapterListContainer}>
      {filteredChapters.map((chapter) => {
        const isAudioPlayingThisChapter =
          isAudioPlaying && currentAudioData.chapterId === Number(chapter.id);

        const onClick = () => {
          if (isAudioPlayingThisChapter) triggerPauseAudio();
          else playChapter(chapter.id.toString());
        };

        return (
          <div
            key={chapter.id}
            className={styles.chapterListItem}
            role="button"
            tabIndex={0}
            onKeyPress={onClick}
            onClick={onClick}
          >
            <div className={styles.chapterInfoContainer}>
              <div className={styles.playIconWrapper}>
                {isAudioPlayingThisChapter ? (
                  <span className={classNames(styles.playFiPause)}>
                    <FiPause />
                  </span>
                ) : (
                  <span
                    className={classNames(styles.playFiPause, styles.playIcon)}
                  >
                    <FiPlay />
                  </span>
                )}
              </div>
              <div>
                <div className={styles.chapterName}>
                  {chapter.localizedId}. {chapter.transliteratedName}
                </div>
                <span className={styles.chapterIconContainer}>
                  <ChapterIconContainer
                    chapterId={chapter.id.toString()}
                    hasSurahPrefix={false}
                  />
                </span>
              </div>
            </div>
            <div className={styles.actionsContainer}>
              <Button
                variant={ButtonVariant.Ghost}
                size={ButtonSize.Small}
                shape={ButtonShape.Circle}
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyUrlClicked(chapter.id);
                }}
                tooltip={t('reciter:copy-link')}
                ariaLabel={t('reciter:copy-link')}
              >
                <FiLink />
              </Button>
              <Button
                shape={ButtonShape.Circle}
                variant={ButtonVariant.Ghost}
                size={ButtonSize.Small}
                onClick={async (e) => {
                  e.stopPropagation();
                  onAudioDownloadClicked(chapter.id);
                }}
                tooltip={t('common:audio.player.download')}
                ariaLabel={t('common:audio.player.download')}
              >
                {currentlyDownloadChapterAudioId === chapter.id ? (
                  <Spinner size={SpinnerSize.Small} />
                ) : (
                  <FiDownload />
                )}
              </Button>
            </div>
          </div>
        );
      })}
      <div />
    </div>
  );
};

export default ChaptersList;
