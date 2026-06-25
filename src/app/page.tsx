'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogIn, LogOut, Shield, User, Check, X, Loader2,
  Building2, Send, ChevronLeft, Eye, EyeOff, Sparkles,
  CircleCheckBig, CircleX
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface UserInfo {
  id: string
  username: string
  name: string
  role: 'admin' | 'user'
}

interface Branch {
  id: string
  name: string
  targetSent: boolean
  updatedAt: string
}

export default function Home() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch {
      // not logged in
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch('/api/branches')
      if (res.ok) {
        const data = await res.json()
        setBranches(data.branches)
      }
    } catch {
      toast({ title: 'خطا', description: 'دریافت اطلاعات شعب با مشکل مواجه شد', variant: 'destructive' })
    }
  }, [toast])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  useEffect(() => {
    if (user) {
      fetchBranches()
    }
  }, [user, fetchBranches])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        setUsername('')
        setPassword('')
      } else {
        toast({ title: 'خطا', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'خطا', description: 'خطا در ارتباط با سرور', variant: 'destructive' })
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setBranches([])
  }

  const toggleTargetSent = async (branch: Branch) => {
    if (user?.role !== 'admin') return
    setUpdatingId(branch.id)
    try {
      const res = await fetch(`/api/branches/${branch.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetSent: !branch.targetSent }),
      })
      if (res.ok) {
        setBranches((prev) =>
          prev.map((b) => (b.id === branch.id ? { ...b, targetSent: !b.targetSent } : b))
        )
        toast({
          title: branch.targetSent ? 'تارگت لغو شد' : 'تارگت ارسال شد',
          description: `${branch.name} — ${branch.targetSent ? 'ارسال لغو گردید' : 'تارگت با موفقیت ارسال شد'}`,
        })
      }
    } catch {
      toast({ title: 'خطا', description: 'خطا در بروزرسانی', variant: 'destructive' })
    } finally {
      setUpdatingId(null)
    }
  }

  const autoFill = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setUsername('admin')
      setPassword('admin123')
    } else {
      setUsername('user')
      setPassword('user123')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-8 h-8 text-emerald-600" />
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900" dir="rtl">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-400/5 blur-3xl"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md px-4"
        >
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-emerald-500/10">
            <CardHeader className="text-center pb-2 pt-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-white leading-relaxed"
              >
                سامانه مدیریت ارسال تارگت
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-sm text-emerald-400 font-semibold mt-1"
              >
                پخش سراسری باراکا
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs text-slate-400 mt-2"
              >
                برای ادامه وارد حساب کاربری خود شوید
              </motion.p>
            </CardHeader>
            <CardContent className="pt-4 pb-8 px-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="text"
                      placeholder="نام کاربری"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pr-10 pl-4 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl"
                      required
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative">
                    <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="رمز عبور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full h-12 bg-gradient-to-l from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loginLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 ml-2" />
                        ورود به سامانه
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Quick fill buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 pt-4 border-t border-white/10"
              >
                <p className="text-[11px] text-slate-500 text-center mb-3">ورود سریع</p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => autoFill('admin')}
                    className="flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl px-4 py-3 transition-all duration-200 cursor-pointer group"
                  >
                    <Shield className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                    <span className="text-xs font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors">کاربر مدیر</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => autoFill('user')}
                    className="flex items-center justify-center gap-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 rounded-xl px-4 py-3 transition-all duration-200 cursor-pointer group"
                  >
                    <User className="w-4 h-4 text-teal-400 group-hover:text-teal-300 transition-colors" />
                    <span className="text-xs font-medium text-teal-300 group-hover:text-teal-200 transition-colors">کاربر عادی</span>
                  </motion.button>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Dashboard - Admin view (table with toggles)
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50" dir="rtl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-sm sm:text-base">سامانه مدیریت ارسال تارگت</h1>
                <p className="text-[10px] sm:text-xs text-emerald-600 font-medium">پخش سراسری باراکا</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-1.5 border border-emerald-100">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs text-emerald-700 font-medium">{user.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                  مدیر
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4 ml-1" />
                <span className="hidden sm:inline text-xs">خروج</span>
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4">
              <p className="text-xs text-emerald-600 font-medium mb-1">کل شعب</p>
              <p className="text-2xl font-bold text-emerald-800">{branches.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4">
              <p className="text-xs text-green-600 font-medium mb-1">ارسال شده</p>
              <p className="text-2xl font-bold text-green-800">{branches.filter(b => b.targetSent).length}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-2xl p-4">
              <p className="text-xs text-red-500 font-medium mb-1">ارسال نشده</p>
              <p className="text-2xl font-bold text-red-700">{branches.filter(b => !b.targetSent).length}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-xs text-slate-500 font-medium mb-1">درصد ارسال</p>
              <p className="text-2xl font-bold text-slate-700">
                {branches.length ? Math.round((branches.filter(b => b.targetSent).length / branches.length) * 100) : 0}%
              </p>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-200/60 shadow-lg shadow-slate-200/30 overflow-hidden rounded-2xl">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-l from-slate-50/50 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <h2 className="font-bold text-slate-800">لیست شعب</h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Send className="w-3.5 h-3.5" />
                    <span>وضعیت تارگت ارسال</span>
                  </div>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-[1fr_140px] sm:grid-cols-[1fr_180px] items-center bg-slate-50/80 border-b border-slate-100 px-6 py-3">
                <span className="text-xs font-semibold text-slate-500">نام شعبه</span>
                <span className="text-xs font-semibold text-slate-500 text-center">تارگت ارسال</span>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-50">
                <AnimatePresence>
                  {branches.map((branch, index) => (
                    <motion.div
                      key={branch.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      className={`grid grid-cols-[1fr_140px] sm:grid-cols-[1fr_180px] items-center px-6 py-4 transition-colors duration-200 ${
                        branch.targetSent ? 'bg-emerald-50/30' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          branch.targetSent ? 'bg-emerald-400' : 'bg-slate-300'
                        }`} />
                        <span className="font-medium text-slate-700 text-sm">{branch.name}</span>
                      </div>
                      <div className="flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleTargetSent(branch)}
                          disabled={updatingId === branch.id}
                          className={`
                            relative w-12 h-7 rounded-full transition-all duration-300 ease-out
                            focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${branch.targetSent
                              ? 'bg-gradient-to-l from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/30 focus:ring-emerald-400'
                              : 'bg-slate-200 shadow-inner focus:ring-slate-300'
                            }
                          `}
                        >
                          <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={`
                              absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center
                              shadow-md transition-all duration-300
                              ${branch.targetSent
                                ? 'right-0.5 bg-white'
                                : 'right-[22px] bg-white'
                              }
                            `}
                          >
                            {updatingId === branch.id ? (
                              <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                            ) : branch.targetSent ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                              </motion.div>
                            ) : (
                              <motion.div
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                              >
                                <X className="w-3.5 h-3.5 text-slate-400 stroke-[3]" />
                              </motion.div>
                            )}
                          </motion.div>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-100 bg-white/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <p className="text-xs text-slate-400">پخش سراسری باراکا — نسخه ۱.۰</p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" />
              طراحی شده با ❤️
            </p>
          </div>
        </footer>
      </div>
    )
  }

  // Dashboard - Normal user view (vertical/compact grid)
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50" dir="rtl">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm">ارسال تارگت شعب</h1>
              <p className="text-[10px] text-emerald-600 font-medium">پخش سراسری باراکا</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-100">
              <User className="w-3 h-3 text-slate-500" />
              <span className="text-[11px] text-slate-600">{user.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg h-8 w-8 p-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-5">
        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex-1 bg-gradient-to-l from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs text-emerald-600 font-medium">ارسال شده</span>
            <span className="text-lg font-bold text-emerald-700">{branches.filter(b => b.targetSent).length}</span>
          </div>
          <div className="flex-1 bg-gradient-to-l from-red-50 to-rose-50 border border-red-100 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs text-red-500 font-medium">ارسال نشده</span>
            <span className="text-lg font-bold text-red-600">{branches.filter(b => !b.targetSent).length}</span>
          </div>
          <div className="flex-1 bg-gradient-to-l from-slate-50 to-gray-50 border border-slate-100 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">کل شعب</span>
            <span className="text-lg font-bold text-slate-700">{branches.length}</span>
          </div>
        </motion.div>

        {/* Vertical branch grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
        >
          <AnimatePresence>
            {branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * index, duration: 0.3, ease: 'easeOut' }}
                className={`
                  relative flex items-center gap-2.5 rounded-xl px-3.5 py-3 border transition-all duration-300
                  ${branch.targetSent
                    ? 'bg-emerald-50/80 border-emerald-200/80 shadow-sm shadow-emerald-100/50'
                    : 'bg-white border-slate-150 border-slate-200/70 shadow-sm'
                  }
                `}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  {branch.targetSent ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.04 * index + 0.1 }}
                      className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-500/30"
                    >
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.04 * index + 0.1 }}
                      className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center shadow-sm shadow-red-500/30"
                    >
                      <X className="w-4 h-4 text-white stroke-[3]" />
                    </motion.div>
                  )}
                </div>

                {/* Branch name */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    branch.targetSent ? 'text-emerald-800' : 'text-slate-700'
                  }`}>
                    {branch.name}
                  </p>
                  <p className={`text-[10px] ${
                    branch.targetSent ? 'text-emerald-500' : 'text-slate-400'
                  }`}>
                    {branch.targetSent ? 'ارسال شده' : 'ارسال نشده'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">پخش سراسری باراکا</p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" />
            طراحی شده با ❤️
          </p>
        </div>
      </footer>
    </div>
  )
}
