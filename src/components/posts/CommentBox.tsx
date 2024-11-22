import { useState, useEffect } from 'react';
import { CommentWithDetails, ReactionType } from '@/models';
import { commentService, reactionService, postService, getUser } from '@/services';
import { toast } from 'sonner';
import useUserStore from '@/store/user';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';


interface CommentNode extends CommentWithDetails {
  children: CommentNode[];
  reactions?: any[];
}


export default function CommentBox({ postId }: Readonly<{ postId: number }>) {

  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<CommentWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyComment, setReplyComment] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);


  const loadCommentDetails = async (comment: any) => {
    try {
      const author = await getUser(comment.author_id);
      const { author_id, ...rest } = comment;
      const reactionsResponse = await reactionService.getReactions({ filter: `comment_id=${comment.id}` });
      return { ...rest, author, reactions: reactionsResponse.data };
    } catch (error) {
      console.error(`Error loading details for comment ${comment.id}:`, error);
      return null;
    }
  };

  const loadCommentWithReplies = async (comment: any): Promise<CommentNode | null> => {
    try {
      const commentWithDetails = await loadCommentDetails(comment);
      if (!commentWithDetails) return null;

      let replies: any[] = [];
      try {
        replies = await commentService.getReplies(comment.id);
      } catch (error) {
        console.error(`Error loading replies for comment ${comment.id}:`, error);
        replies = [];
      }

      const children = await Promise.all(
        replies.map(async reply => {
          const childNode = await loadCommentWithReplies(reply);
          return childNode;
        })
      );

      return {
        ...commentWithDetails,
        children: children.filter((child): child is CommentNode => child !== null)
      };
    } catch (error) {
      console.error(`Error in loadCommentWithReplies for comment ${comment.id}:`, error);
      return null;
    }
  };

  const loadComments = async () => {
    try {
      const rootComments = await postService.getComments(postId);
      const rootCommentsWithoutReplies = rootComments.filter(comment => comment && comment.parent_id === null);

      const fullCommentTree = await Promise.all(
        rootCommentsWithoutReplies.map(comment => loadCommentWithReplies(comment))
      );

      const validComments = fullCommentTree.filter((comment): comment is CommentNode => comment !== null);

      const sortByDate = (a: CommentNode, b: CommentNode) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

      const sortedComments = [...validComments].sort(sortByDate);

      const sortChildrenRecursively = (comments: CommentNode[]) => {
        comments.forEach(comment => {
          comment.children.sort(sortByDate);
          sortChildrenRecursively(comment.children);
        });
      };

      sortChildrenRecursively(sortedComments);
      setComments(sortedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Error al cargar los comentarios');
    }
  };


  useEffect(() => {
    loadComments();
  }, [postId]);


  const handleSubmitComment = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para comentar');
      return;
    }
    if (!newComment.trim()) {
      toast.error('El comentario no puede estar vacío');
      return;
    }
    setLoading(true);
    try {
      await commentService.createComment({
        content: newComment.trim(),
        author_id: user.id,
        post_id: postId,
        parent_id: replyTo?.id ?? null,
      });
      toast.success('Comentario publicado exitosamente');
      setNewComment('');
      setReplyTo(null);
      loadComments();
    } catch {
      toast.error('Error al publicar el comentario');
    } finally {
      setLoading(false);
    }
  };


  const handleSubmitReply = async (commentId: number, content: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión para comentar');
      return;
    }
    try {
      await commentService.createComment({
        content: content.trim(),
        author_id: user.id,
        post_id: postId,
        parent_id: commentId,
      });
      toast.success('Respuesta publicada exitosamente');
      setReplyingTo(null);
      loadComments();
    } catch (error) {
      toast.error('Error al publicar la respuesta');
      throw error;
    }
  };


  const deleteCommentRecursively = async (commentId: number) => {
    try {
      const replies = await commentService.getReplies(commentId);
      for (const reply of replies) {
        await deleteCommentRecursively(reply.id);
      }
      await commentService.deleteComment(commentId);
    } catch (error) {
      console.error(`Error deleting comment ${commentId} or its replies:`, error);
      throw error;
    }
  };


  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentRecursively(commentId);
      setComments(prevComments => {
        const removeComment = (comments: CommentNode[]): CommentNode[] => {
          return comments.filter(comment => {
            if (comment.id === commentId) return false;
            comment.children = removeComment(comment.children);
            return true;
          });
        };
        return removeComment([...prevComments]);
      });
      toast.success('Comentario eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error al eliminar el comentario');
    }
  };


  const handleReaction = async (commentId: number, type: ReactionType) => {
    if (!user) {
      toast.error('Debes iniciar sesión para reaccionar');
      return;
    }
    try {
      const existingReactions = await reactionService.getReactions({ filter: `comment_id=${commentId},author_id=${user.id}` });
      const existingReaction = existingReactions.data[0];
      if (existingReaction) {
        if (existingReaction.type === type) {
          await reactionService.deleteReaction(existingReaction.id!);
        } else {
          await reactionService.updateReaction(existingReaction.id!, { type });
        }
      } else {
        await reactionService.createReaction({ type, author_id: user.id, comment_id: commentId });
      }
      loadComments();
    } catch {
      toast.error('Error al procesar la reacción');
    }
  };


  const RenderComments = ({ comments, level = 0 }: { comments: CommentNode[], level?: number }) => (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment.id}>
          <CommentItem
            comment={comment}
            user={user}
            handleDeleteComment={handleDeleteComment}
            handleReaction={handleReaction}
            level={level}
            isReplying={replyingTo === comment.id}
            onReplyClick={() => setReplyingTo(comment.id ?? null)}
            onCancelReply={() => setReplyingTo(null)}
            onSubmitReply={(content) => handleSubmitReply(comment.id!, content)}
          />
          {comment.children.length > 0 && (
            <div className="ml-8">
              <RenderComments comments={comment.children} level={level + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );


  return (
    <div className="mt-10 space-y-4">
      <CommentInput
        newComment={newComment}
        setNewComment={setNewComment}
        loading={loading}
        handleSubmitComment={handleSubmitComment}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
      />
      <RenderComments comments={comments} />
    </div>
  );
};
