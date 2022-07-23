import { useState } from 'react';

import Cookies from 'js-cookie';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

import { FiArrowLeft } from 'react-icons/fi';
import { FiLogOut } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';

import Button, { ButtonShape, ButtonVariant } from 'src/components/dls/Button/Button';
import PopoverMenu from 'src/components/dls/PopoverMenu/PopoverMenu';
import { logoutUser } from 'src/utils/auth/api';
import { isLoggedIn } from 'src/utils/auth/login';

const COOKIES_KEY = 'show-login-button';

const shouldShowButton = () => {
  if (Cookies.get(COOKIES_KEY)) {
    return true;
  }
  const randomNumber = Math.floor(Math.random() * (100 - 1) + 1);
  if (
    randomNumber <= Number(process.env.NEXT_PUBLIC_SHOW_LOGIN_BUTTON_THRESHOLD)
  ) {
    Cookies.set(COOKIES_KEY, 'true');
    return true;
  }
  return false;
};

const ProfileAvatarButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('common');
  const router = useRouter();

  if (!shouldShowButton()) {
    return <></>;
  }

  const isUserLoggedIn = isLoggedIn();

  const trigger = (
    <Button
      tooltip={isUserLoggedIn ? t('profile') : t('login')}
      variant={ButtonVariant.Ghost}
      href={isUserLoggedIn ? null : '/login'}
      shape={ButtonShape.Circle}
    >
      <FiUser />
    </Button>
  );

  const onLogoutClicked = () => {
    logoutUser().then(() => {
      router.reload();
    });
  };

  const onProfileClicked = () => {
    router.push('/profile').then(() => {
      setIsOpen(false);
    });
  };
  if (isUserLoggedIn) {
    return (
      <PopoverMenu trigger={trigger} isOpen={isOpen} onOpenChange={setIsOpen}>
        <PopoverMenu.Item onClick={onProfileClicked} icon={<FiArrowLeft />}>
          {t('profile')}
        </PopoverMenu.Item>
        <PopoverMenu.Item onClick={onLogoutClicked} icon={<FiLogOut />}>
          {t('logout')}
        </PopoverMenu.Item>
      </PopoverMenu>
    );
  }

  return trigger;
};

export default ProfileAvatarButton;
