import { CommentWithDetails, ReactionType, Reaction } from '@/models';
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from 'lucide-react';


export default function ReactionButtons({comment, user, handleReaction}: Readonly<{
  comment: CommentWithDetails & { reactions?: Reaction[] };
  user: any;
  handleReaction: (commentId: number, type: ReactionType) => void;
}>) {

  console.log("reactions", comment.reactions);

  const userLike = comment.reactions?.find(
    (r) => r.author_id === user.id && r.type === ReactionType.Like
  );

  // Verificar si el usuario ha dado dislike
  const userDislike = comment.reactions?.find(
    (r) => r.author_id === user.id && r.type === ReactionType.Dislike
  );

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleReaction(comment.id!, ReactionType.Like)}
      >
        <ThumbsUp
          className="h-4 w-4 mr-1"
          color={userLike ? "green" : "currentColor"}
        />{" "}
        {comment.reactions?.filter((r) => r.type === ReactionType.Like).length}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleReaction(comment.id!, ReactionType.Dislike)}
      >
        <ThumbsDown
          className="h-4 w-4 mr-1"
          color={userDislike ? "red" : "currentColor"}
        />{" "}
        {comment.reactions?.filter((r) => r.type === ReactionType.Dislike).length}
      </Button>
    </div>
  )
}
