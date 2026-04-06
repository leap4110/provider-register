"use client";

import { useState } from "react";
import { Mail, Phone, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setSubmitting(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);

    toast.success("Message sent! We'll get back to you within 1-2 business days.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <div className="bg-white px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Contact Us
          </h1>
          <p className="mt-3 text-gray-600">
            Have a question, suggestion, or need help? Reach out and
            we&apos;ll get back to you as soon as we can.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={subject}
                onValueChange={(v) => v && setSubject(v)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Enquiry</SelectItem>
                  <SelectItem value="participant">
                    Participant Support
                  </SelectItem>
                  <SelectItem value="provider">Provider Support</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us how we can help..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="mt-1"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Other Ways to Reach Us
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Prefer to reach out directly? Here are our contact details.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a
                    href="mailto:hello@ndisproviders.com.au"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    hello@ndisproviders.com.au
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <a
                    href="tel:1800000123"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    1800 000 123
                  </a>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Free call within Australia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Business Hours</p>
                  <p className="text-sm text-gray-600">
                    Monday &ndash; Friday: 9:00 AM &ndash; 5:00 PM AEST
                  </p>
                  <p className="text-sm text-gray-600">
                    Saturday &ndash; Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-medium text-blue-900">
                Response Time
              </p>
              <p className="mt-1 text-sm text-blue-700">
                We aim to respond to all enquiries within 1&ndash;2 business
                days. For urgent matters, please call us during business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
