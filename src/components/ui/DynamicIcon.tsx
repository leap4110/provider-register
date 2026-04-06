"use client";

import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const pascalName = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[pascalName] as React.ComponentType<LucideProps> | undefined;

  if (!Icon) {
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <Icon {...props} />;
}
