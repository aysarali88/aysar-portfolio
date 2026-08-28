import Link from "next/link";

const expertise = [
  "FTTH Operations",
  "OSP Deployment",
  "FTTH Rollout",
  "Fiber Optics",
  "Service Activation",
  "Field Operations",
  "Material Management",
  "Technical Support",
  "Network Troubleshooting",
  "Team Leadership",
  "Process Automation",
  "Operational Reporting",
  "Data Analytics"
];

const projects = [
  {
    title: "FTTH Warehouse & Material Control",
    description:
      "A digital material-management workflow designed around FTTH operations, covering BOQ visibility, material requests, approvals, warehouse issuance, field allocation, returns, reconciliation, inventory tracking, and operational reporting.",
    focus: ["Material flow", "Inventory visibility", "Operational reporting"]
  },
  {
    title: "FTTH Rollout Management",
    description:
      "An operational tracking and dashboard concept for monitoring FTTH rollout progress, productivity, field performance, material utilization, and overall project visibility.",
    focus: ["Rollout progress", "Field productivity", "Project visibility"]
  },
  {
    title: "Digital TSSR & Site Survey",
    description:
      "A digital field-survey workflow for capturing structured site information, photographs, survey evidence, field data, and standardized reporting.",
    focus: ["Site evidence", "Field data", "Standardized reports"]
  }
];

const experience = [
  {
    company: "LICT",
    role: "FTTH Operations / Rollout",
    location: "Libya",
    period: "2026 - Present",
    description:
      "Focused on FTTH rollout, OSP operations, service activation, field coordination, material management, operational tracking, dashboards, and process automation."
  },
  {
    company: "Nokia",
    role: "FTTH Technical Support Team Leader",
    location: "Jordan",
    period: "2019 - 2026",
    description:
      "Led FTTH technical support activities across service activation, field coordination, troubleshooting, operational monitoring, reporting, and workflow improvement."
  },
  {
    company: "Nokia",
    role: "Technical Support Engineer",
    location: "Jordan",
    period: "2017 - 2019",
    description:
      "Supported FTTH technical operations, service activation, troubleshooting, and field support activities."
  },
  {
    company: "The BlueZone",
    role: "NOC Engineer",
    location: "Jordan",
    period: "2016 - 2017",
    description:
      "Handled network monitoring, alarms, incidents, troubleshooting, escalation, and operational reporting."
  }
];

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Expertise", href: "/#expertise" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" }
];

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
        <div className="hero-copy">
          <p className="eyebrow">FTTH / OSP Operations Portfolio</p>
          <h1>Aysar Obeidat</h1>
          <p className="hero-title">
            FTTH Operations & Rollout | OSP Deployment | Telecom Digital
            Transformation
          </p>
          <p className="hero-intro">
            Combining telecom operations experience with digital solutions to
            improve FTTH deployment, material control, field visibility, and
            operational efficiency.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <Link className="button primary" href="/#projects">
              View Projects
            </Link>
            <Link
              className="button secondary"
              href="/#contact"
              aria-label="LinkedIn placeholder in contact section"
            >
              LinkedIn
            </Link>
          </div>
        </div>
        <div className="network-panel" aria-hidden="true">
          <div className="fiber-map">
            <span className="node node-a" />
            <span className="node node-b" />
            <span className="node node-c" />
            <span className="node node-d" />
            <span className="node node-e" />
            <span className="line line-1" />
            <span className="line line-2" />
            <span className="line line-3" />
            <span className="line line-4" />
          </div>
          <div className="panel-metric">
            <span>Operations Focus</span>
            <strong>FTTH Rollout</strong>
          </div>
          <div className="panel-metric">
            <span>Digital Layer</span>
            <strong>Field Visibility</strong>
          </div>
        </div>
      </section>

      <section id="about" className="section-shell split-section">
        <div>
          <p className="section-kicker">About</p>
          <h2>Telecom operations experience shaped by field reality.</h2>
        </div>
        <div className="body-copy">
          <p>
            Aysar is a telecom professional with 10+ years of progressive
            experience across FTTH operations, FTTH rollout, OSP deployment,
            service activation, technical support, field coordination, network
            operations, and team leadership.
          </p>
          <p>
            Alongside operational delivery, he develops internal digital tools,
            dashboards, automation, and practical workflows that help solve real
            telecom operational challenges across material control, reporting,
            field visibility, and process consistency.
          </p>
        </div>
      </section>

      <section id="expertise" className="section-shell">
        <div className="section-heading">
          <p className="section-kicker">Core Expertise</p>
          <h2>Capabilities across rollout, operations, and improvement.</h2>
        </div>
        <div className="expertise-grid" aria-label="Core expertise areas">
          {expertise.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section id="projects" className="section-shell">
        <div className="section-heading">
          <p className="section-kicker">Featured Projects</p>
          <h2>Digital concepts designed for telecom operational control.</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="card-topline">
                <span className="status">Coming Soon</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-focus">
                {project.focus.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="section-shell">
        <div className="section-heading">
          <p className="section-kicker">Professional Experience</p>
          <h2>Operational roles across FTTH, support, and network operations.</h2>
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <article className="experience-item" key={`${item.company}-${item.role}`}>
              <div className="timeline-marker" aria-hidden="true" />
              <div>
                <div className="experience-meta">
                  <span>{item.period}</span>
                  <span>{item.location}</span>
                </div>
                <h3>{item.company}</h3>
                <p className="role">{item.role}</p>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-shell contact-inner">
          <div>
            <p className="section-kicker">Contact</p>
            <h2>Open to FTTH, OSP rollout, and telecom operations opportunities.</h2>
          </div>
          <div className="contact-actions" aria-label="Contact placeholders">
            <span className="contact-link is-placeholder" aria-disabled="true">
              LinkedIn: Placeholder
            </span>
            <span className="contact-link is-placeholder" aria-disabled="true">
              Email: Placeholder
            </span>
            <span className="contact-link is-placeholder" aria-disabled="true">
              Download CV: Placeholder
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
