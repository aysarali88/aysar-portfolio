"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";

const contact = {
  linkedInUrl: "https://www.linkedin.com/in/aysar-obeidat-250ba4a2/",
  email: "aysarobeidat@gmail.com",
  cvUrl: "/Aysar-Obeidat-CV.docx"
};

const navItems = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" }
];

const spliceSections = [
  { id: "about", label: "01 - ABOUT" },
  { id: "expertise", label: "02 - EXPERTISE" },
  { id: "projects", label: "03 - PROJECTS" }
];

const stats = [
  { value: "10+", label: "Years Telecom" },
  { value: "7", label: "Years FTTH Leadership" },
  { value: "3", label: "Digital Systems Built" },
  { value: "2", label: "Active Rollout Regions" }
];

const expertiseGroups = [
  {
    title: "FTTH & OSP",
    icon: "fiber",
    skills: [
      "FTTH rollout & OSP deployment",
      "Fiber optic networks",
      "Service activation",
      "Network troubleshooting",
      "FTTH site survey"
    ]
  },
  {
    title: "Operations & Leadership",
    icon: "ops",
    skills: [
      "Field operations",
      "Team leadership",
      "Material & warehouse operations",
      "Technical support",
      "Rollout follow-up & reporting"
    ]
  },
  {
    title: "Digital Transformation",
    icon: "digital",
    skills: [
      "Telecom process automation",
      "Operational dashboards",
      "Data analytics & KPIs",
      "Workflow digitalization",
      "Data-driven operations"
    ]
  }
];

const projects = [
  {
    id: "warehouse",
    badge: "INTERACTIVE DEMO",
    title: "FTTH Warehouse & Material Control",
    problem:
      "Coordination between material planning, warehouse teams, field teams, and execution can create gaps in material traceability.",
    before: "Manual, scattered material tracking",
    after: "End-to-end traceability, warehouse to field",
    workflow: [
      "BOQ",
      "Material Request",
      "Approval",
      "Warehouse",
      "Field Issue",
      "Return / Transfer",
      "Reconciliation",
      "Reporting"
    ],
    capabilities: [
      "Material Requests & Approval Workflow",
      "Warehouse Inventory Tracking",
      "Material Issue & Return",
      "Warehouse-to-Warehouse Transfer",
      "Field / Technician Material Tracking",
      "Serial & QR Tracking",
      "Stock & Material Movement History",
      "Operational Dashboard & Reporting",
      "Audit Trail & Traceability"
    ],
    href: "/demo/warehouse"
  },
  {
    id: "rollout",
    badge: "INTERACTIVE DEMO",
    title: "FTTH Rollout Management",
    problem:
      "Multiple deployment areas, field teams, activities, materials, and milestones need centralized operational visibility.",
    before: "Fragmented status, reactive follow-up",
    after: "One live view of deployment progress",
    workflow: ["Plan", "Survey", "Deployment", "Progress Tracking", "Field Follow-up", "Completion", "Reporting"],
    capabilities: [
      "Rollout Progress Tracking",
      "Area / Zone Monitoring",
      "Planned vs Actual",
      "Daily & Weekly Productivity",
      "Field Team Performance",
      "Material Utilization Visibility",
      "Delay & Issue Tracking",
      "Operational Dashboards",
      "Management Reporting"
    ],
    href: "/demo/rollout"
  },
  {
    id: "site-survey",
    badge: "INTERACTIVE DEMO",
    title: "FTTH Site Survey & Infrastructure Mapping",
    problem:
      "Manual surveys can create inconsistent field records, incomplete coordinates, and weak visibility of buildings and infrastructure.",
    before: "Inconsistent manual survey records",
    after: "Structured, validated field data with infrastructure visibility",
    workflow: [
      "Area Assignment",
      "Field Survey",
      "Building / Pole Capture",
      "GPS Location",
      "Photos",
      "Validation",
      "Map Visualization",
      "Reporting"
    ],
    capabilities: [
      "Building Survey & Mapping",
      "Pole Survey & Mapping",
      "GPS Coordinates",
      "Interactive Map",
      "Building Type & Status",
      "Users / Premises Data",
      "Field Technician Tracking",
      "Photo Evidence",
      "Area / Technician Filters",
      "Survey Progress KPIs",
      "Search & Data Validation"
    ],
    href: "/demo/site-survey"
  }
];

const experience = [
  {
    period: "2026-Present",
    company: "LICT",
    location: "Libya",
    role: "FTTH Operations / Rollout",
    stage: "FTTH OPERATIONS & ROLLOUT",
    description:
      "FTTH rollout operations, field coordination, deployment follow-up, material coordination, operational reporting, and digital workflow improvement."
  },
  {
    period: "2019-2026",
    company: "Nokia",
    location: "Jordan",
    role: "FTTH Technical Support Team Leader",
    stage: "FTTH TEAM LEADERSHIP",
    description:
      "Led FTTH technical support and activation operations, coordinated field teams, managed service delivery issues, and supported end-to-end FTTH operations."
  },
  {
    period: "2017-2019",
    company: "Nokia",
    location: "Jordan",
    role: "Technical Support Engineer",
    stage: "TECHNICAL SUPPORT",
    description: "FTTH service activation, technical troubleshooting, field support, and operational coordination."
  },
  {
    period: "2016-2017",
    company: "The BlueZone",
    location: "Jordan",
    role: "NOC Engineer",
    stage: "NOC",
    description: "Network monitoring, incident handling, troubleshooting, and operational support."
  }
];

const operatingModel = [
  "Design & Planning",
  "Site Survey",
  "BOQ & Materials",
  "Warehouse",
  "Field Deployment",
  "Rollout Tracking",
  "Activation",
  "As-Built & Reporting"
];

function ContactAction({
  href,
  children,
  download,
  className = "button outline"
}: {
  href: string;
  children: ReactNode;
  download?: boolean;
  className?: string;
}) {
  const isExternal = href.startsWith("http");

  return (
    <a
      className={className}
      href={href}
      download={download}
      rel={isExternal ? "noopener noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}

function LineIcon({ type }: { type: string }) {
  return (
    <svg className="line-icon" viewBox="0 0 44 44" aria-hidden="true">
      {type === "fiber" ? (
        <>
          <path d="M7 28h10l6-12h14" />
          <circle cx="7" cy="28" r="3" />
          <circle cx="23" cy="16" r="3" />
          <circle cx="37" cy="16" r="3" />
        </>
      ) : null}
      {type === "ops" ? (
        <>
          <path d="M9 12h26M9 22h26M9 32h26" />
          <circle cx="15" cy="12" r="3" />
          <circle cx="29" cy="22" r="3" />
          <circle cx="21" cy="32" r="3" />
        </>
      ) : null}
      {type === "digital" ? (
        <>
          <rect x="10" y="10" width="24" height="24" rx="4" />
          <path d="M16 22h12M22 16v12" />
          <circle cx="22" cy="22" r="3" />
        </>
      ) : null}
    </svg>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSplice, setActiveSplice] = useState("about");
  const [splicePositions, setSplicePositions] = useState<Record<string, number>>({});
  const [openProjects, setOpenProjects] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSplice(entry.target.id);
        });
      },
      { threshold: 0.25 }
    );

    spliceSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) sectionObserver.observe(element);
    });

    const calculatePositions = () => {
      const next: Record<string, number> = {};
      spliceSections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) next[section.id] = element.offsetTop + 40;
      });
      setSplicePositions(next);
    };

    calculatePositions();
    window.addEventListener("resize", calculatePositions);

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("resize", calculatePositions);
    };
  }, []);

  const toggleProject = (id: string) => {
    setOpenProjects((current) => ({ ...current, [id]: !current[id] }));
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="home-page" id="top">
      <div className="fiber-route" aria-hidden="true">
        {spliceSections.map((section) => (
          <span
            key={section.id}
            className={`splice-marker ${activeSplice === section.id ? "active" : ""}`}
            style={{ top: `${splicePositions[section.id] ?? 0}px` }}
          >
            <i />
            <b>{section.label}</b>
          </span>
        ))}
      </div>

      <header className="site-header" aria-label="Main navigation">
        <Link className="wordmark" href="#top" onClick={closeMenu} aria-label="Aysar Obeidat home">
          <span aria-hidden="true" />
          <strong>Aysar Obeidat</strong>
        </Link>
        <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen}>
          Menu
        </button>
        <nav className={menuOpen ? "open" : ""}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="hero section-shell">
        <div className="hero-copy reveal">
          <p className="technical-label">FTTH / OSP FIELD OPERATIONS</p>
          <h1>Aysar Obeidat</h1>
          <div className="role-lines" aria-label="Professional focus">
            <span>FTTH Operations & Rollout</span>
            <span>OSP Deployment</span>
            <span>Telecom Digital Transformation</span>
          </div>
          <p className="hero-statement">
            Turning FTTH field operations into measurable, traceable, and digitally managed workflows.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <Link className="button primary" href="#projects">
              View My Work
            </Link>
            <ContactAction href={contact.cvUrl} download>
              Download CV
            </ContactAction>
            <ContactAction href={contact.linkedInUrl}>LinkedIn</ContactAction>
          </div>
          <div className="stats-strip" aria-label="Technical summary">
            {stats.map((item) => (
              <article key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="route-card portrait-route-card reveal" aria-label="Aysar Obeidat professional portrait">
          <Image
            src="/aysar-obeidat-portrait-v2.jpg"
            alt="Aysar Obeidat professional portrait"
            fill
            priority
            sizes="(max-width: 1080px) 82vw, 420px"
          />
        </div>
      </section>

      <section id="about" className="section-shell section-block">
        <SectionHeading label="01 / ABOUT" title="From network operations to FTTH leadership and rollout execution." />
        <div className="about-layout">
          <div className="body-copy reveal">
            <p>
              Aysar Obeidat is a telecom operations professional with 10+ years of experience across network operations,
              FTTH technical support, service activation, team leadership, field coordination, and rollout operations.
            </p>
            <p>
              His work connects the practical realities of FTTH and OSP execution: survey data, field teams, material
              movement, activation follow-up, operational reporting, and issue resolution.
            </p>
            <p>
              Today, his focus is improving field execution through digital operational tools, automation, dashboards,
              and data-driven workflows that make FTTH operations more visible, traceable, and accountable.
            </p>
          </div>
          <div className="fact-list reveal" aria-label="Professional facts">
            {[
              ["10+ years", "Telecom experience"],
              ["7 years", "FTTH team leadership"],
              ["FTTH & OSP", "Operations and rollout"],
              ["Digital tools", "Automation and operational systems"]
            ].map(([value, label]) => (
              <article key={value}>
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="expertise" className="section-shell section-block">
        <SectionHeading label="02 / EXPERTISE" title="Focused capability groups for FTTH delivery and operational control." />
        <div className="expertise-grid">
          {expertiseGroups.map((group) => (
            <article className="expertise-card reveal" key={group.title}>
              <LineIcon type={group.icon} />
              <h3>{group.title}</h3>
              <ul>
                {group.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section-shell section-block projects-section">
        <SectionHeading label="03 / PROJECTS" title="Operational digital solutions shaped around FTTH field execution." />
        <div className="project-stack">
          {projects.map((project) => {
            const isOpen = Boolean(openProjects[project.id]);
            const visibleCapabilities = isOpen ? project.capabilities : project.capabilities.slice(0, 3);

            return (
              <article className="project-card reveal" key={project.id}>
                <div className="project-main">
                  <span className="demo-badge">{project.badge}</span>
                  <h3>{project.title}</h3>
                  <div className="project-problem">
                    <span>Operational Problem</span>
                    <p>{project.problem}</p>
                  </div>
                  <div className="before-after">
                    <article>
                      <span>BEFORE</span>
                      <strong>{project.before}</strong>
                    </article>
                    <article>
                      <span>AFTER</span>
                      <strong>{project.after}</strong>
                    </article>
                  </div>
                  <div className="workflow" aria-label={`${project.title} workflow`}>
                    {project.workflow.map((step, index) => (
                      <span key={step}>
                        <b>{String(index + 1).padStart(2, "0")}</b>
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="project-control">
                  <span className="control-label">Digital Control</span>
                  <div className="capability-chips">
                    {visibleCapabilities.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <button className="capability-toggle" onClick={() => toggleProject(project.id)}>
                    {isOpen ? "Show less" : "Show key capabilities"}
                  </button>
                  <Link className="button primary project-demo-link" href={project.href}>
                    Explore Interactive Demo
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="experience" className="section-shell section-block">
        <SectionHeading label="FIELD EXPERIENCE" title="A clear progression from NOC operations to FTTH rollout leadership." />
        <div className="career-route reveal" aria-label="Career progression">
          {["NOC", "TECHNICAL SUPPORT", "FTTH TEAM LEADERSHIP", "FTTH OPERATIONS & ROLLOUT"].map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
        <div className="experience-list">
          {experience.map((item) => (
            <article className="experience-card reveal" key={`${item.company}-${item.period}`}>
              <span>{item.stage}</span>
              <div>
                <p>{item.period}</p>
                <h3>{item.role}</h3>
                <b>
                  {item.company} - {item.location}
                </b>
                <small>{item.description}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="approach" className="section-shell section-block">
        <SectionHeading
          label="OPERATING MODEL"
          title="Connecting planning, materials, field execution, activation, and reporting into one operational workflow."
        />
        <div className="operating-route reveal">
          {operatingModel.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
        <div className="principles reveal">
          <strong>VISIBILITY</strong>
          <strong>TRACEABILITY</strong>
          <strong>ACCOUNTABILITY</strong>
        </div>
        <p className="approach-note reveal">
          Better operational visibility enables faster decisions, stronger coordination, and more reliable FTTH project
          execution.
        </p>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-shell contact-inner">
          <div className="reveal">
            <p className="technical-label">Let&apos;s Connect</p>
            <h2>
              Interested in FTTH rollout, OSP operations, telecom digital transformation, or discussing opportunities to
              improve field and operational workflows?
            </h2>
          </div>
          <div className="contact-actions reveal" aria-label="Contact actions">
            <ContactAction className="button footer-button" href={`mailto:${contact.email}`}>
              Email Me
            </ContactAction>
            <ContactAction className="button footer-button" href={contact.linkedInUrl}>
              LinkedIn
            </ContactAction>
            <ContactAction className="button footer-button" href={contact.cvUrl} download>
              Download CV
            </ContactAction>
          </div>
        </div>
        <footer className="footer">
          <strong>Aysar Obeidat</strong>
          <span>FTTH · OSP · OPERATIONS · DIGITAL TRANSFORMATION</span>
        </footer>
      </section>
    </main>
  );
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="section-heading reveal">
      <p>{label}</p>
      <h2>{title}</h2>
    </div>
  );
}
