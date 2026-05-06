export default function LogoCard({ href, logo, name, description, link, className = "" }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`logo-card ${className}`}
    >
      <div className="logo-card-left">
        <img src={logo} alt={name} className="logo-card-image" />
      </div>
      <div className="logo-card-right">
        <div className="logo-card-name">{name}</div>
        <div className="logo-card-description">{description}</div>
        <div className="logo-card-link">{link}</div>
      </div>
    </a>
  );
}
