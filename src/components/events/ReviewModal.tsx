import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from 'sonner';
import { createReview } from '@/services';


interface ReviewModalProps {
  eventId: number;
  userId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewSubmitted?: () => void;
}


const ReviewModal = ({ eventId, userId, isOpen, onOpenChange, onReviewSubmitted }: ReviewModalProps) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async () => {
    if (score === 0) {
      toast.error('Por favor, selecciona una calificación');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(eventId, userId, score, comment)
      await createReview(eventId, userId, {
        score,
        comment,
      });
      toast.success('Reseña enviada exitosamente');
      onOpenChange(false);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      setScore(0);
      setComment('');
    } catch (error) {
      toast.error('Error al enviar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Reseña</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setScore(value)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    value <= score
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-none text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="grid gap-2">
            <textarea
              className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tu comentario aquí..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Enviar Reseña
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
