import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { session } from '@/lib/session'

export function HomePage() {
  const navigate = useNavigate()
  const member = session.load()

  if (!member) {
    navigate('/login', { replace: true })
    return null
  }

  const handleLogout = () => {
    session.clear()
    navigate('/login', { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>환영합니다, {member.name}님</CardTitle>
          <CardDescription>Pawmart 에 로그인되었습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="회원 ID" value={String(member.memberId)} />
          <Row label="로그인 아이디" value={member.loginId} />
          <Row label="권한" value={member.role} />
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            로그아웃
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b py-1 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
