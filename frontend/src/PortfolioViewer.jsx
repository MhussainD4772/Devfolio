import React from "react";
import { motion } from "framer-motion";

const icons = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.479C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.966 0-1.75-.79-1.75-1.76s.784-1.76 1.75-1.76 1.75.79 1.75 1.76-.784 1.76-1.75 1.76zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082 4.48 4.48 0 0 0-7.64 4.086A12.72 12.72 0 0 1 3.112 4.89a4.48 4.48 0 0 0 1.388 5.976 4.47 4.47 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.594 4.393 4.5 4.5 0 0 1-2.025.077 4.48 4.48 0 0 0 4.184 3.114A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.017c8.26 0 12.785-6.84 12.785-12.785 0-.195-.004-.39-.013-.583A9.22 9.22 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z" />
    </svg>
  ),
};

export default function PortfolioViewer({ data }) {
  return (
    <motion.div
      className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-8 border border-gray-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Profile */}
      <motion.div
        className="flex flex-col items-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
      >
        <motion.img
          src={data.profile.avatar}
          alt={data.profile.name}
          className="w-24 h-24 rounded-full border-4 border-indigo-200 shadow"
          whileHover={{ scale: 1.12, rotate: 3 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <motion.h2
          className="text-3xl font-bold mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {data.profile.name}
        </motion.h2>
        <motion.p
          className="text-gray-600 mt-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {data.profile.bio}
        </motion.p>
        <motion.p
          className="text-sm text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {data.profile.location}
        </motion.p>
      </motion.div>

      {/* Section Divider */}
      <motion.hr className="my-6 border-gray-200" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.7, duration: 0.6 }} />

      {/* Education */}
      <Section title="Education" delay={0.1}>
        {data.education.map((edu, idx) => (
          <motion.div
            key={idx}
            className="mb-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * idx, duration: 0.5 }}
          >
            <span className="font-semibold">{edu.school}</span> — {edu.degree}
            <span className="text-gray-400"> ({edu.year})</span>
          </motion.div>
        ))}
      </Section>

      <motion.hr className="my-6 border-gray-200" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.8, duration: 0.6 }} />

      {/* Experience */}
      <Section title="Experience" delay={0.2}>
        {data.experience.map((exp, idx) => (
          <motion.div
            key={idx}
            className="mb-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * idx, duration: 0.5 }}
          >
            <span className="font-semibold">{exp.company}</span> — {exp.role}
            <span className="text-gray-400"> ({exp.period})</span>
            <div className="text-sm text-gray-600">{exp.description}</div>
          </motion.div>
        ))}
      </Section>

      <motion.hr className="my-6 border-gray-200" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.9, duration: 0.6 }} />

      {/* Projects */}
      <Section title="Projects" delay={0.3}>
        {data.projects.map((proj, idx) => (
          <motion.div
            key={idx}
            className="mb-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * idx, duration: 0.5 }}
          >
            <motion.a
              href={proj.link}
              className="text-indigo-600 font-medium hover:underline hover:text-indigo-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, color: "#4338ca" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {proj.name}
            </motion.a>
            <div className="text-sm text-gray-600">{proj.description}</div>
          </motion.div>
        ))}
      </Section>

      <motion.hr className="my-6 border-gray-200" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1.0, duration: 0.6 }} />

      {/* Skills */}
      <Section title="Skills" delay={0.4}>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, idx) => (
            <motion.span
              key={idx}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
              whileHover={{ scale: 1.18, backgroundColor: "#6366f1", color: "#fff" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </Section>

      <motion.hr className="my-6 border-gray-200" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1.1, duration: 0.6 }} />

      {/* Social Links */}
      <motion.div className="flex justify-center space-x-6 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.7 }}>
        {data.social.github && (
          <motion.a
            href={data.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full p-3 shadow-lg flex items-center justify-center transition-colors border border-gray-200"
            whileHover={{ scale: 1.18, boxShadow: "0 4px 24px #00000022" }}
            transition={{ type: "spring", stiffness: 300 }}
            aria-label="GitHub"
          >
            {icons.github}
          </motion.a>
        )}
        {data.social.linkedin && (
          <motion.a
            href={data.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-full p-3 shadow-lg flex items-center justify-center transition-colors border border-blue-200"
            whileHover={{ scale: 1.18, boxShadow: "0 4px 24px #2563eb33" }}
            transition={{ type: "spring", stiffness: 300 }}
            aria-label="LinkedIn"
          >
            {icons.linkedin}
          </motion.a>
        )}
        {data.social.twitter && (
          <motion.a
            href={data.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-50 hover:bg-blue-100 text-blue-400 font-semibold rounded-full p-3 shadow-lg flex items-center justify-center transition-colors border border-blue-100"
            whileHover={{ scale: 1.18, boxShadow: "0 4px 24px #0ea5e933" }}
            transition={{ type: "spring", stiffness: 300 }}
            aria-label="Twitter"
          >
            {icons.twitter}
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  );
}

// Reusable section wrapper for consistent headings with animation
function Section({ title, children, delay = 0 }) {
  return (
    <motion.section
      className="mb-2"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7 }}
    >
      <h3 className="font-bold text-lg text-indigo-700 mb-2">{title}</h3>
      {children}
    </motion.section>
  );
}