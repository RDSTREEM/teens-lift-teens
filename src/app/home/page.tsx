"use client";
import React from "react";
import Link from "next/link";
import {
  ChatBubbleLeftRightIcon,
  PencilIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

function FeatureCard({
  href,
  title,
  description,
  Icon,
  compact = false,
  showDescription = true,
}: {
  href: string;
  title: string;
  description?: string;
  Icon: React.ComponentType<{ className?: string }>;
  compact?: boolean;
  showDescription?: boolean;
}) {
  if (compact) {
    return (
      <Link
        href={href}
        aria-label={title}
        className="group inline-flex items-center gap-3 rounded-lg p-2 sm:p-4 bg-white/60 hover:bg-white/80 dark:bg-zinc-800/60 dark:hover:bg-zinc-800/70 transition-shadow shadow-sm hover:shadow-md border border-transparent hover:border-zinc-200"
      >
        <div className="flex items-center justify-center p-2 rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100">
          <Icon className="h-5 w-5 md:h-6 md:w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {title}
          </span>
          {description && showDescription ? (
            <span className="hidden md:inline text-sm text-zinc-600 dark:text-zinc-300">
              {description}
            </span>
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group block bg-white/60 hover:bg-white/80 dark:bg-zinc-800/60 dark:hover:bg-zinc-800/70 transition-shadow rounded-xl p-5 shadow-sm hover:shadow-md border border-transparent hover:border-zinc-200"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 hidden md:block">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="container mx-auto px-6">
        <section className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Teens Lift Teens
          </h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            A safe, supportive place to share, learn, and connect. Build
            resilience, write your thoughts, and chat anonymously with peers.
          </p>
        </section>

        <section className="mt-12 max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Explore</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureCard
              href="/profile"
              title="Profile"
              description="Manage account settings."
              Icon={UserIcon}
            />
            <FeatureCard
              href="/home/notes"
              title="My Notes"
              description="Save thoughts, ideas, and reflections privately or share with others."
              Icon={BookOpenIcon}
            />
            <FeatureCard
              href="/home/post"
              title="Post"
              description="Share experiences or advice with the community."
              Icon={PencilIcon}
            />
            <FeatureCard
              href="/home/chat"
              title="Anonymous Chat"
              description="Get things off your chest and connect with peers in a moderated space."
              Icon={ChatBubbleLeftRightIcon}
            />
            <FeatureCard
              href="/home/resilience-hub"
              title="Resilience Hub"
              description="Tools, tips, and exercises to build emotional strength."
              Icon={ShieldCheckIcon}
            />
            <FeatureCard
              href="/games"
              title="Games"
              description="Play fun and brain-testing games."
              Icon={SparklesIcon}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
