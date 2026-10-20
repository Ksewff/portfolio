"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { getAdminSession, login } from "@/lib/auth";

interface LoginErrors {
  username?: string;
  password?: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (getAdminSession()) {
      router.replace("/admin");
      return;
    }
    setChecking(false);
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const nextErrors: LoginErrors = {};
    if (username.trim().length === 0) {
      nextErrors.username = "请输入账号";
    }
    if (password.length < 6) {
      nextErrors.password = "密码至少 6 位";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError("");
      return;
    }
    const session = login(username, password);
    if (!session) {
      setFormError("账号或密码不正确，请使用 admin / 123456");
      return;
    }
    router.replace("/admin");
  };

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <p className="font-mono text-[11px] tracking-widest text-star-faint">
          正在校验会话…
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/[0.07] p-12 lg:flex">
        <div className="flex items-center gap-3">
          <span className="relative grid h-8 w-8 place-items-center border border-accent/40">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-soft" />
          </span>
          <span className="font-mono text-[10px] tracking-widest text-star-faint">
            personal observatory
          </span>
        </div>

        <div className="relative">
          <svg
            viewBox="0 0 400 400"
            className="pointer-events-none absolute -left-24 -top-40 h-[520px] w-[520px] text-accent/15"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="200" cy="200" r="150" stroke="currentColor" strokeDasharray="2 9" />
            <circle cx="200" cy="200" r="108" stroke="currentColor" opacity="0.7" />
            <circle cx="200" cy="200" r="66" stroke="currentColor" opacity="0.5" />
            <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" opacity="0.4" />
            <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" opacity="0.4" />
          </svg>
          <p className="relative max-w-md font-serif text-3xl leading-[1.35] text-star">
            每一份内容，都值得被准确地记录与再次看见。
          </p>
          <p className="relative mt-6 max-w-sm text-sm leading-7 text-star-dim">
            这里是个人主页的控制台。修改会即时同步到前台，并保存在当前浏览器的
            localStorage 中。
          </p>
        </div>

        <p className="font-mono text-[10px] tracking-widest text-star-faint">
          30.2741° N / 120.1551° E · UTC+08:00
        </p>
      </div>

      <div className="flex flex-col justify-center px-5 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide text-star-faint transition-colors hover:text-star"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            返回前台
          </Link>

          <div className="mt-12 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center border border-accent/40 text-accent-soft">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[10px] tracking-widest text-star-faint">
                管理后台 / sign in
              </p>
              <h1 className="mt-1 font-serif text-2xl text-star">登录控制台</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
            <div>
              <label htmlFor="admin-username" className="field-label">
                账号
              </label>
              <input
                id="admin-username"
                name="username"
                type="text"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setErrors((current) => ({ ...current, username: undefined }));
                  setFormError("");
                }}
                className="field"
                placeholder="admin"
                autoComplete="username"
                aria-invalid={Boolean(errors.username)}
                aria-describedby={errors.username ? "admin-username-error" : undefined}
              />
              {errors.username ? (
                <p id="admin-username-error" className="mt-1.5 text-xs text-rose-300">
                  {errors.username}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="admin-password" className="field-label">
                密码
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((current) => ({ ...current, password: undefined }));
                    setFormError("");
                  }}
                  className="field pr-11"
                  placeholder="••••••"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "admin-password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-1 top-1 grid h-9 w-9 place-items-center text-star-faint transition-colors hover:text-star"
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p id="admin-password-error" className="mt-1.5 text-xs text-rose-300">
                  {errors.password}
                </p>
              ) : null}
            </div>

            {formError ? (
              <p
                role="alert"
                className="border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs leading-5 text-rose-200"
              >
                {formError}
              </p>
            ) : null}

            <button type="submit" className="btn-primary w-full">
              进入控制台
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="border border-white/[0.08] bg-white/[0.02] p-3 font-mono text-[10px] leading-5 tracking-wide text-star-faint">
              演示账号：admin / 123456
              <br />
              登录状态保存在 localStorage，有效期 8 小时。
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
