import { useState, useEffect } from 'react';
import { FeedbackWithDetails, FeedbackAnswerWithDetails, FeedbackStatus, FeedbackTypeColors, FeedbackStatusColors } from '@/models';
import { getFeedbackAnswers, createFeedbackAnswer, updateFeedback } from '@/services/pqrs';
import { getUser } from '@/services';
import useUserStore from '@/store/user';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { format } from 'date-fns';


interface FeedbackDetailProps {
  feedback: FeedbackWithDetails;
  onClose: () => void;
  onUpdate: () => void;
}


export function FeedbackDetail({ feedback, onClose, onUpdate }: Readonly<FeedbackDetailProps>) {
  const [answers, setAnswers] = useState<FeedbackAnswerWithDetails[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus>(FeedbackStatus.UNDER_REVIEW);
  const { user } = useUserStore();

  const loadAnswers = async () => {
    try {
      const response = await getFeedbackAnswers({ filter: `feedback_id=${feedback.id}` });
      const data = response.data;

      const answerWithDetails = await Promise.all(
        data.map(async answer => {
          const author = await getUser(answer.author_id);
          const { author_id, ...rest } = answer;
          return { ...rest, author, feedback };
        })
      );
      setAnswers(answerWithDetails);
    } catch (error) {
      console.error('Error loading answers:', error);
    }
  };

  useEffect(() => {
    loadAnswers();
  }, [feedback.id]);

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) return;

    setLoading(true);
    try {
      // Siempre crear la respuesta y actualizar el estado a RESOLVED
      await createFeedbackAnswer({
        content: newAnswer,
        author_id: user?.id,
        feedback_id: feedback.id!,
      });

      await updateFeedback(feedback.id!, { status: FeedbackStatus.RESOLVED });

      toast.success('Respuesta enviada exitosamente');
      setNewAnswer('');
      loadAnswers();
      onUpdate();
    } catch (error) {
      toast.error('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: FeedbackStatus) => {
    if (newStatus === FeedbackStatus.RESOLVED && !newAnswer.trim()) return;

    setLoading(true);
    try {
      if (newStatus === FeedbackStatus.RESOLVED) {
        // Si se cambia a RESOLVED, crear la respuesta
        await createFeedbackAnswer({
          content: newAnswer,
          author_id: user?.id,
          feedback_id: feedback.id!,
        });
      }

      await updateFeedback(feedback.id!, { status: newStatus });
      toast.success(newStatus === FeedbackStatus.RESOLVED
        ? 'Respuesta enviada exitosamente'
        : 'Estado actualizado exitosamente');

      if (newStatus === FeedbackStatus.RESOLVED) {
        setNewAnswer('');
        loadAnswers();
      }
      onUpdate();
    } catch (error) {
      toast.error('Error al actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si ya existe una respuesta y si el estado es pendiente
  const hasAnswer = answers.length > 0;
  const isPending = feedback.status === FeedbackStatus.PENDING;


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{feedback.title}</h2>
          <div className="flex gap-2 mt-2">
            <Badge className={`${FeedbackTypeColors[feedback.type].bg} ${FeedbackTypeColors[feedback.type].text}`}>
              {feedback.type}
            </Badge>
            <Badge className={`${FeedbackStatusColors[feedback.status].bg} ${FeedbackStatusColors[feedback.status].text}`}>
              {feedback.status}
            </Badge>
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>
          Volver
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap">{feedback.content}</p>
          <p className="text-sm text-gray-500 mt-4">
            Creado el {format(new Date(feedback.created_at), 'dd/MM/yyyy HH:mm')} por {feedback.author.profile.first_name} {feedback.author.profile.last_name}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Respuesta</h3>
        {answers.map((answer) => {
          return (
            <Card key={answer.id} className="bg-gray-50">
              <CardContent className="pt-6">
                <p className="whitespace-pre-wrap">{answer.content}</p>
                <p className="text-sm text-gray-500 mt-4">
                  Respondido el {format(new Date(answer.created_at), 'dd/MM/yyyy HH:mm')} por {answer.author.profile.first_name} {answer.author.profile.last_name}
                </p>
              </CardContent>
            </Card>
          );
        })}

        {/* Formulario de respuesta */}
        {!hasAnswer && (user?.role_id === 1 || feedback.author.id === user?.id) && (
          <div className="space-y-4">
            {isPending && (
              <RadioGroup
                defaultValue={FeedbackStatus.UNDER_REVIEW}
                className="grid grid-cols-2 gap-4 mb-4"
                onValueChange={(value) => setSelectedStatus(value as FeedbackStatus)}
              >
                <div>
                  <RadioGroupItem
                    value={FeedbackStatus.UNDER_REVIEW}
                    id="under_review"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="under_review"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    En revisión
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value={FeedbackStatus.RESOLVED}
                    id="resolved"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="resolved"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Resuelto
                  </Label>
                </div>
              </RadioGroup>
            )}

            {(!isPending || (isPending && selectedStatus === FeedbackStatus.RESOLVED)) && (
              <Textarea
                placeholder="Escriba su respuesta..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="min-h-[100px]"
              />
            )}

            <Button
              onClick={isPending ? () => handleStatusChange(selectedStatus) : handleSubmitAnswer}
              disabled={loading || (
                (isPending && selectedStatus === FeedbackStatus.RESOLVED && !newAnswer.trim()) ||
                (!isPending && !newAnswer.trim())
              )}
              className="w-full"
            >
              {isPending && selectedStatus === FeedbackStatus.UNDER_REVIEW ? 'Actualizar estado' : 'Enviar respuesta'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}