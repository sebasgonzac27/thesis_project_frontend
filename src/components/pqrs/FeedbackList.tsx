import { useState, useEffect } from 'react'
import { FeedbackWithDetails, FeedbackStatus, FeedbackTypeColors, FeedbackStatusColors } from '@/models'
import { getFeedbacks } from '@/services/pqrs'
import { getUser } from '@/services'
import useUserStore from '@/store/user'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'

interface FeedbackListProps {
  onCreateNew: () => void
  onSelectFeedback: (feedback: FeedbackWithDetails) => void
}

export function FeedbackList({ onCreateNew, onSelectFeedback }: Readonly<FeedbackListProps>) {
  const [allFeedbacks, setAllFeedbacks] = useState<FeedbackWithDetails[]>([])
  const [displayedFeedbacks, setDisplayedFeedbacks] = useState<FeedbackWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus | 'all'>('all')
  const { user } = useUserStore()

  const loadFeedbacks = async () => {
    setLoading(true)
    try {
      const params = user?.role_id !== 1 ? { filter: `author_id=${user?.id}` } : {}
      const response = await getFeedbacks(params)
      const data = response.data

      const feedbackWithDetails = await Promise.all(
        data.map(async feedback => {
          const author = await getUser(feedback.author_id)
          const { author_id, ...rest } = feedback
          return { ...rest, author }
        }),
      )
      // Ordenar por fecha de creación (más reciente primero)
      const sortedFeedbacks = [...feedbackWithDetails].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      setAllFeedbacks(sortedFeedbacks)
      updateDisplayedFeedbacks(sortedFeedbacks, selectedStatus)
    } catch (error) {
      console.error('Error loading feedbacks:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateDisplayedFeedbacks = (feedbacks: FeedbackWithDetails[], status: FeedbackStatus | 'all') => {
    if (status === 'all') {
      setDisplayedFeedbacks(feedbacks)
    } else {
      setDisplayedFeedbacks(feedbacks.filter(f => f.status === status))
    }
  }

  useEffect(() => {
    loadFeedbacks()
  }, [user])

  useEffect(() => {
    updateDisplayedFeedbacks(allFeedbacks, selectedStatus)
  }, [selectedStatus])

  const getStatusCount = (status: FeedbackStatus | 'all') => {
    if (status === 'all') return allFeedbacks.length
    return allFeedbacks.filter(f => f.status === status).length
  }

  if (loading) {
    return <div className='flex items-center justify-center p-8'>Cargando...</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col md:flex-row md:justify-between items-center gap-y-4'>
        <div className='flex flex-wrap gap-2 justify-center md:justify-start'>
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('all')}
            className='relative'>
            Todos
            <Badge variant='secondary' className='ml-2 bg-background text-foreground'>
              {getStatusCount('all')}
            </Badge>
          </Button>
          <Button
            variant={selectedStatus === FeedbackStatus.PENDING ? 'default' : 'outline'}
            onClick={() => setSelectedStatus(FeedbackStatus.PENDING)}
            className={`relative ${FeedbackStatusColors[FeedbackStatus.PENDING].bg} ${FeedbackStatusColors[FeedbackStatus.PENDING].text}`}>
            Pendientes
            <Badge variant='secondary' className='ml-2 bg-background text-foreground'>
              {getStatusCount(FeedbackStatus.PENDING)}
            </Badge>
          </Button>
          <Button
            variant={selectedStatus === FeedbackStatus.UNDER_REVIEW ? 'default' : 'outline'}
            onClick={() => setSelectedStatus(FeedbackStatus.UNDER_REVIEW)}
            className={`relative ${FeedbackStatusColors[FeedbackStatus.UNDER_REVIEW].bg} ${FeedbackStatusColors[FeedbackStatus.UNDER_REVIEW].text}`}>
            En Revisión
            <Badge variant='secondary' className='ml-2 bg-background text-foreground'>
              {getStatusCount(FeedbackStatus.UNDER_REVIEW)}
            </Badge>
          </Button>
          <Button
            variant={selectedStatus === FeedbackStatus.RESOLVED ? 'default' : 'outline'}
            onClick={() => setSelectedStatus(FeedbackStatus.RESOLVED)}
            className={`relative ${FeedbackStatusColors[FeedbackStatus.RESOLVED].bg} ${FeedbackStatusColors[FeedbackStatus.RESOLVED].text}`}>
            Resueltos
            <Badge variant='secondary' className='ml-2 bg-background text-foreground'>
              {getStatusCount(FeedbackStatus.RESOLVED)}
            </Badge>
          </Button>
        </div>
        <Button onClick={onCreateNew} className='flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0'>
          <Plus className='w-4 h-4' />
          Nuevo PQR
        </Button>
      </div>

      <div className='grid gap-4'>
        {displayedFeedbacks.length === 0 ? (
          <Card className='p-4 mt-4'>
            <p className='text-center text-gray-500'>No hay nada que mostrar aquí</p>
          </Card>
        ) : (
          displayedFeedbacks.map(feedback => (
            <Card
              key={feedback.id}
              className='hover:bg-accent cursor-pointer'
              onClick={() => onSelectFeedback(feedback)}>
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-lg'>{feedback.title}</CardTitle>
                  <div className='flex gap-2'>
                    <Badge
                      className={`${FeedbackTypeColors[feedback.type].bg} ${FeedbackTypeColors[feedback.type].text}`}>
                      {feedback.type}
                    </Badge>
                    <Badge
                      className={`${FeedbackStatusColors[feedback.status].bg} ${FeedbackStatusColors[feedback.status].text}`}>
                      {feedback.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-600 line-clamp-2'>{feedback.content}</p>
                <p className='text-xs text-gray-400 mt-2'>
                  Creado el {format(new Date(feedback.created_at), 'dd/MM/yyyy HH:mm')}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
