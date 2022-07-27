import useTranslation from 'next-translate/useTranslation';

import styles from './TarteelAttribution.module.scss';

import Link from 'src/components/dls/Link/Link';
import TarteelLogo from 'src/components/Icons/TarteelLogo/TarteelLogo';
import TarteelText from 'src/components/Icons/TarteelText/TarteelText';
import { logTarteelLinkClick } from 'src/utils/eventLogger';

interface Props {
  isCommandBar?: boolean;
}

const TarteelAttribution: React.FC<Props> = ({ isCommandBar = false }) => {
  const { t } = useTranslation('common');
  const onLinkClicked = () => {
    logTarteelLinkClick(isCommandBar ? 'command_bar' : 'search_drawer');
  };
  return (
    <Link href="https://download.tarteel.ai/" onClick={onLinkClicked} isNewTab>
      <div className={styles.container}>
        <span className={styles.poweredBy}>{t('voice.voice-search-powered-by')}</span>
        <TarteelLogo />
        <span className={styles.tarteelTextWrapper}>
          <TarteelText />
        </span>
      </div>
    </Link>
  );
};

export default TarteelAttribution;
