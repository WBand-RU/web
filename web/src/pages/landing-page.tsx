import { CalendarDaysIcon, MusicIcon, ShieldCheckIcon, UsersIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { useAuth } from "@/components/providers/auth-provider"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { dashboardStats, productFeatures } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const featureIcons = [MusicIcon, UsersIcon, CalendarDaysIcon, ShieldCheckIcon]

export function LandingPage() {
  const auth = useAuth()

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_55%)]" />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 backdrop-blur md:px-6">
          <div>
            <div className="text-lg font-semibold tracking-tight">WBand</div>
            <div className="text-sm text-muted-foreground">
              Репертуар, бенды, сетлисты и выступления в одном рабочем пространстве.
            </div>
          </div>
          <div className="flex items-center gap-2">
            {auth.authenticated ? (
              <Link
                to="/app"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Открыть приложение
              </Link>
            ) : auth.configured ? (
              <button
                type="button"
                className={buttonVariants({ variant: "default", size: "sm" })}
                onClick={() => auth.login()}
              >
                Войти через Keycloak
              </button>
            ) : (
              <span
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "cursor-default opacity-80"
                )}
              >
                Нужна настройка Keycloak
              </span>
            )}
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-12 md:py-20">
          <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                Новый рабочий контур для музыкантов и бендов
              </Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Управляйте песнями, составами и выступлениями без хаоса в чатах и файлах.
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                  WBand — это современная база репертуара для музыкальных групп: песни,
                  лирика, аккорды, сетлисты, репетиции, календари и совместная работа по
                  каждому бенду. По духу — расширенная версия banfix.by, но с акцентом на
                  удобство, мобильность и прозрачные рабочие процессы.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {auth.authenticated ? (
                  <Link to="/app" className={buttonVariants({ variant: "default", size: "lg" })}>
                    Перейти в рабочее пространство
                  </Link>
                ) : auth.configured ? (
                  <button
                    type="button"
                    className={buttonVariants({ variant: "default", size: "lg" })}
                    onClick={() => auth.login(`${window.location.origin}/app`)}
                  >
                    Начать с авторизации
                  </button>
                ) : (
                  <span
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "cursor-default justify-center"
                    )}
                  >
                    Сначала заполните Keycloak env
                  </span>
                )}
                <a
                  href="#features"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Посмотреть возможности
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="text-sm font-medium">Публичный лендинг</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Маршрут `/` доступен без логина.
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="text-sm font-medium">Защищённый workspace</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Все рабочие разделы требуют Keycloak.
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="text-sm font-medium">Desktop + mobile</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Навигация и карточки адаптированы под любые экраны.
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-border/60 bg-card/80 shadow-2xl shadow-black/10 backdrop-blur">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  Что уже заложено в каркас
                </Badge>
                <CardTitle className="mt-2 text-2xl">Базовые модули продукта</CardTitle>
                <CardDescription>
                  Моки страниц уже готовы для следующего этапа: подключения API, прав и
                  реальных сценариев совместной работы.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {dashboardStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/60 bg-background/80 p-4"
                  >
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{stat.note}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section id="features" className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 xl:grid-cols-4">
            {productFeatures.map((feature, index) => {
              const Icon = featureIcons[index % featureIcons.length]

              return (
                <Card key={feature.title} className="border-border/60 bg-card/70">
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="mt-3">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </section>
        </main>
      </div>
    </div>
  )
}
