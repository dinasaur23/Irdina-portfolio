import { useEffect, useRef } from "react";

import { useGSAP } from "@gsap/react";

import gsap from "gsap";
import ScrambleText from "../ui/ScrambleText";
function SectionPanel({ section, onClose, onHoverSound, onClickSound }) {
  const backdropRef = useRef();
  const panelRef = useRef();

  useGSAP(() => {
    gsap.fromTo(
      backdropRef.current,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        duration: 0.35,
      },
    );

    gsap.fromTo(
      panelRef.current,
      {
        autoAlpha: 0,
        scale: 0.72,
        y: 70,
      },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      },
    );
  });

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closePanel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function closePanel() {
    onClickSound?.();
    gsap.to(panelRef.current, {
      autoAlpha: 0,
      scale: 0.8,
      y: 60,
      duration: 0.4,
      ease: "power2.in",
    });

    gsap.to(backdropRef.current, {
      autoAlpha: 0,
      duration: 0.4,
      onComplete: onClose,
    });
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closePanel();
    }
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md md:p-8"
      onMouseDown={handleBackdropClick}
    >
      <article
        ref={panelRef}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-white/10 bg-[rgba(8,9,12,0.94)] p-6 shadow-2xl backdrop-blur-2xl md:p-10"
      >
        <button
          type="button"
          onClick={closePanel}
          onPointerEnter={() => {
            onHoverSound?.();
          }}
          aria-label="Close section"
          className="hud-corner-button absolute right-7 top-7"
        >
          <ScrambleText duration={400}>Close</ScrambleText>
        </button>

        <p className="font-technical pr-32 text-xs uppercase tracking-[0.3em] text-zinc-500">
          ///// {section.planet} · {section.number}
        </p>

        <p className="font-technical mt-5 text-sm uppercase tracking-[0.22em] text-zinc-600">
          /// {section.label}
        </p>

        <h2 className="mt-7 max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-zinc-100 md:text-6xl lg:text-7xl">
          {section.title}
        </h2>

        <p className="mt-8 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
          {section.description}
        </p>

        {section.id === "about" && <AboutContent section={section} />}

        {section.id === "projects" && <ProjectsContent section={section} />}

        {section.id === "stack" && <StackContent section={section} />}

        {section.id === "contact" && <ContactContent section={section} />}
      </article>
    </div>
  );
}

function AboutContent({ section }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-3">
      {section.facts.map((fact) => (
        <div
          key={fact.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
            {fact.label}
          </p>

          <p className="mt-3 text-lg font-medium">{fact.value}</p>
        </div>
      ))}
    </div>
  );
}

function ProjectsContent({ section }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2">
      {section.projects.map((project) => {
        const hasLink = Boolean(project.link);

        const cardContent = (
          <>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-zinc-100">
                {project.title}
              </h3>

              {hasLink && (
                <span
                  aria-hidden="true"
                  className="text-zinc-500 transition group-hover:text-zinc-200"
                >
                  ↗
                </span>
              )}
            </div>

            <p className="mt-4 text-sm leading-7 text-zinc-400">
              {project.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-zinc-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          </>
        );

        if (hasLink) {
          return (
            <a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
            >
              {cardContent}
            </a>
          );
        }

        return (
          <article
            key={project.title}
            className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
          >
            {cardContent}
          </article>
        );
      })}
    </div>
  );
}

function StackContent({ section }) {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {section.groups.map((group) => (
        <div
          key={group.title}
          className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
        >
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-zinc-100">
            {group.title}
          </h3>

          <div className="mt-5 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-sm text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactContent({ section }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-3">
      {section.links.map((link) => {
        const isEmail = link.label === "Email";

        return (
          <a
            key={link.label}
            href={link.href}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noreferrer"}
            className="group flex min-h-20 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] px-7 py-6 transition duration-200 hover:border-white/20 hover:bg-white/[0.05]"
          >
            <span className="text-lg font-semibold tracking-[-0.02em] text-zinc-100">
              {link.label}
            </span>

            <span
              aria-hidden="true"
              className="text-sm text-zinc-600 transition group-hover:text-zinc-300"
            >
              ↗
            </span>
          </a>
        );
      })}
    </div>
  );
}

export default SectionPanel;
