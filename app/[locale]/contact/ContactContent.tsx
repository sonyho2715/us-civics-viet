'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Locale } from '@/types';

interface ContactContentProps {
  locale: string;
}

export function ContactContent({ locale }: ContactContentProps) {
  const [submitted, setSubmitted] = useState(false);

  const content = {
    vi: {
      title: 'Liên Hệ',
      back: 'Trang chủ',
      intro: 'Chúng tôi luôn sẵn lòng lắng nghe ý kiến của bạn. Nếu bạn có câu hỏi, góp ý, hoặc phát hiện lỗi, vui lòng liên hệ với chúng tôi.',
      form: {
        name: 'Tên của bạn',
        namePlaceholder: 'Nhập tên...',
        email: 'Email',
        emailPlaceholder: 'Nhập email...',
        subject: 'Chủ đề',
        subjectPlaceholder: 'Chọn chủ đề',
        subjects: [
          { value: 'question', label: 'Câu hỏi về nội dung' },
          { value: 'bug', label: 'Báo cáo lỗi' },
          { value: 'suggestion', label: 'Góp ý cải thiện' },
          { value: 'other', label: 'Khác' }
        ],
        message: 'Nội dung',
        messagePlaceholder: 'Nhập nội dung tin nhắn...',
        submit: 'Gửi Tin Nhắn',
        required: 'Bắt buộc'
      },
      success: {
        title: 'Cảm ơn bạn!',
        message: 'Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
        backButton: 'Quay lại trang chủ'
      },
      alternatives: {
        title: 'Cách Khác Để Liên Hệ',
        email: {
          title: 'Email Trực Tiếp',
          description: 'Gửi email cho chúng tôi tại:'
        },
        faq: {
          title: 'Câu Hỏi Thường Gặp',
          description: 'Xem phần hướng dẫn di trú để tìm câu trả lời cho các câu hỏi phổ biến.'
        }
      },
      uscis: {
        title: 'Thông Tin USCIS',
        description: 'Để biết thông tin chính thức về quy trình nhập tịch, vui lòng truy cập trang web USCIS.',
        link: 'Truy cập USCIS.gov'
      }
    },
    en: {
      title: 'Contact Us',
      back: 'Home',
      intro: 'We are always happy to hear from you. If you have questions, suggestions, or find any errors, please contact us.',
      form: {
        name: 'Your Name',
        namePlaceholder: 'Enter your name...',
        email: 'Email',
        emailPlaceholder: 'Enter your email...',
        subject: 'Subject',
        subjectPlaceholder: 'Select a subject',
        subjects: [
          { value: 'question', label: 'Question about content' },
          { value: 'bug', label: 'Report a bug' },
          { value: 'suggestion', label: 'Suggestion for improvement' },
          { value: 'other', label: 'Other' }
        ],
        message: 'Message',
        messagePlaceholder: 'Enter your message...',
        submit: 'Send Message',
        required: 'Required'
      },
      success: {
        title: 'Thank You!',
        message: 'Your message has been sent. We will respond as soon as possible.',
        backButton: 'Back to Home'
      },
      alternatives: {
        title: 'Other Ways to Contact',
        email: {
          title: 'Direct Email',
          description: 'Send us an email at:'
        },
        faq: {
          title: 'Frequently Asked Questions',
          description: 'Check our immigration guide for answers to common questions.'
        }
      },
      uscis: {
        title: 'USCIS Information',
        description: 'For official information about the naturalization process, please visit the USCIS website.',
        link: 'Visit USCIS.gov'
      }
    }
  };

  const t = content[locale as Locale] || content.vi;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Create mailto link
    const mailtoLink = `mailto:contact@congdanmy.com?subject=${encodeURIComponent(`[${subject}] From ${name}`)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t.success.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t.success.message}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {t.success.backButton}
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t.back}
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
        </div>
      </div>

      {/* Intro */}
      <Card className="mb-6">
        <p className="text-gray-700 dark:text-gray-300">{t.intro}</p>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact Form */}
        <div className="md:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.form.name} <span className="text-red-500" aria-label={t.form.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder={t.form.namePlaceholder}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.form.email} <span className="text-red-500" aria-label={t.form.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder={t.form.emailPlaceholder}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.form.subject} <span className="text-red-500" aria-label={t.form.required}>*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t.form.subjectPlaceholder}</option>
                  {t.form.subjects.map((subj) => (
                    <option key={subj.value} value={subj.value}>
                      {subj.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.form.message} <span className="text-red-500" aria-label={t.form.required}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder={t.form.messagePlaceholder}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                {t.form.submit}
              </button>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Direct Email */}
          <Card>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {t.alternatives.email.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t.alternatives.email.description}
                </p>
                <a
                  href="mailto:contact@congdanmy.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  contact@congdanmy.com
                </a>
              </div>
            </div>
          </Card>

          {/* USCIS Info */}
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {t.uscis.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {t.uscis.description}
            </p>
            <a
              href="https://www.uscis.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              {t.uscis.link}
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
