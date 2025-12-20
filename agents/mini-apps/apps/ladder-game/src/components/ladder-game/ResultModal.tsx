/**
 * ResultModal Component
 *
 * 결과 표시 모달
 */

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button
} from '@mini-apps/ui';

interface ResultModalProps {
  isOpen: boolean;
  participant: string;
  result: string;
  onClose: () => void;
}

export function ResultModal({
  isOpen,
  participant,
  result,
  onClose
}: ResultModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">결과 발표</DialogTitle>
          <DialogDescription className="text-center">
            사다리 타기 결과입니다
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-2"
          >
            <div className="text-xl font-semibold text-muted-foreground">
              {participant} 님의 결과는
            </div>
            <div className="text-4xl font-bold text-primary">
              {result}
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center">
          <Button onClick={onClose} size="lg">
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
