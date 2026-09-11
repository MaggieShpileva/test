import type { FC } from 'react';
import { Accordion } from 'components-funtech-ui';
import { ACCORDION_ITEMS } from '@/mock/accordionItems';

export const Home: FC = () => {
  return (
    <Accordion
      items={ACCORDION_ITEMS}
      defaultOpenId="how-it-works"
      aria-label="Часто задаваемые вопросы"
      style={{ width: '100%', maxWidth: 560 }}
    />
  );
};
