import { useState } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import PauseIcon from '../../../../public/icons/pause.svg';
import PlayIcon from '../../../../public/icons/play-arrow.svg';
import { triggerPauseAudio, triggerPlayAudio } from '../EventTriggers';
import SurahAudioMismatchModal from '../SurahAudioMismatchModal';

import Button, { ButtonShape, ButtonVariant } from 'src/components/dls/Button/Button';
import Spinner, { SpinnerSize } from 'src/components/dls/Spinner/Spinner';
import useChapterIdsByUrlPath from 'src/hooks/useChapterId';
import {
  AudioDataStatus,
  loadAndPlayAudioData,
  selectAudioData,
  selectAudioDataStatus,
  selectAudioPlayerState,
} from 'src/redux/slices/AudioPlayer/state';
import { getChapterData } from 'src/utils/chapter';
import { withStopPropagation } from 'src/utils/event';

const PlayPauseButton = () => {
  const dispatch = useDispatch();

  const { isPlaying } = useSelector(selectAudioPlayerState, shallowEqual);
  const isLoading = useSelector(selectAudioDataStatus) === AudioDataStatus.Loading;

  const audioData = useSelector(selectAudioData, shallowEqual);
  const currentReadingChapterIds = useChapterIdsByUrlPath();
  const currentAudioChapterId = audioData?.chapterId?.toString();

  const [isMismatchModalVisible, setIsMismatchModalVisible] = useState(false);

  // check if the current audio file matches the current reading chapter
  // continue playing if it matches
  // otherwise, show the mismatch modal
  const onClickPlay = () => {
    const noReadingChapterIdsFound = currentReadingChapterIds.length === 0; // e.g : homepage
    if (currentReadingChapterIds.includes(currentAudioChapterId) || noReadingChapterIdsFound) {
      triggerPlayAudio();
    } else {
      setIsMismatchModalVisible(true);
    }
  };

  let button;

  if (isLoading)
    button = (
      <Button
        tooltip="Loading ..."
        shape={ButtonShape.Circle}
        variant={ButtonVariant.Ghost}
        onClick={withStopPropagation(triggerPauseAudio)}
      >
        <Spinner size={SpinnerSize.Large} />
      </Button>
    );
  else if (isPlaying)
    button = (
      <Button
        tooltip="Pause"
        shape={ButtonShape.Circle}
        variant={ButtonVariant.Ghost}
        onClick={withStopPropagation(triggerPauseAudio)}
      >
        <PauseIcon />
      </Button>
    );
  else if (!isPlaying)
    button = (
      <Button
        tooltip="Play"
        shape={ButtonShape.Circle}
        variant={ButtonVariant.Ghost}
        onClick={withStopPropagation(onClickPlay)}
      >
        <PlayIcon />
      </Button>
    );

  const [firstCurrentReadingChapterId] = currentReadingChapterIds; // get the first chapter in this page
  return (
    <>
      {button}
      <SurahAudioMismatchModal
        isOpen={isMismatchModalVisible}
        currentAudioChapter={getChapterData(currentAudioChapterId)?.nameSimple}
        currentReadingChapter={getChapterData(firstCurrentReadingChapterId)?.nameSimple}
        onContinue={() => {
          triggerPlayAudio();
          setIsMismatchModalVisible(false);
        }}
        onStartOver={() => {
          dispatch(loadAndPlayAudioData(Number(firstCurrentReadingChapterId)));
          setIsMismatchModalVisible(false);
        }}
      />
    </>
  );
};

export default PlayPauseButton;