import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createFeedback } from '@/services/pqrs';
import useUserStore from '@/store/user';
import { FeedbackType, FeedbackStatus } from '@/models';


const feedbackSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  content: z.string().min(20, 'El contenido debe tener al menos 20 caracteres'),
  type: z.nativeEnum(FeedbackType, { errorMap: () => ({ message: 'El tipo de evento es inválido' }) }),
});


interface FeedbackFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}


export function FeedbackForm({ onSuccess, onCancel }: Readonly<FeedbackFormProps>) {
  const { user } = useUserStore();

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: '',
      content: '',
      type: FeedbackType.QUESTION,
    },
  });

  const onSubmit = async (values: z.infer<typeof feedbackSchema>) => {
    try {
      await createFeedback({
        ...values,
        status: FeedbackStatus.PENDING,
        author_id: user?.id,
      });
      toast.success('PQR creado exitosamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al crear el PQR');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de PQR</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(FeedbackType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Escriba un título descriptivo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describa detalladamente su PQR"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Crear PQR</Button>
        </div>
      </form>
    </Form>
  );
};
