import React from 'react';
import { CommentWithDetails } from '@/models';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


export default function CommentInput({newComment, setNewComment, loading, handleSubmitComment, replyTo, setReplyTo,}: Readonly<{
  newComment: string,
  setNewComment: React.Dispatch<React.SetStateAction<string>>,
  loading: boolean,
  handleSubmitComment: () => void,
  replyTo: CommentWithDetails | null,
  setReplyTo: React.Dispatch<React.SetStateAction<CommentWithDetails | null>>,
}>) {

  return (
    <div className="space-y-2">
      <Textarea
        placeholder={replyTo ? `Respondiendo a ${replyTo.author?.profile.first_name} ${replyTo.author?.profile.last_name}...` : "Escribe un comentario..."}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <div className="flex justify-between items-center">
        {replyTo && <Button variant="ghost" onClick={() => setReplyTo(null)}>Cancelar respuesta</Button>}
        <Button onClick={handleSubmitComment} disabled={loading || !newComment.trim()}>
          {loading ? 'Publicando...' : 'Publicar comentario'}
        </Button>
      </div>
    </div>
  );
}
