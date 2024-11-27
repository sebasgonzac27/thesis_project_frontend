import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Post, PostType, Tag, Comment, ReactionType, PostWithDetails, CommentWithDetails } from '@/models'
import { postService, tagService } from '@/services'
import { toast } from 'sonner'
import { truncateText, truncateHtml, getRandomColor, getTagColor } from './utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Check, ChevronsUpDown, Plus, X, Trash2 } from 'lucide-react'
import { Separator } from '@radix-ui/react-select'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useUserStore from '@/store/user'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import CommentBox from './CommentBox'
import TextEditor from './TextEditor'
import ImageUploader from './ImageUploader'
import axios from 'axios'
import DOMPurify from 'dompurify'

export default function PostList() {
  const [posts, setPosts] = useState<PostWithDetails[]>()
  const [filteredPosts, setFilteredPosts] = useState<PostWithDetails[]>()
  const [selectedPost, setSelectedPost] = useState<PostWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [selectedTagsToCreate, setSelectedTagsToCreate] = useState<Tag[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { user } = useUserStore()

  const [newPost, setNewPost] = useState<Partial<Post>>({
    title: '',
    content: '',
    thumbnail: '',
    tags: [],
    status: PostType.Unpublished,
    author_id: user?.id,
  })
  const [creating, setCreating] = useState(false)

  const [imageFile, setImageFile] = React.useState(null)

  const handleImageChange = async file => {
    setImageFile(file)
  }

  const [editorContent, setEditorContent] = useState('')

  const handleEditorChange = value => {
    setEditorContent(value)
  }

  const loadPosts = async () => {
    setLoading(true)
    try {
      const response = await postService.getPosts({
        sort: `created_at=desc`,
      })
      setPosts(response.data)
      setFilteredPosts(response.data)
    } catch (error) {
      toast.error('Error al cargar los posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const filterPosts = () => {
    if (!posts) return
    let filtered = [...posts]
    const searchTermLower = searchTerm.toLowerCase().trim()
    if (searchTermLower !== '') {
      filtered = filtered.filter(post => post.title.toLowerCase().includes(searchTermLower))
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.every(selectedTag => post.tags?.some(postTag => postTag.id === selectedTag.id)),
      )
    }
    setFilteredPosts(filtered)
  }

  useEffect(() => {
    filterPosts()
  }, [searchTerm, selectedTags, posts])

  const handleSearch = () => {
    filterPosts()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleCreatePost = async () => {
    newPost.content = editorContent
    if (!newPost.title?.trim() || !newPost.content?.trim()) {
      toast.error('Por favor completa los campos requeridos')
      return
    }

    setCreating(true)
    try {
      let thumbnail = undefined
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        const response = await axios.post('http://localhost:8000/upload', formData, {
          headers: { Accept: 'application/json' },
        })
        thumbnail = response.data.file_path
      }
      const { tags, thumbnail: oldThumbnail, ...postData } = newPost
      const postToCreate = {
        ...postData,
        tag_ids: selectedTagsToCreate?.map(tag => tag.id) || [],
        ...(thumbnail ? { thumbnail } : {}),
      }
      console.log(JSON.stringify(postToCreate))
      await postService.createPost(postToCreate)
      toast.success('Post creado exitosamente')
      setIsCreateDialogOpen(false)
      setNewPost({
        title: '',
        content: '',
        thumbnail: '',
        tags: [],
        status: PostType.Unpublished,
        author_id: user?.id,
      })
      setEditorContent('')
      loadPosts()
    } catch (error) {
      toast.error('Error al crear el post')
      console.error('Error creating post:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleDeletePost = async (postId: number) => {
    try {
      await postService.deletePost(postId)
      toast.success('Post eliminado exitosamente')
      loadPosts()
    } catch (error) {
      toast.error('Error al eliminar el post')
      console.error('Error deleting post:', error)
    }
  }

  const canDeletePost = (post: PostWithDetails) => {
    if (!user) return false
    const isAdmin = user.role_id === 1 || user.role_id === 2
    const isAuthor = post.author?.id === user.id
    return isAdmin || isAuthor
  }

  if (loading) {
    return <div className='flex items-center justify-center p-8'>Cargando...</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col md:flex-row gap-2 justify-between'>
        <div className='flex gap-2 flex-1'>
          <Input
            placeholder='Buscar posts por título...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            className='flex-1'
          />
          <Button onClick={handleSearch} variant='secondary'>
            <Search className='h-4 w-4 mr-2' />
            Buscar
          </Button>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Crear Post
        </Button>
      </div>

      <TagSelector selectedTags={selectedTags} onTagsChange={setSelectedTags} />

      {loading ? (
        <div>Cargando...</div>
      ) : filteredPosts?.length === 0 ? (
        <Card className='p-4'>
          <p className='text-center text-gray-500'>No se encontraron posts que coincidan con tu búsqueda</p>
        </Card>
      ) : (
        filteredPosts?.map(post => (
          <Card key={post.id} className='p-4 hover:shadow-lg transition-shadow'>
            <div className='flex gap-4 items-center justify-center'>
              <div className='flex-1 cursor-pointer' onClick={() => setSelectedPost(post)}>
                <div className='flex gap-4'>
                  <ImageOrFallback
                    src={`http://localhost:8000/${post.thumbnail ?? ''}`}
                    alt={post.title}
                    className='w-24 h-24 object-cover rounded'
                  />
                  <div className='flex-1'>
                    <h2 className='text-xl font-semibold mb-2'>{post.title}</h2>
                    <p
                      className='text-gray-600 mb-2'
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateHtml(post.content, 150)) }}
                    />
                    <div className='flex flex-wrap gap-2 mt-4'>
                      {post.tags?.map(tag => (
                        <Badge key={tag.id} className={`${getTagColor(tag.name)} cursor-default`} variant='secondary'>
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {canDeletePost(post) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='ghost' size='icon' onClick={e => e.stopPropagation()} className='shrink-0'>
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e: any) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente este post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeletePost(post.id ?? 0)}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </Card>
        ))
      )}

      <Dialog open={selectedPost !== null} onOpenChange={() => setSelectedPost(null)}>
        {selectedPost && (
          <DialogContent className='sm:max-w-2xl max-h-[90vh] p-0'>
            <ScrollArea className='h-full max-h-[90vh]'>
              <div className='p-6'>
                <div className='w-full'>
                  <ImageOrFallback
                    src={`http://localhost:8000/${selectedPost.thumbnail ?? ''}`}
                    alt={selectedPost.title}
                    className='w-full h-48 object-cover'
                    isHeader={true}
                  />
                </div>
                <DialogHeader>
                  <DialogTitle>{selectedPost.title}</DialogTitle>
                  <Separator />
                  <div className='flex flex-wrap gap-2'>
                    {selectedPost.tags?.map(tag => (
                      <Badge key={tag.id} className={`${getTagColor(tag.name)} cursor-default`} variant='secondary'>
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </DialogHeader>
                <div className='mt-4'>
                  <p
                    className='text-gray-600'
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.content) }}
                  />
                </div>
                <CommentBox postId={selectedPost.id!} />
              </div>
            </ScrollArea>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Crear nuevo post</DialogTitle>
          </DialogHeader>
          <ScrollArea className='max-h-[500px] overflow-y-auto px-0 py-0'>
            <div className='grid gap-4 py-4 px-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Título</Label>
                <Input
                  id='title'
                  placeholder='Ingresa el título del post'
                  value={newPost.title}
                  onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='content'>Contenido</Label>
                <TextEditor editorContent={editorContent} onEditorChange={handleEditorChange} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='thumbnail'>Imagen del encabezado</Label>
                <ImageUploader onImageChange={handleImageChange} />
              </div>
              <div className='space-y-2'>
                <Label>Estado</Label>
                <select
                  value={newPost.status}
                  onChange={e => setNewPost({ ...newPost, status: e.target.value as PostType })}
                  className='w-full border rounded-md p-2'>
                  <option value={PostType.Unpublished}>Borrador</option>
                  <option value={PostType.Published}>Publicado</option>
                </select>
              </div>
              <div className='space-y-2'>
                <Label>Etiquetas</Label>
                <TagSelector2 selectedTags={selectedTagsToCreate} onTagsChange={setSelectedTagsToCreate} />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreatePost} disabled={creating}>
              {creating ? 'Creando...' : 'Crear Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const ImageOrFallback = ({
  src,
  alt,
  className,
  isHeader = false,
}: {
  src?: string
  alt: string
  className?: string
  isHeader?: boolean
}) => {
  const [hasError, setHasError] = useState(false)
  const colorClass = React.useMemo(() => getRandomColor(), [])

  const containerClass = isHeader ? 'w-full mb-5' : ''

  if (!src || hasError) {
    return (
      <div className={`${className} ${colorClass} ${containerClass} flex items-center justify-center`} aria-label={alt}>
        <span className='text-2xl font-bold text-gray-600'>{alt.charAt(0).toUpperCase()}</span>
      </div>
    )
  }

  return (
    <div className={containerClass}>
      <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />
    </div>
  )
}

interface TagSelectorProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
}

export function TagSelector({ selectedTags, onTagsChange }: Readonly<TagSelectorProps>) {
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true)
        const response = await tagService.getTags()
        setTags(response.data)
      } catch (error) {
        toast.error('Error al cargar las etiquetas')
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  const handleSelect = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id)
    if (isSelected) {
      onTagsChange(selectedTags.filter(t => t.id !== tag.id))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  return (
    <div className=''>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' aria-expanded={open} className='justify-between' disabled={loading}>
            {loading ? 'Cargando...' : 'Seleccionar etiquetas'}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandInput placeholder='Buscar etiqueta...' />
            <CommandEmpty>No se encontraron etiquetas.</CommandEmpty>
            <CommandGroup>
              {tags.map(tag => (
                <CommandItem key={tag.id} onSelect={() => handleSelect(tag)}>
                  <Check
                    className={`mr-2 h-4 w-4 ${selectedTags.some(t => t.id === tag.id) ? 'opacity-100' : 'opacity-0'}`}
                  />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.map(tag => (
        <Badge key={tag.id} variant='secondary' className='cursor-pointer m-1' onClick={() => handleSelect(tag)}>
          {tag.name}
          <button
            className='ml-1 text-sm hover:text-destructive'
            onClick={e => {
              e.stopPropagation()
              handleSelect(tag)
            }}>
            ×
          </button>
        </Badge>
      ))}
    </div>
  )
}

export function TagSelector2({ selectedTags, onTagsChange }: Readonly<TagSelectorProps>) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true)
        const response = await tagService.getTags()
        setTags(response.data)
      } catch (error) {
        toast.error('Error al cargar las etiquetas')
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  const handleSelect = (tagId: string) => {
    const selectedTag = tags.find(t => String(t.id) === tagId)
    if (!selectedTag) return

    const isSelected = selectedTags.some(t => String(t.id) === tagId)
    if (isSelected) {
      onTagsChange(selectedTags.filter(t => String(t.id) !== tagId))
    } else {
      onTagsChange([...selectedTags, selectedTag])
    }
  }

  const removeTag = (tagToRemove: Tag) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagToRemove.id))
  }

  return (
    <div className='space-y-2'>
      <Select disabled={loading} onValueChange={handleSelect}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={loading ? 'Cargando...' : 'Seleccionar etiquetas'} />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className='h-72'>
            <SelectGroup>
              <SelectLabel>Etiquetas</SelectLabel>
              {tags.map(tag => (
                <SelectItem key={tag.id} value={String(tag.id)}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </ScrollArea>
        </SelectContent>
      </Select>

      <div className='flex flex-wrap gap-2'>
        {selectedTags.map(tag => (
          <Badge key={tag.id} variant='secondary' className='flex items-center gap-1 pr-1'>
            {tag.name}
            <button
              onClick={e => {
                e.preventDefault()
                removeTag(tag)
              }}
              className='hover:bg-secondary rounded-full p-0.5'>
              <X className='h-3 w-3' />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
