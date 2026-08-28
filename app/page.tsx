import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";

const contact = {
  linkedInUrl: "https://www.linkedin.com/in/aysar-obeidat-250ba4a2/",
  email: "aysarobeidat@gmail.com",
  cvUrl: "/Aysar-Obeidat-CV.docx"
};

const portraitPath = "/aysar-obeidat-portrait-v2.jpg";
const hasPortrait = existsSync(
  join(process.cwd(), "public", "aysar-obeidat-portrait-v2.jpg")
);

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Expertise", href: "/#expertise" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "FTTH Approach", href: "/#approach" },
  { label: "Contact", href: "/#contact" }
];

const expertiseGroups = [
  {
    title: "FTTH & OSP",
    icon: "fiber",
    skills: [
      "FTTH Rollout",
      "OSP Deployment",
      "Fiber Optic Networks",
      "Service Activation",
      "Network Troubleshooting",
      "FTTH Site Survey"
    ]
  },
  {
    title: "Operations & Leadership",
    icon: "operations",
    skills: [
      "Field Operations",
      "Team Leadership",
      "Material & Warehouse Operations",
      "Rollout Follow-up",
      "Technical Support",
      "Operational Reporting"
    ]
  },
  {
    title: "Digital Transformation",
    icon: "digital",
    skills: [
      "Telecom Process Automation",
      "Operational Dashboards",
      "Data Analytics & KPIs",
      "Workflow Digitalization",
      "Digital Field Tools",
      "Data-Driven Operations"
    ]
  }
];

const secondaryProjects = [
  {
    title: "FTTH Rollout Management",
    challenge:
      "FTTH rollout involves multiple areas, field teams, activities, materials, and milestones running simultaneously. Without centralized visibility, tracking progress, productivity, delays, and field performance can become difficult.",
    solution:
      "A digital rollout management platform designed to provide a clear operational view of FTTH deployment progress and support faster, data-driven follow-up.",
    workflow: [
      "Plan",
      "Survey",
      "Deployment",
      "Progress Tracking",
      "Field Follow-up",
      "Completion",
      "Reporting"
    ],
    capabilities: [
      "Rollout Progress Tracking",
      "Area / Zone Monitoring",
      "Planned vs. Actual Progress",
      "Daily & Weekly Productivity",
      "Field Team Performance",
      "Material Utilization Visibility",
      "Delay & Issue Tracking",
      "Operational Dashboards",
      "Management Reporting"
    ],
    visual: "rollout"
  },
  {
    title: "FTTH Site Survey & Infrastructure Mapping",
    challenge:
      "FTTH rollout planning requires accurate field information about buildings, poles, locations, user density, and infrastructure conditions. Manual survey methods can create inconsistent records, missing coordinates, duplicated data, and limited visibility of field progress.",
    solution:
      "A digital FTTH field survey and infrastructure mapping platform designed to capture buildings, poles, GPS coordinates, photos, and field information directly from survey teams while providing real-time visibility of survey progress on an interactive map.",
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
      "Pole Installation / Planting Tracking",
      "GPS Coordinates Capture",
      "Interactive Map Visualization",
      "Building Type & Status",
      "Users / Premises Data",
      "Field Technician Tracking",
      "Photo Evidence",
      "Area & Technician Filters",
      "Survey Progress KPIs",
      "Search & Data Validation"
    ],
    visual: "mapping"
  }
];

const experience = [
  {
    period: "2026 - Present",
    company: "LICT",
    location: "Libya",
    role: "FTTH Operations / Rollout",
    description:
      "FTTH rollout operations, field coordination, deployment follow-up, material coordination, operational reporting, and digital workflow improvement.",
    current: true
  },
  {
    period: "2019 - 2026",
    company: "Nokia",
    location: "Jordan",
    role: "FTTH Technical Support Team Leader",
    description:
      "Led FTTH technical support and activation operations, coordinated field teams, managed service delivery issues, and supported end-to-end FTTH operations."
  },
  {
    period: "2017 - 2019",
    company: "Nokia",
    location: "Jordan",
    role: "Technical Support Engineer",
    description:
      "FTTH service activation, technical troubleshooting, field support, and operational coordination."
  },
  {
    period: "2016 - 2017",
    company: "The BlueZone",
    location: "Jordan",
    role: "NOC Engineer",
    description: "Network monitoring, incident handling, troubleshooting, and operational support."
  }
];

const lifecycle = [
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
  download
}: {
  href: string;
  children: React.ReactNode;
  download?: boolean;
}) {
  if (!href) {
    return (
      <span className="contact-link is-placeholder" aria-disabled="true">
        {children}: Placeholder
      </span>
    );
  }

  const isExternal = href.startsWith("http");

  return (
    <a
      className="contact-link"
      href={href}
      download={download}
      rel={isExternal ? "noopener noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header" aria-label="Main navigation">
        <Link className="brand" href="/#top" aria-label="Aysar Obeidat home">
          <span className="brand-mark" aria-hidden="true" />
          <span>Aysar Obeidat</span>
        </Link>
        <nav>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section id="top" className="hero section-shell">
        <div className="hero-copy reveal">
          <p className="eyebrow">FTTH / OSP Operations Portfolio</p>
          <h1>Aysar Obeidat</h1>
          <p className="hero-title">
            FTTH Operations & Rollout | OSP Deployment | Telecom Digital
            Transformation
          </p>
          <p className="hero-statement">
            Turning FTTH field operations into measurable, traceable, and
            digitally managed workflows.
          </p>
          <p className="hero-support">
            10+ Years Telecom Experience • FTTH • OSP • Operations • Digital
            Transformation
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <Link className="button primary" href="/#projects">
              View My Work
            </Link>
            <ContactAction href={contact.cvUrl} download>
              Download CV
            </ContactAction>
            <ContactAction href={contact.linkedInUrl}>LinkedIn</ContactAction>
          </div>
        </div>

        <div className="hero-visual reveal" aria-label="Professional portrait area">
          <div className="portrait-card">
            <div className="network-panel" aria-hidden="true">
              <span className="hero-node hero-node-a" />
              <span className="hero-node hero-node-b" />
              <span className="hero-node hero-node-c" />
              <span className="hero-line hero-line-a" />
              <span className="hero-line hero-line-b" />
              <span className="hero-line hero-line-c" />
            </div>
            <div className="portrait-frame">
              {hasPortrait ? (
                <Image
                  src={portraitPath}
                  alt="Aysar Obeidat professional portrait"
                  fill
                  priority
                  sizes="(max-width: 920px) 80vw, 380px"
                />
              ) : (
                <div className="portrait-placeholder">
                  <span>Aysar Obeidat</span>
                  <strong>Portrait Placeholder</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section-shell about-section">
        <div className="section-heading reveal">
          <p className="section-kicker">About Me</p>
          <h2>From network operations to FTTH leadership and rollout execution.</h2>
        </div>
        <div className="about-layout">
          <div className="body-copy reveal">
            <p>
              I am a telecom professional with 10+ years of experience across
              network operations, FTTH technical support, service activation, team
              leadership, field coordination, and rollout operations.
            </p>
            <p>
              My experience has given me a practical understanding of how FTTH
              projects move from planning and field execution to activation and
              operational follow-up.
            </p>
            <p>
              Today, I combine that telecom experience with digital tools,
              automation, dashboards, and data-driven workflows to improve
              visibility, material control, field coordination, and operational
              efficiency.
            </p>
            <p>
              I focus on solving real operational challenges, not technology for
              the sake of technology.
            </p>
          </div>
          <div className="metric-grid reveal" aria-label="Professional highlights">
            <article>
              <strong>10+ Years</strong>
              <span>Telecom Experience</span>
            </article>
            <article>
              <strong>7 Years</strong>
              <span>FTTH Team Leadership</span>
            </article>
            <article>
              <strong>FTTH & OSP</strong>
              <span>Operations & Rollout</span>
            </article>
            <article>
              <strong>Digital Transformation</strong>
              <span>Automation & Operational Tools</span>
            </article>
          </div>
        </div>
      </section>

      <section id="expertise" className="section-shell">
        <div className="section-heading reveal">
          <p className="section-kicker">Core Expertise</p>
          <h2>Focused capability groups for FTTH delivery and operational control.</h2>
        </div>
        <div className="expertise-cards">
          {expertiseGroups.map((group) => (
            <article className="expertise-card reveal" key={group.title}>
              <div className={`category-icon ${group.icon}`} aria-hidden="true">
                <span />
              </div>
              <h3>{group.title}</h3>
              <div className="chip-list">
                {group.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section-shell projects-section">
        <div className="section-heading reveal">
          <p className="section-kicker">Featured Projects</p>
          <h2>Operational digital solutions shaped around FTTH field execution.</h2>
        </div>

        <article className="featured-project reveal">
          <div className="project-content">
            <span className="status">Interactive Demo — Under Development</span>
            <h3>FTTH Warehouse & Material Control</h3>
            <div className="project-text">
              <h4>Operational Challenge</h4>
              <p>
                FTTH rollout requires continuous coordination between material
                planning, warehouse operations, field teams, and project execution.
                Without clear material traceability, it becomes difficult to track
                what was requested, approved, issued, transferred, returned, and
                ultimately used in the field.
              </p>
              <h4>Solution</h4>
              <p>
                A digital FTTH material-management workflow designed to provide
                end-to-end visibility and traceability across warehouse and field
                operations.
              </p>
            </div>
            <div className="workflow-flow primary-flow" aria-label="Material control workflow">
              {[
                "BOQ",
                "Material Request",
                "Approval",
                "Warehouse",
                "Field Issue",
                "Return / Transfer",
                "Reconciliation",
                "Reporting"
              ].map((step) => (
                <span key={step}>{step}</span>
              ))}
            </div>
          </div>
          <div className="dashboard-preview" aria-label="Future dashboard screenshot area">
            <div className="preview-topbar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-grid">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="preview-chart">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <p>Future application screenshot area</p>
          </div>
          <div className="capability-panel">
            <h4>Key Capabilities</h4>
            <div className="chip-list dense">
              {[
                "Material Requests & Approval Workflow",
                "Warehouse Inventory Tracking",
                "Material Issue & Return",
                "Warehouse-to-Warehouse Transfer",
                "Field / Technician Material Tracking",
                "Serial & QR Tracking",
                "Stock & Material Movement History",
                "Operational Dashboard & Reporting",
                "Audit Trail & Traceability"
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </article>

        <div className="project-grid">
          {secondaryProjects.map((project) => (
            <article className={`project-card ${project.visual} reveal`} key={project.title}>
              <div className="project-visual" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span className="status">Interactive Demo — Under Development</span>
              <h3>{project.title}</h3>
              <div className="project-text compact">
                <h4>Operational Challenge</h4>
                <p>{project.challenge}</p>
                <h4>Solution</h4>
                <p>{project.solution}</p>
              </div>
              <div className="workflow-flow" aria-label={`${project.title} workflow`}>
                {project.workflow.map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
              <div className="chip-list dense">
                {project.capabilities.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="section-shell">
        <div className="section-heading reveal">
          <p className="section-kicker">Professional Experience</p>
          <h2>A clear progression from NOC operations to FTTH rollout leadership.</h2>
        </div>
        <div className="career-path reveal" aria-label="Career progression">
          {["NOC", "Technical Support", "FTTH Team Leadership", "FTTH Operations & Rollout"].map(
            (step) => (
              <span key={step}>{step}</span>
            )
          )}
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <article className="experience-item reveal" key={`${item.company}-${item.role}`}>
              <div className="timeline-marker" aria-hidden="true" />
              <div>
                <div className="experience-meta">
                  <span>{item.period}</span>
                  <span>
                    {item.company} — {item.location}
                  </span>
                </div>
                <h3>{item.role}</h3>
                {item.current ? (
                  <span className="current-focus">
                    Current Focus: FTTH Rollout + Digital Transformation
                  </span>
                ) : null}
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="approach" className="section-shell approach-section">
        <div className="section-heading reveal">
          <p className="section-kicker">How I Approach FTTH Operations</p>
          <h2>
            Connecting planning, materials, field execution, activation, and
            reporting into one operational workflow.
          </h2>
        </div>
        <div className="lifecycle-flow reveal" aria-label="FTTH operational lifecycle">
          {lifecycle.map((item, index) => (
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
          Better operational visibility enables faster decisions, stronger
          coordination, and more reliable FTTH project execution.
        </p>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-shell contact-inner">
          <div className="reveal">
            <p className="section-kicker">Let&apos;s Connect</p>
            <h2>
              Interested in FTTH rollout, OSP operations, telecom digital
              transformation, or discussing opportunities to improve field and
              operational workflows?
            </h2>
          </div>
          <div className="contact-actions reveal" aria-label="Contact actions">
            <ContactAction href={contact.linkedInUrl}>LinkedIn</ContactAction>
            <ContactAction href={contact.email ? `mailto:${contact.email}` : ""}>
              Email Me
            </ContactAction>
            <ContactAction href={contact.cvUrl} download>
              Download CV
            </ContactAction>
          </div>
        </div>
        <footer className="footer">
          <strong>Aysar Obeidat</strong>
          <span>FTTH Operations • OSP Rollout • Telecom Digital Transformation</span>
        </footer>
      </section>
    </main>
  );
}
