import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { Company, LocationType, Location } from '@/models'
import { companyService, getLocations } from '@/services'


const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  contact_name: z.string().min(1, "El nombre de contacto es requerido"),
  contact_telephone: z.string().min(1, "El teléfono es requerido"),
  contact_address: z.string().min(1, "La dirección es requerida"),
  department: z.string().min(1, 'El departamento es obligatorio'),
  city: z.string().min(1, 'La ciudad es obligatoria'),
})

interface CompanyModalProps {
  onCompanyCreated: () => void;
}

const CompanyModal = ({ onCompanyCreated }: CompanyModalProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact_name: "",
      contact_telephone: "",
      contact_address: "",
      department: "",
      city: "",
    },
    mode: 'all',
  })

  const { handleSubmit, control, formState } = form
  const { errors, isSubmitting } = formState

  const [departments, setDepartments] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false)


  useEffect(() => {
    const fetchDepartments = async () => {
      const { data: locations } = await getLocations(); // Extraer `data` de la respuesta
      const departments = locations.filter(loc => loc.type === LocationType.Department);
      setDepartments(departments);
    };
    fetchDepartments();
  }, []);


  const handleDepartmentChange = async (value: string) => {
    const departmentId = Number(value);
    setSelectedDepartment(departmentId);

    const { data: allLocations } = await getLocations({
      filter: `department_id=${departmentId}`,
      skip: 0,
      limit: 500,
      sort: 'name',
    });
    const filteredCities = allLocations.filter(loc => loc.type === LocationType.City);
  setCities(filteredCities);
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { city, name, contact_name, contact_telephone, contact_address } = values

      const company: Partial<Company> = {
        name: name,
        contact_name: contact_name,
        contact_telephone: contact_telephone,
        contact_address: contact_address,
        location_id: Number(city),
      }
      await companyService.createCompany(company)
      toast.success('Empresa registrada exitosamente')
      form.reset()
      onCompanyCreated()
      setIsOpen(false)
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al registrar la empresa')
    }
  }


  return (
    <>
    <Button onClick={() => setIsOpen(true)}>
      Registrar Empresa
    </Button>

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger />
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Empresa</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Llena el formulario para registrar una nueva empresa.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <FormMessage>{errors.root?.message}</FormMessage>

              <div className="grid grid-cols-1">

                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Nombre de la empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el nombre de la empresa" {...field} />
                      </FormControl>
                      <FormMessage>{errors.name?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Nombre de la persona de contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el nombre de la persona de contacto" {...field} />
                      </FormControl>
                      <FormMessage>{errors.contact_name?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="contact_telephone"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Teléfono de la persona de contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el teléfono de la persona de contacto" {...field} />
                      </FormControl>
                      <FormMessage>{errors.contact_telephone?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="contact_address"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Dirección de las oficinas centrales</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese la dirección de la empresa" {...field} />
                      </FormControl>
                      <FormMessage>{errors.contact_address?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Departamento</FormLabel>
                      <FormControl>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          handleDepartmentChange(value);
                        }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un departamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map(department => (
                              <SelectItem value={String(department.id)} key={department.id}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.department?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una ciudad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map(city => (
                              <SelectItem value={String(city.id)} key={city.id}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.city?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <Button className="mt-4 w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Registrar Empresa'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CompanyModal;
