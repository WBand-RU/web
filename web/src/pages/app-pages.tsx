import * as React from "react";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  CrownIcon,
  Disc3Icon,
  LogOutIcon,
  LoaderCircleIcon,
  MailPlusIcon,
  MusicIcon,
  PencilLineIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useBands } from "@/components/providers/bands-provider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  acceptInviteInvitesTokenAcceptPost,
  createInviteBandsBandIdInvitesPost,
  declineInviteInvitesTokenDeclinePost,
  inviteStatusInvitesTokenStatusGet,
  leaveBandBandsBandIdLeavePost,
  listInvitesBandsBandIdInvitesGet,
  listMembersBandsBandIdMembersGet,
  listMyInvitesMeInvitesGet,
  removeMemberBandsBandIdMembersMemberUserIdDelete,
  resendInviteBandsBandIdInvitesInviteIdResendPost,
  revokeInviteBandsBandIdInvitesInviteIdRevokePost,
  transferOwnershipBandsBandIdTransferOwnershipPost,
  updateMemberRoleBandsBandIdMembersMemberUserIdRolePut,
} from "@/lib/api/generated/bands-service";
import {
  InviteStatus,
  Role,
  type InviteOut,
  type MemberOut,
  type MyInviteOut,
} from "@/lib/api/generated/model";
import {
  formatDateTime,
  formatInviteStatus,
  formatRole,
  getErrorMessage,
} from "@/lib/bands";
import {
  calendarEvents,
  dashboardStats,
  getSongById,
  setlists,
  songs,
} from "@/lib/mock-data";

function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/70 p-5 md:flex-row md:items-end md:justify-between md:p-6">
      <div className="space-y-2">
        <Badge variant="outline">{eyebrow}</Badge>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
      </div>
      {action ? (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      ) : null}
    </section>
  );
}

function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="border-border/60 bg-card/80">
          <CardHeader className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="grid gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function StateCard({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action ? <CardFooter>{action}</CardFooter> : null}
    </Card>
  );
}

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageIntro
        eyebrow="Обзор"
        title="Рабочее пространство бенда"
        description="Быстрый доступ к состоянию репертуара, ближайшим выступлениям и задачам подготовки."
        action={
          <Link
            to="/songs"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            Открыть репертуар
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="border-border/60 bg-card/80">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl tracking-tight">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {stat.note}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Ближайшие сетлисты</CardTitle>
            <CardDescription>
              Основные программы, которые готовятся к сцене.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {setlists.map((setlist) => (
              <div
                key={setlist.id}
                className="rounded-xl border border-border/60 bg-background/70 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="font-medium">{setlist.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {setlist.band}
                    </div>
                  </div>
                  <Badge variant="secondary">{setlist.duration}</Badge>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {setlist.event}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {setlist.songs.map((song) => (
                    <Badge key={song} variant="outline">
                      {song}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Ближайшие события</CardTitle>
            <CardDescription>
              Календарь на ближайшие даты для всех составов.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {calendarEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-border/60 bg-background/70 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{event.title}</div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {event.band}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDaysIcon className="size-4" />
                  {event.when}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3Icon className="size-4" />
                  {event.location}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export function BandsPage() {
  const {
    bands,
    bandsError,
    bandsLoading,
    createBand,
    deleteBand,
    refreshBands,
    renameBand,
    selectedBandDetails,
    selectedBandError,
    selectedBandId,
    selectBand,
  } = useBands();
  const [newBandName, setNewBandName] = React.useState("");
  const [creatingBand, setCreatingBand] = React.useState(false);
  const [mutatingBandId, setMutatingBandId] = React.useState<string | null>(
    null,
  );

  async function handleCreateBand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = newBandName.trim();

    if (!normalizedName) {
      return;
    }

    setCreatingBand(true);

    try {
      await createBand(normalizedName);
      setNewBandName("");
    } finally {
      setCreatingBand(false);
    }
  }

  async function handleRenameBand(bandId: string, currentName: string) {
    const nextName = window.prompt("Новое имя бенда", currentName)?.trim();

    if (!nextName || nextName === currentName) {
      return;
    }

    setMutatingBandId(bandId);

    try {
      await renameBand(bandId, nextName);
    } finally {
      setMutatingBandId(null);
    }
  }

  async function handleDeleteBand(bandId: string, bandName: string) {
    const confirmed = window.confirm(`Удалить бенд «${bandName}»?`);

    if (!confirmed) {
      return;
    }

    setMutatingBandId(bandId);

    try {
      await deleteBand(bandId);
    } finally {
      setMutatingBandId(null);
    }
  }

  async function handleLeaveBand(bandId: string, bandName: string) {
    const confirmed = window.confirm(
      `Покинуть бенд «${bandName}»? Вы потеряете доступ к нему.`,
    );

    if (!confirmed) {
      return;
    }

    setMutatingBandId(bandId);

    try {
      await leaveBandBandsBandIdLeavePost(bandId);
      await refreshBands();
    } finally {
      setMutatingBandId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageIntro
        eyebrow="Управление"
        title="Бенды"
        description="Реальный список бендов из Bands Service с ролями, выбором активного бенда и управлением составами."
        action={
          <form
            className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"
            onSubmit={handleCreateBand}
          >
            <Input
              value={newBandName}
              onChange={(event) => setNewBandName(event.target.value)}
              placeholder="Название бенда"
            />
            <Button
              type="submit"
              size="sm"
              disabled={creatingBand || !newBandName.trim()}
            >
              {creatingBand ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : null}
              Создать бенд
            </Button>
          </form>
        }
      />

      {selectedBandDetails ? (
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>{selectedBandDetails.name}</CardTitle>
            <CardDescription>
              Детали активного бенда через `GET /bands/{"{band_id}"}`.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">Активный бенд</Badge>
            <Badge variant="outline">
              {formatRole(selectedBandDetails.role)}
            </Badge>
          </CardContent>
        </Card>
      ) : null}

      {bandsError ? (
        <StateCard
          title="Не удалось загрузить бенды"
          description={bandsError}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refreshBands()}
            >
              Повторить
            </Button>
          }
        />
      ) : null}

      {selectedBandError ? (
        <StateCard
          title="Не удалось загрузить активный бенд"
          description={selectedBandError}
        />
      ) : null}

      {bandsLoading && bands.length === 0 ? <LoadingCards /> : null}

      {!bandsLoading && bands.length === 0 ? (
        <StateCard
          title="Бендов пока нет"
          description="Создайте первый бенд — после этого он появится в sidebar и станет активным."
        />
      ) : null}

      {bands.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {bands.map((band) => {
            const isSelected = band.id === selectedBandId;
            const isMutating = mutatingBandId === band.id;

            return (
              <Card key={band.id} className="border-border/60 bg-card/80">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{band.name}</CardTitle>
                      <CardDescription>
                        {isSelected ? "Активный бенд" : "Доступный бенд"}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      {isSelected ? (
                        <Badge variant="secondary">Выбран</Badge>
                      ) : null}
                      <Badge variant="outline">{formatRole(band.role)}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="size-4" />
                    Роль в бенде: {formatRole(band.role)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Disc3Icon className="size-4" />
                    Идентификатор: {band.id}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={isSelected ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => selectBand(band.id)}
                    >
                      Выбрать
                    </Button>
                    <Link
                      to="/members"
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                      onClick={() => selectBand(band.id)}
                    >
                      Участники
                    </Link>
                    {band.role !== Role.member ? (
                      <Link
                        to="/invitations"
                        className={buttonVariants({
                          variant: "ghost",
                          size: "sm",
                        })}
                        onClick={() => selectBand(band.id)}
                      >
                        Приглашения
                      </Link>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {band.role === Role.owner ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isMutating}
                          onClick={() =>
                            void handleRenameBand(band.id, band.name)
                          }
                        >
                          <PencilLineIcon />
                          Переименовать
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isMutating}
                          onClick={() =>
                            void handleDeleteBand(band.id, band.name)
                          }
                        >
                          {isMutating ? (
                            <LoaderCircleIcon className="animate-spin" />
                          ) : (
                            <Trash2Icon />
                          )}
                          Удалить
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isMutating}
                        onClick={() => void handleLeaveBand(band.id, band.name)}
                      >
                        {isMutating ? (
                          <LoaderCircleIcon className="animate-spin" />
                        ) : (
                          <LogOutIcon />
                        )}
                        Покинуть
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}

export function MembersPage() {
  const {
    refreshBands,
    selectedBandDetails,
    selectedBandError,
    selectedBandId,
  } = useBands();
  const [members, setMembers] = React.useState<MemberOut[]>([]);
  const [membersLoading, setMembersLoading] = React.useState(false);
  const [membersError, setMembersError] = React.useState<string | null>(null);
  const [mutatingMemberId, setMutatingMemberId] = React.useState<string | null>(
    null,
  );

  const canManageMembers =
    selectedBandDetails?.role === Role.owner ||
    selectedBandDetails?.role === Role.admin;
  const canTransferOwnership = selectedBandDetails?.role === Role.owner;

  const loadMembers = React.useCallback(async () => {
    if (!selectedBandId) {
      setMembers([]);
      setMembersError(null);
      setMembersLoading(false);
      return;
    }

    setMembersLoading(true);

    try {
      const response = await listMembersBandsBandIdMembersGet(selectedBandId, {
        limit: 500,
        offset: 0,
      });

      setMembers(response);
      setMembersError(null);
    } catch (error) {
      setMembersError(getErrorMessage(error));
    } finally {
      setMembersLoading(false);
    }
  }, [selectedBandId]);

  React.useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  async function handleRoleChange(member: MemberOut, role: Role) {
    if (!selectedBandId || member.role === role) {
      return;
    }

    setMutatingMemberId(member.user_id);

    try {
      const response =
        await updateMemberRoleBandsBandIdMembersMemberUserIdRolePut(
          selectedBandId,
          member.user_id,
          { role },
        );

      setMembers((current) =>
        current.map((currentMember) =>
          currentMember.user_id === member.user_id ? response : currentMember,
        ),
      );
    } catch (error) {
      setMembersError(getErrorMessage(error));
    } finally {
      setMutatingMemberId(null);
    }
  }

  async function handleRemoveMember(member: MemberOut) {
    if (!selectedBandId) {
      return;
    }

    const confirmed = window.confirm(
      `Удалить участника ${member.name ?? member.email ?? member.user_id}?`,
    );

    if (!confirmed) {
      return;
    }

    setMutatingMemberId(member.user_id);

    try {
      await removeMemberBandsBandIdMembersMemberUserIdDelete(
        selectedBandId,
        member.user_id,
      );
      setMembers((current) =>
        current.filter(
          (currentMember) => currentMember.user_id !== member.user_id,
        ),
      );
      await refreshBands();
    } catch (error) {
      setMembersError(getErrorMessage(error));
    } finally {
      setMutatingMemberId(null);
    }
  }

  async function handleTransferOwnership(member: MemberOut) {
    if (!selectedBandId) {
      return;
    }

    const confirmed = window.confirm(
      `Передать владение бендом пользователю ${member.name ?? member.email ?? member.user_id}?`,
    );

    if (!confirmed) {
      return;
    }

    setMutatingMemberId(member.user_id);

    try {
      await transferOwnershipBandsBandIdTransferOwnershipPost(selectedBandId, {
        new_owner_user_id: member.user_id,
      });
      await Promise.all([loadMembers(), refreshBands()]);
    } catch (error) {
      setMembersError(getErrorMessage(error));
    } finally {
      setMutatingMemberId(null);
    }
  }

  const [leavingBand, setLeavingBand] = React.useState(false);

  async function handleLeaveBand() {
    if (!selectedBandId || !selectedBandDetails) {
      return;
    }

    const confirmed = window.confirm(
      `Покинуть бенд «${selectedBandDetails.name}»? Вы потеряете доступ к нему.`,
    );

    if (!confirmed) {
      return;
    }

    setLeavingBand(true);

    try {
      await leaveBandBandsBandIdLeavePost(selectedBandId);
      await refreshBands();
    } catch (error) {
      setMembersError(getErrorMessage(error));
    } finally {
      setLeavingBand(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageIntro
        eyebrow="Управление"
        title="Участники"
        description={
          selectedBandDetails
            ? `Участники выбранного бенда «${selectedBandDetails.name}».`
            : "Выберите бенд, чтобы загрузить его состав."
        }
        action={
          selectedBandId ? (
            <>
              {canManageMembers ? (
                <Link
                  to="/invitations"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Приглашения
                </Link>
              ) : null}
              {selectedBandDetails?.role !== Role.owner ? (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={leavingBand}
                  onClick={() => void handleLeaveBand()}
                >
                  {leavingBand ? (
                    <LoaderCircleIcon className="animate-spin" />
                  ) : (
                    <LogOutIcon />
                  )}
                  Покинуть бенд
                </Button>
              ) : null}
            </>
          ) : null
        }
      />

      {selectedBandDetails ? (
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>{selectedBandDetails.name}</CardTitle>
            <CardDescription>
              Ваша роль: {formatRole(selectedBandDetails.role)}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {selectedBandError ? (
        <StateCard
          title="Не удалось загрузить активный бенд"
          description={selectedBandError}
        />
      ) : null}

      {!selectedBandId ? (
        <StateCard
          title="Нет выбранного бенда"
          description="Откройте раздел «Бенды» или выберите бенд в sidebar."
          action={
            <Link
              to="/bands"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              К бендам
            </Link>
          }
        />
      ) : null}

      {membersError ? (
        <StateCard
          title="Не удалось загрузить участников"
          description={membersError}
        />
      ) : null}

      {membersLoading ? <LoadingCards count={2} /> : null}

      {!membersLoading && selectedBandId && members.length === 0 ? (
        <StateCard
          title="Состав пока пуст"
          description="Добавьте участников через приглашения — отдельного создания участников API пока не даёт."
        />
      ) : null}

      {!membersLoading && members.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {members.map((member) => {
            const isMutating = mutatingMemberId === member.user_id;
            const isOwner = member.role === Role.owner;
            const canEditRole = canManageMembers && !isOwner;

            return (
              <Card key={member.id} className="border-border/60 bg-card/80">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>
                        {member.name ?? member.email ?? member.user_id}
                      </CardTitle>
                      <CardDescription>
                        {member.email ?? member.user_id}
                      </CardDescription>
                    </div>
                    <Badge variant={isOwner ? "secondary" : "outline"}>
                      {formatRole(member.role)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm text-muted-foreground">
                  <div>Добавлен: {formatDateTime(member.created_at)}</div>

                  <div className="grid gap-2">
                    <span className="font-medium text-foreground">Роль</span>
                    {canEditRole ? (
                      <select
                        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                        value={member.role}
                        disabled={isMutating}
                        onChange={(event) =>
                          void handleRoleChange(
                            member,
                            event.target.value as Role,
                          )
                        }
                      >
                        <option value={Role.admin}>admin</option>
                        <option value={Role.member}>member</option>
                      </select>
                    ) : (
                      <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-foreground">
                        {formatRole(member.role)}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  {canTransferOwnership && !isOwner ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isMutating}
                      onClick={() => void handleTransferOwnership(member)}
                    >
                      <CrownIcon />
                      Передать ownership
                    </Button>
                  ) : null}
                  {canManageMembers && !isOwner ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isMutating}
                      onClick={() => void handleRemoveMember(member)}
                    >
                      {isMutating ? (
                        <LoaderCircleIcon className="animate-spin" />
                      ) : (
                        <Trash2Icon />
                      )}
                      Удалить
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}

export function InvitationsPage() {
  const { selectedBandDetails, selectedBandError, selectedBandId } = useBands();
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | InviteStatus>(
    "all",
  );
  const [invites, setInvites] = React.useState<InviteOut[]>([]);
  const [invitesLoading, setInvitesLoading] = React.useState(false);
  const [invitesError, setInvitesError] = React.useState<string | null>(null);
  const [creatingInvite, setCreatingInvite] = React.useState(false);
  const [mutatingInviteId, setMutatingInviteId] = React.useState<string | null>(
    null,
  );
  const [tokenValue, setTokenValue] = React.useState("");
  const [tokenInvite, setTokenInvite] = React.useState<InviteOut | null>(null);
  const [tokenActionLoading, setTokenActionLoading] = React.useState(false);
  const [tokenActionMessage, setTokenActionMessage] = React.useState<
    string | null
  >(null);
  const [tokenActionError, setTokenActionError] = React.useState<string | null>(
    null,
  );

  const loadInvites = React.useCallback(async () => {
    if (!selectedBandId) {
      setInvites([]);
      setInvitesError(null);
      setInvitesLoading(false);
      return;
    }

    setInvitesLoading(true);

    try {
      const response = await listInvitesBandsBandIdInvitesGet(selectedBandId, {
        limit: 500,
        offset: 0,
        status_filter: statusFilter === "all" ? undefined : statusFilter,
      });

      setInvites(response);
      setInvitesError(null);
    } catch (error) {
      setInvitesError(getErrorMessage(error));
    } finally {
      setInvitesLoading(false);
    }
  }, [selectedBandId, statusFilter]);

  React.useEffect(() => {
    void loadInvites();
  }, [loadInvites]);

  async function handleCreateInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedBandId || !inviteEmail.trim()) {
      return;
    }

    setCreatingInvite(true);

    try {
      const response = await createInviteBandsBandIdInvitesPost(
        selectedBandId,
        {
          email: inviteEmail.trim(),
        },
      );
      setInviteEmail("");
      setInvites((current) => [response, ...current]);
      setInvitesError(null);
    } catch (error) {
      setInvitesError(getErrorMessage(error));
    } finally {
      setCreatingInvite(false);
    }
  }

  async function handleInviteAction(
    inviteId: string,
    action: "revoke" | "resend",
  ) {
    if (!selectedBandId) {
      return;
    }

    setMutatingInviteId(inviteId);

    try {
      if (action === "revoke") {
        await revokeInviteBandsBandIdInvitesInviteIdRevokePost(
          selectedBandId,
          inviteId,
        );
      } else {
        await resendInviteBandsBandIdInvitesInviteIdResendPost(
          selectedBandId,
          inviteId,
        );
      }

      await loadInvites();
    } catch (error) {
      setInvitesError(getErrorMessage(error));
    } finally {
      setMutatingInviteId(null);
    }
  }

  async function handleTokenAction(action: "status" | "accept" | "decline") {
    const token = tokenValue.trim();

    if (!token) {
      return;
    }

    setTokenActionLoading(true);
    setTokenActionError(null);
    setTokenActionMessage(null);

    try {
      if (action === "status") {
        const response = await inviteStatusInvitesTokenStatusGet(token);
        setTokenInvite(response);
        return;
      }

      if (action === "accept") {
        const response = await acceptInviteInvitesTokenAcceptPost(token);
        setTokenActionMessage(response.message);
      } else {
        const response = await declineInviteInvitesTokenDeclinePost(token);
        setTokenActionMessage(response.message);
      }

      const invite = await inviteStatusInvitesTokenStatusGet(token);
      setTokenInvite(invite);
      await loadInvites();
    } catch (error) {
      setTokenActionError(getErrorMessage(error));
    } finally {
      setTokenActionLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageIntro
        eyebrow="Управление"
        title="Приглашения"
        description={
          selectedBandDetails
            ? `Исходящие приглашения для бенда «${selectedBandDetails.name}».`
            : "Выберите бенд, чтобы загрузить его приглашения."
        }
        action={
          <form
            className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"
            onSubmit={handleCreateInvite}
          >
            <Input
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              placeholder="email@example.com"
              type="email"
            />
            <Button
              type="submit"
              size="sm"
              disabled={
                !selectedBandId || creatingInvite || !inviteEmail.trim()
              }
            >
              {creatingInvite ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                <MailPlusIcon />
              )}
              Новое приглашение
            </Button>
          </form>
        }
      />

      {selectedBandDetails ? (
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>{selectedBandDetails.name}</CardTitle>
            <CardDescription>
              Ваша роль: {formatRole(selectedBandDetails.role)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
              Можно фильтровать список и выполнять `revoke` / `resend`, а также
              проверять статус токена.
            </div>
            <select
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | InviteStatus)
              }
            >
              <option value="all">all</option>
              <option value={InviteStatus.pending}>pending</option>
              <option value={InviteStatus.accepted}>accepted</option>
              <option value={InviteStatus.expired}>expired</option>
              <option value={InviteStatus.declined}>declined</option>
              <option value={InviteStatus.revoked}>revoked</option>
            </select>
          </CardContent>
        </Card>
      ) : null}

      {selectedBandError ? (
        <StateCard
          title="Не удалось загрузить активный бенд"
          description={selectedBandError}
        />
      ) : null}

      {!selectedBandId ? (
        <StateCard
          title="Нет выбранного бенда"
          description="Выберите бенд в sidebar или на странице бендов."
          action={
            <Link
              to="/bands"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              К бендам
            </Link>
          }
        />
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4">
          {invitesError ? (
            <StateCard
              title="Не удалось загрузить приглашения"
              description={invitesError}
            />
          ) : null}

          {invitesLoading ? <LoadingCards count={2} /> : null}

          {!invitesLoading && selectedBandId && invites.length === 0 ? (
            <StateCard
              title="Приглашений пока нет"
              description="Создайте приглашение через форму сверху."
            />
          ) : null}

          {!invitesLoading && invites.length > 0 ? (
            <section className="grid gap-4">
              {invites.map((invitation) => {
                const isMutating = mutatingInviteId === invitation.id;

                return (
                  <Card
                    key={invitation.id}
                    className="border-border/60 bg-card/80"
                  >
                    <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-base font-medium">
                          <MailPlusIcon className="size-4" />
                          {invitation.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Действует до {formatDateTime(invitation.expires_at)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {invitation.id}
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-2 md:items-end">
                        <Badge
                          variant={
                            invitation.status === InviteStatus.pending
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {formatInviteStatus(invitation.status)}
                        </Badge>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isMutating}
                            onClick={() =>
                              void handleInviteAction(invitation.id, "resend")
                            }
                          >
                            <RefreshCcwIcon />
                            Resend
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isMutating}
                            onClick={() =>
                              void handleInviteAction(invitation.id, "revoke")
                            }
                          >
                            {isMutating ? (
                              <LoaderCircleIcon className="animate-spin" />
                            ) : (
                              <Trash2Icon />
                            )}
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </section>
          ) : null}
        </div>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Работа с invite token</CardTitle>
            <CardDescription>
              Проверка статуса и пользовательские действия по токену
              приглашения.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input
              value={tokenValue}
              onChange={(event) => setTokenValue(event.target.value)}
              placeholder="invite token"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={tokenActionLoading || !tokenValue.trim()}
                onClick={() => void handleTokenAction("status")}
              >
                Проверить статус
              </Button>
              <Button
                size="sm"
                disabled={tokenActionLoading || !tokenValue.trim()}
                onClick={() => void handleTokenAction("accept")}
              >
                Принять
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={tokenActionLoading || !tokenValue.trim()}
                onClick={() => void handleTokenAction("decline")}
              >
                Отклонить
              </Button>
            </div>

            {tokenActionLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircleIcon className="animate-spin" />
                Выполняю запрос...
              </div>
            ) : null}

            {tokenActionError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {tokenActionError}
              </div>
            ) : null}

            {tokenActionMessage ? (
              <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-sm text-foreground">
                {tokenActionMessage}
              </div>
            ) : null}

            {tokenInvite ? (
              <div className="grid gap-2 rounded-xl border border-border/60 bg-background/70 p-4 text-sm">
                <div className="font-medium text-foreground">
                  {tokenInvite.email}
                </div>
                <div className="text-muted-foreground">
                  Статус: {formatInviteStatus(tokenInvite.status)}
                </div>
                <div className="text-muted-foreground">
                  Истекает: {formatDateTime(tokenInvite.expires_at)}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export function MyInvitationsPage() {
  const { refreshBands } = useBands();
  const [invites, setInvites] = React.useState<MyInviteOut[]>([]);
  const [invitesLoading, setInvitesLoading] = React.useState(false);
  const [invitesError, setInvitesError] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<"all" | InviteStatus>(
    "all",
  );
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(
    null,
  );

  const loadInvites = React.useCallback(async () => {
    setInvitesLoading(true);

    try {
      const response = await listMyInvitesMeInvitesGet({
        limit: 500,
        offset: 0,
        status_filter: statusFilter === "all" ? undefined : statusFilter,
      });

      setInvites(response);
      setInvitesError(null);
    } catch (error) {
      setInvitesError(getErrorMessage(error));
    } finally {
      setInvitesLoading(false);
    }
  }, [statusFilter]);

  React.useEffect(() => {
    void loadInvites();
  }, [loadInvites]);

  async function handleAction(
    invite: MyInviteOut,
    action: "accept" | "decline",
  ) {
    setActionLoadingId(invite.id);

    try {
      if (action === "accept") {
        await acceptInviteInvitesTokenAcceptPost(invite.token);
      } else {
        await declineInviteInvitesTokenDeclinePost(invite.token);
      }

      await loadInvites();

      if (action === "accept") {
        await refreshBands();
      }
    } catch (error) {
      setInvitesError(getErrorMessage(error));
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageIntro
        eyebrow="Личное"
        title="Мои приглашения"
        description="Приглашения, отправленные вам в бенды. Здесь вы можете принять или отклонить приглашение."
        action={
          <Button
            variant="outline"
            size="sm"
            disabled={invitesLoading}
            onClick={() => void loadInvites()}
          >
            <RefreshCcwIcon />
            Обновить
          </Button>
        }
      />

      <Card className="border-border/60 bg-card/80">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Фильтрация по статусу приглашения.
          </div>
          <select
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | InviteStatus)
            }
          >
            <option value="all">all</option>
            <option value={InviteStatus.pending}>pending</option>
            <option value={InviteStatus.accepted}>accepted</option>
            <option value={InviteStatus.expired}>expired</option>
            <option value={InviteStatus.declined}>declined</option>
            <option value={InviteStatus.revoked}>revoked</option>
          </select>
        </CardContent>
      </Card>

      {invitesError ? (
        <StateCard
          title="Не удалось загрузить приглашения"
          description={invitesError}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadInvites()}
            >
              Повторить
            </Button>
          }
        />
      ) : null}

      {invitesLoading ? <LoadingCards count={3} /> : null}

      {!invitesLoading && invites.length === 0 ? (
        <StateCard
          title="Приглашений пока нет"
          description="Когда кто-то пригласит вас в бенд, приглашение появится здесь."
        />
      ) : null}

      {!invitesLoading && invites.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {invites.map((invite) => {
            const isActing = actionLoadingId === invite.id;
            const isPending = invite.status === InviteStatus.pending;

            return (
              <Card key={invite.id} className="border-border/60 bg-card/80">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {invite.band_name}
                      </CardTitle>
                      <CardDescription>{invite.email}</CardDescription>
                    </div>
                    <Badge variant={isPending ? "secondary" : "outline"}>
                      {formatInviteStatus(invite.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock3Icon className="size-4" />
                    Действует до {formatDateTime(invite.expires_at)}
                  </div>
                </CardContent>

                {isPending ? (
                  <CardFooter className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      disabled={isActing}
                      onClick={() => void handleAction(invite, "accept")}
                    >
                      {isActing ? (
                        <LoaderCircleIcon className="animate-spin" />
                      ) : (
                        <CheckCircle2Icon />
                      )}
                      Принять
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isActing}
                      onClick={() => void handleAction(invite, "decline")}
                    >
                      <XCircleIcon />
                      Отклонить
                    </Button>
                  </CardFooter>
                ) : null}
              </Card>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}

export function SongsPage() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageIntro
        eyebrow="Репертуар"
        title="Песни"
        description="Каталог песен с ключами, BPM, лирикой и аккордами. Здесь позже можно будет добавить версии, тональности и вложения с нотами."
        action={
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>
            Добавить песню
          </span>
        }
      />

      <Card className="border-border/60 bg-card/80">
        <CardContent className="p-4 md:p-5">
          <Input placeholder="Поиск по названию, артисту, тегам или тональности" />
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {songs.map((song) => (
          <Card key={song.id} className="border-border/60 bg-card/80">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{song.title}</CardTitle>
                  <CardDescription>{song.artist}</CardDescription>
                </div>
                <Badge variant="outline">{song.key}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MusicIcon className="size-4" />
                {song.bpm} BPM · {song.duration}
              </div>
              <div className="line-clamp-3 rounded-lg border border-border/60 bg-background/70 p-3">
                {song.lyrics}
              </div>
              <div className="flex flex-wrap gap-2">
                {song.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                {song.updatedAt}
              </span>
              <Link
                to={`/songs/${song.id}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Открыть карточку
              </Link>
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  );
}

export function SongDetailsPage() {
  const params = useParams();
  const song = getSongById(params.songId ?? "");

  if (!song) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageIntro
        eyebrow="Карточка песни"
        title={song.title}
        description={`Исполнитель: ${song.artist}. Базовая карточка для хранения текста, аккордов и метаданных выступления.`}
        action={
          <Link
            to="/songs"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            К списку песен
          </Link>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[0.7fr_1.3fr]">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Метаданные</CardTitle>
            <CardDescription>
              Тональность, темп и сценические пометки.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-border/60 bg-background/70 p-3">
              <div className="font-medium text-foreground">Тональность</div>
              <div className="mt-1">{song.key}</div>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/70 p-3">
              <div className="font-medium text-foreground">Темп</div>
              <div className="mt-1">{song.bpm} BPM</div>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/70 p-3">
              <div className="font-medium text-foreground">Длительность</div>
              <div className="mt-1">{song.duration}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {song.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Лирика</CardTitle>
              <CardDescription>
                Редактируемое поле для слов песни.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={song.lyrics}
                readOnly
                className="min-h-56 font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Аккорды</CardTitle>
              <CardDescription>
                Структура песни и аккордовая сетка.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={song.chords}
                readOnly
                className="min-h-56 font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export function SetlistsPage() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageIntro
        eyebrow="Выступления"
        title="Сетлисты"
        description="Базовые заготовки концертных программ с порядком песен и расчётом длительности."
        action={
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>
            Создать сетлист
          </span>
        }
      />

      <section className="grid gap-4 xl:grid-cols-2">
        {setlists.map((setlist) => (
          <Card key={setlist.id} className="border-border/60 bg-card/80">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{setlist.title}</CardTitle>
                  <CardDescription>{setlist.band}</CardDescription>
                </div>
                <Badge variant="outline">{setlist.duration}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="size-4" />
                {setlist.event}
              </div>
              <div className="flex flex-wrap gap-2">
                {setlist.songs.map((song) => (
                  <Badge key={song} variant="secondary">
                    {song}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

export function CalendarPage() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageIntro
        eyebrow="Выступления"
        title="Календарь"
        description="Общий таймлайн репетиций, саундчеков и концертов по всем активным составам."
        action={
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>
            Добавить событие
          </span>
        }
      />

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {calendarEvents.map((event) => (
          <Card key={event.id} className="border-border/60 bg-card/80">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.band}</CardDescription>
                </div>
                <Badge variant="secondary">{event.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="size-4" />
                {event.when}
              </div>
              <div className="flex items-center gap-2">
                <Disc3Icon className="size-4" />
                {event.location}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-8">
      <Card className="w-full max-w-xl border-border/60 bg-card/80 text-center">
        <CardHeader>
          <Badge variant="outline" className="mx-auto w-fit">
            404
          </Badge>
          <CardTitle className="mt-2">Страница не найдена</CardTitle>
          <CardDescription>
            Похоже, такого раздела ещё нет. Вернитесь в рабочее пространство или
            откройте каталог песен.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center gap-2">
          <Link
            to="/app"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            На обзор
          </Link>
          <Link
            to="/songs"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            К песням
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export function SecurityOverviewCard() {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheckIcon className="size-5" />
          Основа под роли и права доступа
        </CardTitle>
        <CardDescription>
          В следующем этапе сюда можно подключить роли Keycloak, разграничение
          прав по бендам и редакторские permissions на песни.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

