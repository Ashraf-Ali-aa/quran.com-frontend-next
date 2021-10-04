import React from 'react';

import { GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';

import NextSeoWrapper from 'src/components/NextSeoWrapper';

const About = () => {
  const { t } = useTranslation();
  const quranCom = t('common:Quran-com');
  const description = t('about:description');

  return (
    <>
      <NextSeoWrapper title={t('about:title')} />
      <span>{quranCom}</span>
      <span>{description}</span>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default About;
