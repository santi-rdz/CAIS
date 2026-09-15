import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HiOutlineEnvelope, HiOutlinePencil, HiOutlineUserPlus } from 'react-icons/hi2'
import { AREA_LABELS } from '@cais/shared/constants/users'
import Button from '@components/Button'
import Input from '@components/Input'
import ModalBody from '@components/ModalBody'
import ModalActions from '@components/ModalActions'
import RoleSelect from '@ui/RoleSelect'
import AreaSelect from '@ui/AreaSelect'
import DomainEmailInput from '@ui/DomainEmailInput'
import useEmailDomain from '@hooks/useEmailDomain'
import usePermissions from '@hooks/usePermissions'
import { buildInviteSchema } from '@schemas/invitations'
import useCreateInvitations from '@features/users/hooks/useCreateInvitations'
import useInviteList from '@features/users/hooks/useInviteList'
import InvitationsList from '@features/users/components/InvitationsList'

export default function InvitationalLinksForm({ onClose }) {
  const { createInvitations, isCreating } = useCreateInvitations()
  const { isUabcDomain, setIsUabcDomain, resolveEmail, correoField } = useEmailDomain()
  const { isAdmin, area: myArea } = usePermissions()

  const {
    users,
    role,
    setRole,
    area,
    setArea,
    idEdit,
    isEditMode,
    upsert,
    remove,
    startEdit,
    clear,
  } = useInviteList({ resolveEmail, setIsUabcDomain, initialArea: isAdmin ? '' : (myArea ?? '') })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: zodResolver(buildInviteSchema(correoField)) })

  function onSubmit({ email }) {
    if (upsert(email)) reset()
  }

  const needsArea = role !== 'admin'
  const addDisabled = needsArea && !area

  return (
    <>
      <ModalBody py={8}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DomainEmailInput
            id="invite-email"
            error={errors?.email?.message}
            register={register}
            isDomain={isUabcDomain}
            setIsDomain={setIsUabcDomain}
            required
          />
          <div className="flex flex-wrap gap-3">
            <div>
              <p className="text-5 mb-2">Rol</p>
              <RoleSelect role={role} setRole={setRole} allowAdmin={isAdmin} />
            </div>
            {needsArea && (
              <div>
                <p className="text-5 mb-2">Área</p>
                {isAdmin ? (
                  <AreaSelect value={area} onValueChange={setArea} className="w-40" />
                ) : (
                  <Input
                    value={AREA_LABELS[myArea] ?? '—'}
                    variant="muted"
                    size="md"
                    disabled
                    className="w-40"
                  />
                )}
              </div>
            )}
          </div>
          <Button
            type="submit"
            size="md"
            variant="outline"
            className="w-full border border-gray-300"
            data-testid="add-to-list-btn"
            disabled={addDisabled}
          >
            {isEditMode ? (
              <>
                <HiOutlinePencil /> Guardar cambios
              </>
            ) : (
              <>
                <HiOutlineUserPlus size="18" /> Agregar usuario a la lista
              </>
            )}
          </Button>
        </form>

        <div className="mt-10">
          <InvitationsList
            users={users}
            idEdit={idEdit}
            onEdit={(user) => startEdit(user, setValue)}
            onDelete={remove}
          />
        </div>
      </ModalBody>

      <ModalActions
        variant="primary"
        onClose={onClose}
        primaryAction={{
          label: 'Enviar Correos',
          icon: <HiOutlineEnvelope size={20} />,
          onClick: () =>
            createInvitations(users, {
              onSuccess: () => {
                onClose()
                clear()
                reset()
              },
            }),
          disabled: users.length === 0 || isCreating,
          isLoading: isCreating,
        }}
      />
    </>
  )
}
