import { ShieldCheckIcon, Settings2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { keycloakEnvironment } from "@/lib/keycloak"

export function AuthLoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur">
        <CardHeader>
          <Badge variant="outline" className="w-fit">
            Авторизация
          </Badge>
          <CardTitle className="mt-2 flex items-center gap-2">
            <ShieldCheckIcon className="size-5" />
            Подключаем Keycloak
          </CardTitle>
          <CardDescription>
            Проверяем сессию и подготавливаем защищённый доступ к рабочему пространству.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export function AuthConfigurationRequiredState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-2xl border-border/60 bg-card/90 backdrop-blur">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            Требуется конфигурация
          </Badge>
          <CardTitle className="mt-2 flex items-center gap-2">
            <Settings2Icon className="size-5" />
            Keycloak ещё не настроен
          </CardTitle>
          <CardDescription>
            Лендинг доступен публично, но для всех остальных страниц нужно задать параметры подключения к Keycloak.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-background/70 p-3">
            <div className="font-medium text-foreground">VITE_KEYCLOAK_URL</div>
            <div>{keycloakEnvironment.url || "не задан"}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/70 p-3">
            <div className="font-medium text-foreground">VITE_KEYCLOAK_REALM</div>
            <div>{keycloakEnvironment.realm || "не задан"}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/70 p-3">
            <div className="font-medium text-foreground">VITE_KEYCLOAK_CLIENT_ID</div>
            <div>{keycloakEnvironment.clientId || "не задан"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
