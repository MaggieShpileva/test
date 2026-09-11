import { useEffect, type FC } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lockScroll, unlockScroll } from 'components-funtech-ui';
import WEBP_CLAIM_CHECK from '@assets/images/tasks/claim-check.webp';
import WEBP_CLAIM_COIN from '@assets/images/tasks/claim-coin.webp';
import styles from './BonusClaim.module.scss';

type BonusClaimProps = {
  isOpen: boolean;
  amount: number;
  onClose: () => void;
};

export const BonusClaim: FC<BonusClaimProps> = ({ isOpen, amount, onClose }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    lockScroll();
    return () => unlockScroll();
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className={styles.root}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.backdrop} aria-hidden />
          <motion.div
            className={styles.content}
            role="dialog"
            aria-modal="true"
            aria-label={`Получено ${amount} бонусов`}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className={styles.visuals} aria-hidden>
              <img className={styles.check} src={WEBP_CLAIM_CHECK} alt="" width={159} height={156} />
              <img className={styles.coin} src={WEBP_CLAIM_COIN} alt="" width={200} height={200} />
            </div>
            <p className={styles.amount}>
              <span className={styles.amountValue}>+{amount}</span>
              <span className={styles.amountLabel}>бонусов</span>
            </p>
            <button type="button" className={styles.cta} onClick={onClose}>
              получить
            </button>
            <p className={styles.note}>
              обычно награда приходит сразу, но в редких случаях может задержаться
              в пути, проверьте личный кабинет!
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
};
