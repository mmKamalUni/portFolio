"use client";
import React from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { MapPinIcon, PhoneIcon, EnvelopeIcon, LinkIcon } from "@heroicons/react/24/outline";
import { personalDetails } from "@/lib/data";
import LiquidContainer from "@/components/LiquidContainer";

type FieldState = {
  value: string;
  touched: boolean;
};

export default function Contact() {
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [name, setName] = React.useState<FieldState>({ value: "", touched: false });
  const [email, setEmail] = React.useState<FieldState>({ value: "", touched: false });
  const [message, setMessage] = React.useState<FieldState>({ value: "", touched: false });
  const [status, setStatus] = React.useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);

  const emailValid = /.+@.+\..+/.test(email.value);
  const nameValid = name.value.trim().length > 1;
  const messageValid = message.value.trim().length > 5;
  const canSubmit = emailValid && nameValid && messageValid && status !== "sending";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit || !formRef.current) return;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setError("Email service is not configured. Please set the EmailJS environment variables.");
      return;
    }

    try {
      setStatus("sending");
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
      setStatus("success");
      setName({ value: "", touched: false });
      setEmail({ value: "", touched: false });
      setMessage({ value: "", touched: false });
      formRef.current.reset();
    } catch (err) {
      setStatus("error");
      setError("Failed to send. Please try again later.");
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const inputBase =
    "peer w-full rounded-md border bg-transparent px-4 pb-2 pt-5 outline-none transition-colors";
  const labelBase =
    "pointer-events-none absolute left-4 top-1.5 text-sm text-lightGray transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-sm";

  return (
    <section id="contact" className="py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <LiquidContainer>
          <h2 className="mb-6 font-serif text-[24px] font-bold text-cyan">Contact</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Form */}
          <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="user_name"
                placeholder=" "
                value={name.value}
                onChange={(e) => setName({ value: e.target.value, touched: true })}
                onBlur={() => setName((s) => ({ ...s, touched: true }))}
                className={`${inputBase} ${name.touched ? (nameValid ? "border-green-500" : "border-red-500") : "border-lightGray"} focus:border-cyan`}
              />
              <label className={labelBase}>Name</label>
            </div>

            <div className="relative">
              <input
                type="email"
                name="user_email"
                placeholder=" "
                value={email.value}
                onChange={(e) => setEmail({ value: e.target.value, touched: true })}
                onBlur={() => setEmail((s) => ({ ...s, touched: true }))}
                className={`${inputBase} ${email.touched ? (emailValid ? "border-green-500" : "border-red-500") : "border-lightGray"} focus:border-cyan`}
              />
              <label className={labelBase}>Email</label>
            </div>

            <div className="relative">
              <textarea
                name="message"
                placeholder=" "
                rows={5}
                value={message.value}
                onChange={(e) => setMessage({ value: e.target.value, touched: true })}
                onBlur={() => setMessage((s) => ({ ...s, touched: true }))}
                className={`${inputBase} ${message.touched ? (messageValid ? "border-green-500" : "border-red-500") : "border-lightGray"} focus:border-cyan`}
              />
              <label className={labelBase}>Message</label>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {status === "success" && <p className="text-sm text-green-500">Message sent successfully!</p>}

            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-md bg-cyan px-6 py-3 font-medium text-black shadow-md transition-colors duration-300 hover:bg-violet disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </motion.button>
          </form>

          {/* Details */}
          <div className="space-y-4 self-start">
            <h3 className="font-serif text-[20px] font-semibold text-cyan">Get in touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-lightGray">
                <MapPinIcon className="h-6 w-6 text-cyan" />
                <span>{personalDetails.location}</span>
              </li>
              <li className="flex items-center gap-3 text-lightGray">
                <PhoneIcon className="h-6 w-6 text-cyan" />
                <a href={`tel:${personalDetails.phone.replace(/\s+/g, "")}`} className="hover:text-violet">
                  {personalDetails.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-lightGray">
                <EnvelopeIcon className="h-6 w-6 text-cyan" />
                <a href={`mailto:${personalDetails.email}`} className="hover:text-violet">
                  {personalDetails.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-lightGray">
                <LinkIcon className="h-6 w-6 text-cyan" />
                <a href={personalDetails.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-violet">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          </div>
        </LiquidContainer>
      </div>
    </section>
  );
}
