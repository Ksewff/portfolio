"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowUpRight, Check, Github, Linkedin, Mail, Send } from "lucide-react";
import { useSiteData } from "@/components/SiteDataProvider";
import Section from "@/components/front/Section";
import { isValidEmail } from "@/lib/utils";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

type ContactErrors = Partial<Record<keyof ContactForm, string>>;

const EMPTY_FORM: ContactForm = { name: "", email: "", message: "" };

export default function ContactSection() {
  const { data, addMessage } = useSiteData();
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);

  const validate = (values: ContactForm): ContactErrors => {
    const next: ContactErrors = {};
    if (values.name.trim().length < 2) {
      next.name = "请填写至少 2 个字符的称呼";
    }
    if (!isValidEmail(values.email)) {
      next.email = "请填写有效的邮箱地址";
    }
    if (values.message.trim().length < 10) {
      next.message = "请多写一点，至少 10 个字符";
    }
    return next;
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSent(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    addMessage(form);
    setForm(EMPTY_FORM);
    setSent(true);
  };

  const channels = [
    {
      label: "邮箱",
      value: data.profile.email,
      href: `mailto:${data.profile.email}`,
      icon: Mail,
    },
    {
      label: "GitHub",
      value: "查看代码与实验",
      href: data.profile.github,
      icon: Github,
    },
    {
      label: "LinkedIn",
      value: "职业经历与合作",
      href: data.profile.linkedin,
      icon: Linkedin,
    },
  ];

  return (
    <Section
      id="contact"
      label="联络 / contact"
      title="有想法，就发个信号。"
      description="无论是产品合作、技术咨询，还是单纯想聊聊界面，都欢迎来信。"
    >
      <div className="grid gap-12 md:grid-cols-5 md:gap-10">
        <div className="md:col-span-3">
          {sent ? (
            <div
              className="panel flex flex-col items-start gap-4 p-8"
              role="status"
              aria-live="polite"
            >
              <span className="grid h-10 w-10 place-items-center border border-accent/40 text-accent-soft">
                <Check className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-serif text-xl text-star">信号已接收</p>
                <p className="mt-2 text-sm leading-6 text-star-dim">
                  消息已保存到本地收件箱（演示环境使用 localStorage）。
                </p>
              </div>
              <button type="button" className="btn-ghost" onClick={() => setSent(false)}>
                再写一条
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="field-label">
                    称呼
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="field"
                    placeholder="怎么称呼你"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                  />
                  {errors.name ? (
                    <p id="contact-name-error" className="mt-1.5 text-xs text-rose-300">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="contact-email" className="field-label">
                    邮箱
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="field"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                  />
                  {errors.email ? (
                    <p id="contact-email-error" className="mt-1.5 text-xs text-rose-300">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="field-label">
                  想说的话
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className="field resize-y"
                  placeholder="项目背景、时间范围，或者任何你愿意分享的细节。"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                />
                {errors.message ? (
                  <p id="contact-message-error" className="mt-1.5 text-xs text-rose-300">
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[10px] tracking-wide text-star-faint">
                  通常 24 小时内回复
                </p>
                <button type="submit" className="btn-primary">
                  <Send className="h-4 w-4" aria-hidden="true" />
                  发送消息
                </button>
              </div>
            </form>
          )}
        </div>

        <ul className="md:col-span-2">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <li key={channel.label} className="border-t border-white/[0.08] first:border-t-0">
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex items-start gap-3 py-5"
                >
                  <Icon className="mt-0.5 h-4 w-4 text-accent-soft" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] tracking-widest text-star-faint">
                      {channel.label}
                    </span>
                    <span className="mt-1 block truncate text-sm text-star transition-colors group-hover:text-accent-soft">
                      {channel.value}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="ml-auto mt-1 h-3.5 w-3.5 shrink-0 text-star-faint"
                    aria-hidden="true"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
