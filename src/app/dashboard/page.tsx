import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '../../utils/supabase'
import { Button } from '../../components/ui/button'
import AuthButton from '../../components/AuthButton'

export default async function Dashboard() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login?message=You must be logged in to view this page')
  }

  const handleSignOut = async () => {
    'use server'
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex w-full flex-col">
      <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
        <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
          <AuthButton />
        </div>
      </nav>
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
        <p className="mb-4">Logged in as: {user.email}</p>
      </div>
    </div>
  )
}
