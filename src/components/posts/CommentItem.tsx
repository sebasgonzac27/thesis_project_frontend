import{ useState } from 'react';
import { CommentWithDetails, ReactionType, Reaction } from '@/models';
import { Button } from "@/components/ui/button";
import { Reply } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import DeleteCommentDialog from './DeleteCommentDialog';
import ReactionButtons from './ReactionsButtons';
import { Textarea } from "@/components/ui/textarea";


interface CommentItemProps {
  comment: CommentWithDetails & { reactions?: Reaction[] };
  user: any;
  handleDeleteComment: (commentId: number) => void;
  handleReaction: (commentId: number, type: ReactionType) => void;
  level?: number;
  isReplying: boolean;
  onReplyClick: () => void;
  onCancelReply: () => void;
  onSubmitReply: (content: string) => Promise<void>;
}


export default function CommentItem({
  comment,
  user,
  handleDeleteComment,
  handleReaction,
  level = 0,
  isReplying,
  onReplyClick,
  onCancelReply,
  onSubmitReply
}: Readonly<CommentItemProps>) {
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canDeleteComment = user && (user.role_id === 1 || user.role_id === 2 || comment.author?.id === user.id);

  const getBorderColor = (level: number) => {
    const colors = [
      'border-gray-200',
      'border-blue-200',
      'border-green-200',
      'border-purple-200',
      'border-pink-200'
    ];
    return colors[level % colors.length];
  };

  const handleSubmit = async () => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitReply(replyContent);
      setReplyContent('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setReplyContent('');
    onCancelReply();
  };

  return (
    <div className={`border-l-2 ${getBorderColor(level)} pl-4 mb-5`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="font-semibold">
            {comment.author?.profile.first_name} {comment.author?.profile.last_name}
          </span>
          <span className="text-sm text-gray-500 ms-3">
            {formatDistance(new Date(comment.created_at), new Date(), {
              addSuffix: true,
              locale: es
            })}
          </span>
          {comment.parent?.id && (
            <span className="text-sm text-gray-500 ms-2">
              • en respuesta a un comentario
            </span>
          )}
        </div>
        {canDeleteComment && (
          <DeleteCommentDialog onDelete={() => handleDeleteComment(comment.id!)} />
        )}
      </div>
      <p className="my-2">{comment.content}</p>
      <ReactionButtons comment={comment} user={user} handleReaction={handleReaction} />
      <Button variant="ghost" size="sm" onClick={onReplyClick}>
        <Reply className="h-4 w-4 mr-1" /> Responder
      </Button>

      {isReplying && (
        <div className="mt-4 space-y-2">
          <Textarea
            placeholder={`Respondiendo a ${comment.author?.profile.first_name} ${comment.author?.profile.last_name}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !replyContent.trim()}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar respuesta'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
