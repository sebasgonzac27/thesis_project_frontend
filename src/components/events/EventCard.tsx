import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Check, Book, Star, StarHalf } from 'lucide-react'
import { eventTypeColors, EventWithDetails, Review, UserRole } from '@/models'
import { formatDate } from './utils'
import { EventDescription } from './EventDescription'
import {
  createParticipation,
  deleteParticipation,
  getParticipation,
  getReview,
  getEventReviews,
  getUser,
} from '@/services'
import useUserStore from '@/store/user'
import { toast } from 'sonner'
import ReviewModal from './ReviewModal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAppStore } from '@/store/app'

interface EventCardProps {
  event: EventWithDetails
  onDelete: (id: number) => void
  onParticipationChange?: (eventId: number, isParticipating: boolean) => void
  view: 'any' | 'historico'
}

export function EventCard({ event, onDelete, onParticipationChange, view }: Readonly<EventCardProps>) {
  const { user } = useUserStore()
  const { role_selected } = useAppStore()
  const [isParticipating, setIsParticipating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isReviewsDialogOpen, setIsReviewsDialogOpen] = useState(false)
  const [reviews, setReviews] = useState([])

  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  const isEventFinished = endDate < new Date()

  const checkExistingReview = async () => {
    if (!user?.id || !event.id) return
    try {
      const review = await getReview(event.id, user.id)
      setHasReviewed(!!review)
    } catch (error) {
      setHasReviewed(false)
    }
  }

  const fetchReviews = async () => {
    if (!event.id) return
    try {
      const response = await getEventReviews(event.id)
      const myReviews = await Promise.all(
        response.map(async review => {
          const author = await getUser(review.author_id)
          const { author_id, ...rest } = review
          return { ...rest, author }
        }),
      )
      setReviews(myReviews)
    } catch (error) {
      toast.error('Error al cargar las reseñas')
    }
  }

  const checkParticipation = async () => {
    if (user?.id && event.id) {
      setIsLoading(true)
      try {
        const response = await getParticipation(event.id, user.id)
        const newParticipationState = !!response
        setIsParticipating(newParticipationState)
        if (onParticipationChange) {
          onParticipationChange(event.id, newParticipationState)
        }
      } catch (error) {
        setIsParticipating(false)
        if (onParticipationChange) {
          onParticipationChange(event.id, false)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (view === 'historico' && isParticipating) {
      checkExistingReview()
    }
  }, [event.id, user?.id, view, isParticipating])

  useEffect(() => {
    checkParticipation()
  }, [event.id, user?.id])

  const handleReviewSubmitted = () => {
    checkExistingReview()
  }

  const handleParticipation = async () => {
    if (!user?.id || !event.id) return

    setIsLoading(true)
    try {
      if (isParticipating) {
        await deleteParticipation(event.id, user.id)
        setIsParticipating(false)
        if (onParticipationChange) {
          onParticipationChange(event.id, false)
        }
        toast.success('Participación cancelada')
      } else {
        await createParticipation(event.id, user.id)
        setIsParticipating(true)
        if (onParticipationChange) {
          onParticipationChange(event.id, true)
        }
        toast.success('Participación confirmada')
      }
    } catch (error) {
      toast.error('Error al procesar la participación')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenReviews = () => {
    fetchReviews()
    setIsReviewsDialogOpen(true)
  }

  return (
    <Card className='p-4'>
      <div className='grid gap-2'>
        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-red-500'>{event.name}</h3>
          </div>
          <div className='flex items-center gap-2'>
            <span
              className={`text-sm font-medium px-2 py-1 rounded ${
                eventTypeColors[event.type]?.bg || 'bg-gray-100'
              } ${eventTypeColors[event.type]?.text || 'text-gray-800'}`}>
              {event.type}
            </span>
            {[UserRole.ADMIN, UserRole.LEADER].includes(role_selected!) && (
              <Button variant='destructive' size='sm' onClick={() => event.id && onDelete(event.id)} className='ml-2'>
                <Trash2 className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
        <div className='text-sm text-gray-600'>
          <div className='flex items-center gap-2 mt-3'>
            <span className='font-bold'>Horario:</span>
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-bold'>Punto de encuentro:</span>
            <p className='mt-2 pl-3'>{event.meeting_point}</p>
          </div>
          <div>
            <span className='font-bold'>Ubicación:</span>
            <p className='mt-2 pl-3'>{event.location?.name}</p>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-bold'>Organizador:</span>
            <p className='mt-2 pl-3'>
              {event.organizer?.profile.first_name} {event.organizer?.profile.last_name}
            </p>
          </div>
          <div>
            <span className='font-bold'>Equipo:</span>
            <p className='mt-2 pl-3'>{event.team?.name}</p>
          </div>
        </div>
        <EventDescription description={event.description} />

        <div className='mt-4'>
          {view === 'historico' && isParticipating ? (
            <>
              {!hasReviewed ? (
                <>
                  <Button
                    variant='secondary'
                    className='w-full bg-blue-500 hover:bg-blue-600'
                    onClick={() => setIsReviewModalOpen(true)}>
                    Añadir Reseña
                  </Button>
                  <ReviewModal
                    eventId={event.id ?? 0}
                    userId={user?.id ?? 0}
                    isOpen={isReviewModalOpen}
                    onOpenChange={setIsReviewModalOpen}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </>
              ) : (
                <div className='text-center text-sm text-gray-500'>Ya has enviado una reseña para este evento</div>
              )}
            </>
          ) : view === 'any' ? (
            <>
              <Button
                variant={isParticipating ? 'default' : 'secondary'}
                className={`w-full ${isParticipating ? 'bg-green-500 hover:bg-green-600' : ''}`}
                onClick={handleParticipation}
                disabled={isLoading}>
                {isParticipating ? (
                  <>
                    <Check className='mr-2 h-4 w-4' />
                    Asistiré
                  </>
                ) : (
                  'Confirmar Asistencia'
                )}
              </Button>
              {isEventFinished && (
                <Button variant='outline' className='w-full' onClick={handleOpenReviews}>
                  <Book className='mr-2 h-4 w-4' />
                  Ver reseñas
                </Button>
              )}
            </>
          ) : (
            ''
          )}
        </div>
      </div>

      <Dialog open={isReviewsDialogOpen} onOpenChange={setIsReviewsDialogOpen}>
        <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Reseñas del evento</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            {reviews.length === 0 ? (
              <p className='text-center text-gray-500'>No hay reseñas disponibles para este evento.</p>
            ) : (
              reviews.map((review: any) => (
                <div key={review.id} className='border rounded-lg p-4'>
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <p className='font-semibold'>
                        {review.author.profile.first_name} {review.author.profile.last_name}
                      </p>
                      <p className='text-sm text-gray-500'>{formatDate(new Date(review.created_at))}</p>
                      <div className='flex items-center mt-1'>
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className='text-gray-700'>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
